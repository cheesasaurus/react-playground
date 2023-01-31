import { DudeStatTypes } from "../exposed/DudeStats";
import { EquipmentService } from "./EquipmentService";
import { IDudeService, SocketMessageQueue, RequestUpdateDude, ResponseCreateDude, ResponseGetDude, ResponseGetDudes, ResponseSwapEquipmentWithOtherDude, ResponseUpdateDude, ServiceError, SocketMessageType } from "../interface";
import { Dude, DudeMap, DudeStatMap, Equipment, EquipmentMap, EquipmentSlot, EquipmentSlots, iterateModelMap, UUID, WeaponTemplate } from "../exposed/models";
import { delayedResponse } from "./service-utils";
import { Race, RacePresetsMap } from "../exposed/DudeModifierPresets/Races";
import { Profession, ProfessionPresetsMap } from "../exposed/DudeModifierPresets/Professions";
import { ArmorTemplates } from "./EquipmentTemplates/ArmorTemplates";
import { WeaponTemplates } from "./EquipmentTemplates/WeaponTemplates";


export class DudeService implements IDudeService {
    private dudes: DudeMap = {};
    private localStorageKey = 'db.dudes';
    private equipmentService: EquipmentService;
    private messageQueue: SocketMessageQueue;

    constructor(messageQueue: SocketMessageQueue, equipmentService: EquipmentService) {
        this.messageQueue = messageQueue;
        this.equipmentService = equipmentService;
        this.load();
    }

    private save(): void {
        // todo: maybe IndexedDB instead of localStorage
        const obj = {
            entries: this.dudes,
        };
        localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
    }

    private load(): void {
        const saved = localStorage.getItem(this.localStorageKey);
        if (saved) {
            const obj = JSON.parse(saved);
            this.dudes = obj.entries;
        }
    }

    public async createDude(name: string): Promise<ResponseCreateDude> {
        name = name.trim();
        const errors = this.checkNewNameErrors(name);
        if (errors.length > 0) {
            return delayedResponse<ResponseCreateDude>({errors});
        }

        const dude = this.newDude(name);
        this.dudes[dude.id] = dude;
        this.save();

        const responseData = structuredClone({
            dude: dude,
            equipment: this.findEquipmentOnDude(dude),
        });

        this.messageQueue.push({
            type: SocketMessageType.DudesCreated,
            data: {
                dudes: {[dude.id]: responseData.dude},
                equipment: responseData.equipment,
            },
        });
        return delayedResponse<ResponseCreateDude>({
            data: responseData,
        });
    }

    public async getDude(dudeId: UUID): Promise<ResponseGetDude> {
        if (!(dudeId in this.dudes)) {
            const errors = [{
                code: 'DoesNotExist',
                message: 'The Dude does not exist.',
            }];
            return delayedResponse<ResponseGetDude>({errors});
        }
        
        const dude = this.dudes[dudeId];

        const responseData = structuredClone({
            dude: dude,
            equipment: this.findEquipmentOnDude(dude),
        });
        return delayedResponse<ResponseGetDude>({data: responseData});
    }

    public async getAllDudes(): Promise<ResponseGetDudes> {
        const equipment: EquipmentMap = {};
        for (const dude of Object.values(this.dudes)) {
            const equippedEquipment = this.findEquipmentOnDude(dude);
            for (const eq of Object.values(equippedEquipment)) {
                equipment[eq.id] = eq;
            }
        }

        const data = structuredClone({
            dudes: this.dudes,
            equipment: equipment,
        });

        return delayedResponse<ResponseGetDudes>({data});
    }

    public async updateDude(pendingDude: RequestUpdateDude): Promise<ResponseUpdateDude> {

        const errors = Array<ServiceError>();
        if (!(pendingDude.id in this.dudes)) {
            errors.push({
                code: 'DoesNotExist',
                message: 'The Dude does not exist.'
            });
        }
        if (pendingDude.name !== undefined) {
            pendingDude.name = pendingDude.name.trim();
            errors.push(...this.checkNameErrors(pendingDude.name));
        }
        if (errors.length > 0) {
            return delayedResponse<ResponseUpdateDude>({errors});
        }

        const dude = this.dudes[pendingDude.id];
        if (pendingDude.creationStep) {
            dude.creation.step = pendingDude.creationStep;
        }
        if (pendingDude.name !== undefined) {
            dude.name = pendingDude.name;
        }
        if (pendingDude.race) {
            dude.race = pendingDude.race;
        }
        if (pendingDude.profession) {
            dude.profession = pendingDude.profession;
        }
        if (pendingDude.finishCreation) {
            await this.finishDudeCreation(dude);
        }
        dude.version++;
        this.save();


        const responseData = structuredClone({
            dude: dude,
            equipment: this.findEquipmentOnDude(dude),
        });

        this.messageQueue.push({
            type: SocketMessageType.DudesUpdated,
            data: {
                dudes: {[dude.id]: responseData.dude},
                equipment: responseData.equipment,
            },
        });
        return delayedResponse<ResponseUpdateDude>({data: responseData});
    }

    public async swapEquipmentWithOtherDude(slot: EquipmentSlot, dudeIdA: string, dudeIdB: string): Promise<ResponseSwapEquipmentWithOtherDude> {
        const errors = Array<ServiceError>();
        if (!(dudeIdA in this.dudes)) {
            errors.push({
                code: 'DoesNotExist',
                message: 'The first Dude does not exist.',
            });
        }
        if (!(dudeIdB in this.dudes)) {
            errors.push({
                code: 'DoesNotExist',
                message: 'The second Dude does not exist.',
            });
        }
        if (errors.length > 0) {
            return delayedResponse<ResponseSwapEquipmentWithOtherDude>({errors});
        }

        const dudeA = this.dudes[dudeIdA];
        const dudeB = this.dudes[dudeIdB];

        const detached = dudeA.equipment[slot];
        dudeA.equipment[slot] = dudeB.equipment[slot];
        dudeB.equipment[slot] = detached;

        dudeA.version++;
        dudeB.version++;
        this.save();

        this.messageQueue.push({
            type: SocketMessageType.DudesUpdated,
            data: structuredClone({
                dudes: {
                    [dudeA.id]: dudeA,
                    [dudeB.id]: dudeB,
                },
                equipment: {
                    ...this.findEquipmentOnDude(dudeA),
                    ...this.findEquipmentOnDude(dudeB),
                },
            }),
        });
        return delayedResponse<ResponseSwapEquipmentWithOtherDude>({});
    }

    private checkNewNameErrors(name: string): Array<ServiceError> {
        const errors = [];
        if (this.isNameTaken(name)) {
            errors.push({
                code: 'NameTaken',
                message: 'That name is already taken.',
            });
        }
        errors.push(...this.checkNameErrors(name));
        return errors;
    }

    private checkNameErrors(name: string): Array<ServiceError> {
        const errors = [];

        const minLength = 3;
        if (name.length < minLength) {
            errors.push({
                code: 'NameTooShort',
                message: `The name must be at least ${minLength} characters long.`,
            });
        }

        const maxLength = 30;
        if (name.length > maxLength) {
            errors.push({
                code: 'NameTooLong',
                message: `The name cannot be more than ${maxLength} characters long.`,
            });
        }

        return errors;
    }

    private isNameTaken(name: string): boolean {
        for (const dude of iterateModelMap(this.dudes)) {
            if (name === dude.name) {
                return true;
            }
        }
        return false;
    }

    private newDude(name: string): Dude {
        return {
            id: window.crypto.randomUUID(),
            name: name,
            hp: {
                max: 100,
                current: 100,
            },
            race: Race.Human,
            profession: Profession.Beggar,
            creation: {
                completed: false,
                step: 2,
            },
            equipment: {
                [EquipmentSlot.Weapon]: undefined,
                [EquipmentSlot.Hat]: undefined,
                [EquipmentSlot.Shirt]: undefined,
                [EquipmentSlot.Gloves]: undefined,
                [EquipmentSlot.Pants]: undefined,
                [EquipmentSlot.Boots]: undefined,
                [EquipmentSlot.Lumberjack]: undefined,
                [EquipmentSlot.Mining]: undefined,
                [EquipmentSlot.Skinning]: undefined,
            },
            stats: this.newDudeStats(),
            actionId: undefined,
            version: 1,
        };
    }

    private newDudeStats(): DudeStatMap {
        const stats = {} as DudeStatMap;
        for (const type of DudeStatTypes) {
            stats[type] = {
                level: {
                    actual: 1,
                    boosted: 1,
                },
                xp: 0,
            };
        }
        return stats;
    }

    private async finishDudeCreation(dude: Dude): Promise<void> {
        dude.equipment = {
            [EquipmentSlot.Weapon]: (await this.starterWeapon(dude))?.id,
            [EquipmentSlot.Hat]: undefined,
            [EquipmentSlot.Shirt]: (await this.equipmentService.createArmor(ArmorTemplates.starterSet.shirt))?.id,
            [EquipmentSlot.Gloves]: (await this.equipmentService.createArmor(ArmorTemplates.starterSet.gloves))?.id,
            [EquipmentSlot.Pants]: (await this.equipmentService.createArmor(ArmorTemplates.starterSet.pants))?.id,
            [EquipmentSlot.Boots]: undefined,
            [EquipmentSlot.Lumberjack]: undefined,
            [EquipmentSlot.Mining]: undefined,
            [EquipmentSlot.Skinning]: undefined,
        };
        this.recalcBoostedStats(dude);
        dude.creation.completed = true;
    }

    private async starterWeapon(dude: Dude): Promise<Equipment|undefined> {
        const template = this.starterWeaponTemplate(dude);
        if (template) {
            return this.equipmentService.createWeapon(template);
        }
        return undefined;
    }

    private starterWeaponTemplate(dude: Dude): WeaponTemplate|undefined {
        // todo: maybe move this to config
        switch (dude.profession) {
            case Profession.Monk:
                return undefined;
            case Profession.Soldier:
                return WeaponTemplates.starterSet.sword;
            case Profession.Lumberjack:
                return WeaponTemplates.starterSet.axe;
            case Profession.Smith:
                return WeaponTemplates.starterSet.hammer;
            case Profession.Assassin:
                return WeaponTemplates.starterSet.dagger;
            case Profession.Hermit:
                return WeaponTemplates.starterSet.staff;
            case Profession.Beggar:
                return WeaponTemplates.starterSet.throwing;
            case Profession.Stablehand:
                return WeaponTemplates.starterSet.whip;
            case Profession.Hunter:
                return WeaponTemplates.starterSet.bow;
            case Profession.Tinkerer:
                return WeaponTemplates.starterSet.crossbow;
            default:
                return undefined;
        }
    }

    private recalcBoostedStats(dude: Dude): void {
        for (const statType of DudeStatTypes) {
            const base = dude.stats[statType].level.actual;
            dude.stats[statType].level.boosted = base;
        }

        const raceModifiers = RacePresetsMap[dude.race].statModifiers;
        for (const modifier of raceModifiers) {
            dude.stats[modifier.type].level.boosted += modifier.magnitude;
        }

        const professionModifiers = ProfessionPresetsMap[dude.profession].statModifiers;
        for (const modifier of professionModifiers) {
            dude.stats[modifier.type].level.boosted += modifier.magnitude;
        }
    }

    private findEquipmentOnDude(dude: Dude): EquipmentMap {
        const equipment: EquipmentMap = {};
        for (const slot of EquipmentSlots) {
            const equipmentId = dude.equipment[slot];
            if (equipmentId) {
                equipment[equipmentId] = this.equipmentService.getSingleEquipment(equipmentId);
            }
        }
        return equipment;
    }

}
