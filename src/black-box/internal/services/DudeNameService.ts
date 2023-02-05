import { ApiError } from "../../interface";
import { GameDatabase } from "../db/GameDatabase";

export class DudeNameService {

    public constructor(private db: GameDatabase) {

    }


    public async checkName(name: string): Promise<Array<ApiError>> {
        const errors = [];
        if (await this.isNameTaken(name)) {
            errors.push({
                code: 'NameTaken',
                message: 'That name is already taken.',
            });
        }
        errors.push(...this.checkNameRules(name));
        return errors;
    }

    private checkNameRules(name: string): Array<ApiError> {
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

}
