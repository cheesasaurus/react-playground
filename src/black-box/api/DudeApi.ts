import { DudeStatTypes } from "../exposed/DudeStats";
import { EquipmentService } from "../internal/services/EquipmentService";
import { IDudeApi, RequestUpdateDude, ResponseCreateDude, ResponseGetDude, ResponseGetDudes, ResponseSwapEquipmentWithOtherDude, ResponseUpdateDude, ApiError } from "../interface";
import { Dude, DudeStatMap, Equipment, EquipmentSlot, UUID, WeaponTemplate } from "../exposed/models";
import { delayedResponse } from "./service-utils";
import { Race, RacePresetsMap } from "../exposed/DudeModifierPresets/Races";
import { Profession, ProfessionPresetsMap } from "../exposed/DudeModifierPresets/Professions";
import { ArmorTemplates } from "../internal/EquipmentTemplates/ArmorTemplates";
import { WeaponTemplates } from "../internal/EquipmentTemplates/WeaponTemplates";
import { GameDatabase } from "../internal/db/GameDatabase";
import { ActionNone } from "../exposed/Models/Action";
import { DudeService } from "../internal/services/DudeService";
import { SocketMessageService } from "../internal/services/SocketMessageService";


export class DudeApi implements IDudeApi {

    constructor(
        private db: GameDatabase,
        private equipmentService: EquipmentService,
        private dudeService: DudeService,
        private socketMessageService: SocketMessageService,
    ) {

    }

    public async createDude(name: string): Promise<ResponseCreateDude> {
        name = name.trim();
        const errors = await this.checkNewNameErrors(name);
        if (errors.length > 0) {
            return delayedResponse<ResponseCreateDude>({errors});
        }

        const dude = this.newDude(name);
        await this.db.dudes.add(dude);

        const snapshot = await this.dudeService.getSnapshot([dude.id]);
        this.socketMessageService.dudesCreated(snapshot);
        return delayedResponse<ResponseCreateDude>({
            data: {
                dude: dude,
                equipment: snapshot.equipment,
                actions: snapshot.actions,
            },
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

        return delayedResponse<ResponseGetDude>({
            data: {
                dude: dude,
                equipment: await this.dudeService.findEquipmentOnDudes([dude]),
                actions: await this.dudeService.findCurrentActions([dude]),
            }
        });
    }

    public async getAllDudes(): Promise<ResponseGetDudes> {
        const dudeIds = await this.db.dudes.toCollection().primaryKeys();
        return delayedResponse<ResponseGetDudes>({
            data: await this.dudeService.getSnapshot(dudeIds),
        });
    }

    public async updateDude(pendingDude: RequestUpdateDude): Promise<ResponseUpdateDude> {
        const errors = Array<ApiError>();
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

        const snapshot = await this.dudeService.getSnapshot([dude.id]);
        this.socketMessageService.dudesUpdated(snapshot);

        return delayedResponse<ResponseUpdateDude>({
            data: {
                dude: dude,
                equipment: snapshot.equipment,
                actions: snapshot.actions,
            },
        });
    }

    public async swapEquipmentWithOtherDude(slot: EquipmentSlot, dudeIdA: string, dudeIdB: string): Promise<ResponseSwapEquipmentWithOtherDude> {
        const db = this.db;
        let dudeA, dudeB;
        const errors = await db.transaction('rw', [db.dudes], async () => {
            const errors = Array<ApiError>();
            [dudeA, dudeB] = await db.dudes.bulkGet([dudeIdA, dudeIdB]);
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
                return errors;
            }
    
            dudeA = dudeA as Dude;
            dudeB = dudeB as Dude;
    
            const detached = dudeA.equipment[slot];
            dudeA.equipment[slot] = dudeB.equipment[slot];
            dudeB.equipment[slot] = detached;
    
            dudeA.version++;
            dudeB.version++;
            await db.dudes.bulkPut([dudeA, dudeB]);
    
            return errors;
        });

        if (errors.length > 0) {
            return delayedResponse<ResponseSwapEquipmentWithOtherDude>({errors});
        }

        const snapshot = await this.dudeService.getSnapshot([dudeIdA, dudeIdB]);
        this.socketMessageService.dudesUpdated(snapshot);
        return delayedResponse<ResponseSwapEquipmentWithOtherDude>({});
    }

    private async checkNewNameErrors(name: string): Promise<Array<ApiError>> {
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

    private checkNameErrors(name: string): Array<ApiError> {
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

}
