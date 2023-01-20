import { DudeStatType, DudeStatTypes } from "./DudeStats";
import { IDudeService, RequestUpdateDude, ResponseCreateDude, ResponseGetDudes, ResponseUpdateDude, ServiceError } from "./interface";
import { Dude, DudeMap, DudeStat, DudeStatMap, iterateModelMap, WeaponType } from "./models";
import { delayedResponse } from "./service-utils";




export class DudeService implements IDudeService {
    private autoIncrement = 1;
    private dudes: DudeMap = {};
    private localStorageKey = 'db.dudes';

    constructor() {
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
        return delayedResponse<ResponseCreateDude>({data: structuredClone(dude)});
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
            errors.push(...this.checkNameErrors(pendingDude.name));
        }
        if (errors.length > 0) {
            return delayedResponse<ResponseUpdateDude>({errors});
        }

        const dude = this.dudes[pendingDude.id];
        if (pendingDude.name !== undefined) {
            dude.name = pendingDude.name;
        }
        if (pendingDude.luckyNumber) {
            dude.luckyNumber = pendingDude.luckyNumber;
        }
        if (pendingDude.starterWeapon) {
            dude.starterWeapon = pendingDude.starterWeapon;
        }
        this.save();
        return delayedResponse<ResponseUpdateDude>({data: structuredClone(dude)});
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
            luckyNumber: undefined,
            starterWeapon: WeaponType.Sword,
            creationCompleted: false,
            equipment: {
                weapon: undefined,
                hat: undefined,
                shirt: undefined,
                gloves: undefined,
                pants: undefined,
                boots: undefined,
            },
            stats: this.newDudeStats(),
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

}
