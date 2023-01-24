import { ArmorTemplate, WeaponTemplate } from "../../exposed/models";
import { ArmorTemplates } from "./ArmorTemplates";
import { WeaponTemplates } from "./WeaponTemplates";

interface IEquipmentTemplateLookup {
    [id: string]: WeaponTemplate | ArmorTemplate,
};

export const EquipmentTemplateLookup: IEquipmentTemplateLookup = {};

// populate armor templates
for (const setName in ArmorTemplates) {
    if (ArmorTemplates.hasOwnProperty(setName)) {
        const armorSet = ArmorTemplates[setName];
        for (const ezKey in armorSet) {
            if (armorSet.hasOwnProperty(ezKey)) {
                const armorTemplate = armorSet[ezKey];
                EquipmentTemplateLookup[armorTemplate.id] = armorTemplate;
            }
        }
    }
}

// populate weapon templates
for (const setName in WeaponTemplates) {
    if (WeaponTemplates.hasOwnProperty(setName)) {
        const weaponSet = WeaponTemplates[setName];
        for (const ezKey in weaponSet) {
            if (weaponSet.hasOwnProperty(ezKey)) {
                const template = weaponSet[ezKey];
                EquipmentTemplateLookup[template.id] = template;
            }
        }
    }
}
