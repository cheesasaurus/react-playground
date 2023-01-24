import { DudeStatTypes } from "../exposed/DudeStats";
import { EquipmentService } from "./EquipmentService";
import { IDudeService, MessageQueue, RequestUpdateDude, ResponseCreateDude, ResponseGetDude, ResponseGetDudes, ResponseSwapEquipmentWithOtherDude, ResponseUpdateDude, ServiceError, SocketMessageType } from "../interface";
import { Dude, DudeMap, DudeStatMap, EquipmentSlot, iterateModelMap, Weapon, WeaponTemplate } from "../exposed/models";
import { delayedResponse } from "./service-utils";
import { Race, RacePresetsMap } from "../exposed/DudeModifierPresets/Races";
import { Profession, ProfessionPresetsMap } from "../exposed/DudeModifierPresets/Professions";
import { ArmorTemplates } from "./EquipmentTemplates/ArmorTemplates";
import { WeaponTemplates } from "./EquipmentTemplates/WeaponTemplates";


export class DudeService implements IDudeService {
    private autoIncrement = 1;
    private dudes: DudeMap = {};
    private localStorageKey = 'db.dudes';
    private equipmentService: EquipmentService;
    private messageQueue: MessageQueue;

    constructor(messageQueue: MessageQueue, equipmentService: EquipmentService) {
        this.messageQueue = messageQueue;
        this.equipmentService = equipmentService;
        this.load();
    }

    private save(): void {
        // todo: maybe IndexedDB instead of localStorage
        const obj = {
            autoIncrement: this.autoIncrement,
            entries: this.dudes,
        };
        localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
    }

    private load(): void {
        const saved = localStorage.getItem(this.localStorageKey);
        if (saved) {
            const obj = JSON.parse(saved);
            this.autoIncrement = obj.autoIncrement;
            this.dudes = obj.entries;
        }
    }

    public createDude(name: string): Promise<ResponseCreateDude> {
        name = name.trim();
        const errors = this.checkNewNameErrors(name);
        if (errors.length > 0) {
            return delayedResponse<ResponseCreateDude>({errors});
        }

        const dude = this.newDude(name);
        this.dudes[dude.id] = dude;
        this.save();
        const dudeCopy = structuredClone(dude);
        this.messageQueue.push({
            type: SocketMessageType.DudeCreated,
            data: dudeCopy,
        });
        return delayedResponse<ResponseCreateDude>({data: dudeCopy});
    }

    public getDude(dudeId: number): Promise<ResponseGetDude> {
        if (!(dudeId in this.dudes)) {
            const errors = [{
                code: 'DoesNotExist',
                message: 'The Dude does not exist.'
            }];
            return delayedResponse<ResponseGetDude>({errors});
        }
        return delayedResponse<ResponseGetDude>({data: structuredClone(this.dudes[dudeId])});
    }

    public getDudes(): Promise<ResponseGetDudes> {
        return delayedResponse<ResponseGetDudes>({data: structuredClone(this.dudes)});
    }

    public updateDude(pendingDude: RequestUpdateDude): Promise<ResponseUpdateDude> {

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
            this.finishDudeCreation(dude);
        }
        dude.version++;
        this.save();
        const dudeCopy = structuredClone(dude);
        this.messageQueue.push({
            type: SocketMessageType.DudeUpdated,
            data: dudeCopy,
        });
        return delayedResponse<ResponseUpdateDude>({data: dudeCopy});
    }

    public swapEquipmentWithOtherDude(slot: EquipmentSlot, dudeIdA: number, dudeIdB: number): Promise<ResponseSwapEquipmentWithOtherDude> {
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
        // @ts-ignore
        dudeA.equipment[slot] = dudeB.equipment[slot];
        // @ts-ignore
        dudeB.equipment[slot] = detached;

        dudeA.version++;
        dudeB.version++;
        this.save();
        
        this.messageQueue.push({
            type: SocketMessageType.DudeUpdated,
            data: structuredClone(dudeA),
        });
        this.messageQueue.push({
            type: SocketMessageType.DudeUpdated,
            data: structuredClone(dudeB),
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
            id: this.autoIncrement++,
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

    private finishDudeCreation(dude: Dude): void {
        dude.equipment = {
            [EquipmentSlot.Weapon]: this.starterWeapon(dude),
            [EquipmentSlot.Hat]: undefined,
            [EquipmentSlot.Shirt]: this.equipmentService.createArmor(ArmorTemplates.starterSet.shirt),
            [EquipmentSlot.Gloves]: this.equipmentService.createArmor(ArmorTemplates.starterSet.gloves),
            [EquipmentSlot.Pants]: this.equipmentService.createArmor(ArmorTemplates.starterSet.pants),
            [EquipmentSlot.Boots]: undefined,
            [EquipmentSlot.Lumberjack]: undefined,
            [EquipmentSlot.Mining]: undefined,
            [EquipmentSlot.Skinning]: undefined,
        };
        this.recalcBoostedStats(dude);
        dude.creation.completed = true;
    }

    private starterWeapon(dude: Dude): Weapon|undefined {
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

}
