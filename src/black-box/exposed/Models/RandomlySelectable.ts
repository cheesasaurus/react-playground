import { randomInt } from "../../../utils";
import { Integer, UUID } from "../models";


export interface RandomlySelectable {
    id: UUID;
    weight: Integer;
}


export function randomlySelect(options: RandomlySelectable[]): UUID {
    let maxRoll = 0;
    const rollLookup = [];
    for (const option of options) {
        maxRoll += option.weight;
        rollLookup.push({
            upperInclusive: maxRoll,
            id: option.id,
        });
    }
    const rolledInt = randomInt(1, maxRoll);
    // could do a binary search if there are a lot of options
    // but a linear scan is simpler and actually faster for a small pool
    const selection = rollLookup.find(e => rolledInt <= e.upperInclusive);
    if (!selection) {
        throw Error('Failed to select an option');
    }
    return selection.id;
}
