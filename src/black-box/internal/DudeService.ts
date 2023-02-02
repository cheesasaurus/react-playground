import { DudeStatTypes } from "../exposed/DudeStats";
import { EquipmentService } from "./EquipmentService";
import { IDudeService, RequestUpdateDude, ResponseCreateDude, ResponseGetDude, ResponseGetDudes, ResponseSwapEquipmentWithOtherDude, ResponseUpdateDude, ServiceError, SocketMessageType } from "../interface";
import { Dude, DudeMap, DudeStatMap, Equipment, EquipmentMap, EquipmentSlot, EquipmentSlots, UUID, WeaponTemplate } from "../exposed/models";
import { delayedResponse } from "./service-utils";
import { Race, RacePresetsMap } from "../exposed/DudeModifierPresets/Races";
import { Profession, ProfessionPresetsMap } from "../exposed/DudeModifierPresets/Professions";
import { ArmorTemplates } from "./EquipmentTemplates/ArmorTemplates";
import { WeaponTemplates } from "./EquipmentTemplates/WeaponTemplates";
import { GameDatabase } from "./db/GameDatabase";
import { ActionNone } from "../exposed/Models/Action";


export class DudeService implements IDudeService {

    constructor(private db: GameDatabase, private equipmentService: EquipmentService) {

    }

    public async createDude(name: string): Promise<ResponseCreateDude> {
        name = name.trim();
        const errors = await this.checkNewNameErrors(name);
        if (errors.length > 0) {
            return delayedResponse<ResponseCreateDude>({errors});
        }

        const dude = this.newDude(name);
        await this.db.dudes.add(dude);

        const responseData = structuredClone({
            dude: dude,
            equipment: await this.findEquipmentOnDude(dude),
        });

        this.db.socketMessageQueue.add({
            id: crypto.randomUUID(),
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
        const dude = await this.db.dudes.get(dudeId);
        if (!dude) {
            const errors = [{
                code: 'DoesNotExist',
                message: 'The Dude does not exist.',
            }];
            return delayedResponse<ResponseGetDude>({errors});
        }

        const responseData = structuredClone({
            dude: dude,
            equipment: await this.findEquipmentOnDude(dude),
        });
        return delayedResponse<ResponseGetDude>({data: responseData});
    }

    public async getAllDudes(): Promise<ResponseGetDudes> {
        const dudeMap: DudeMap = {};
        const equipmentMap: EquipmentMap = {};

        const dudes = await this.db.dudes.toArray();
        for (const dude of dudes) {
            dudeMap[dude.id] = dude;
            const equippedEquipment = await this.findEquipmentOnDude(dude);
            for (const equipment of Object.values(equippedEquipment)) {
                equipmentMap[equipment.id] = equipment;
            }
        }

        const data = structuredClone({
            dudes: dudeMap,
            equipment: equipmentMap,
        });

        return delayedResponse<ResponseGetDudes>({data});
    }

    public async updateDude(pendingDude: RequestUpdateDude): Promise<ResponseUpdateDude> {
        const errors = Array<ServiceError>();
        let dude = await this.db.dudes.get(pendingDude.id);        
        if (!dude) {
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

        dude = dude as Dude;
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
        await this.db.dudes.put(dude);

        const responseData = structuredClone({
            dude: dude,
            equipment: await this.findEquipmentOnDude(dude),
        });

        this.db.socketMessageQueue.add({
            id: crypto.randomUUID(),
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
        let [dudeA, dudeB] = await this.db.dudes.bulkGet([dudeIdA, dudeIdB]);
        if (!dudeA) {
            errors.push({
                code: 'DoesNotExist',
                message: 'The first Dude does not exist.',
            });
        }
        if (!dudeB) {
            errors.push({
                code: 'DoesNotExist',
                message: 'The second Dude does not exist.',
            });
        }
        if (errors.length > 0) {
            return delayedResponse<ResponseSwapEquipmentWithOtherDude>({errors});
        }

        dudeA = dudeA as Dude;
        dudeB = dudeB as Dude;

        const detached = dudeA.equipment[slot];
        dudeA.equipment[slot] = dudeB.equipment[slot];
        dudeB.equipment[slot] = detached;

        dudeA.version++;
        dudeB.version++;
        await this.db.dudes.bulkPut([dudeA, dudeB]);

        this.db.socketMessageQueue.add({
            id: crypto.randomUUID(),
            type: SocketMessageType.DudesUpdated,
            data: structuredClone({
                dudes: {
                    [dudeA.id]: dudeA,
                    [dudeB.id]: dudeB,
                },
                equipment: {
                    ...await this.findEquipmentOnDude(dudeA),
                    ...await this.findEquipmentOnDude(dudeB),
                },
            }),
        });
        return delayedResponse<ResponseSwapEquipmentWithOtherDude>({});
    }

    private async checkNewNameErrors(name: string): Promise<Array<ServiceError>> {
        const errors = [];
        if (await this.isNameTaken(name)) {
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

    private async isNameTaken(name: string): Promise<boolean> {
        const count = await this.db.dudes.where('name')
            .equalsIgnoreCase(name)
            .count();

        return count > 0;
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
            actionId: ActionNone.id,
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

    private async findEquipmentOnDude(dude: Dude): Promise<EquipmentMap> {
        const equipment: EquipmentMap = {};
        for (const slot of EquipmentSlots) {
            const equipmentId = dude.equipment[slot];
            if (equipmentId) {
                const instance = await this.equipmentService.getSingleEquipment(equipmentId);
                if (instance) {
                    equipment[equipmentId] = instance;
                }
            }
        }
        return equipment;
    }

}
