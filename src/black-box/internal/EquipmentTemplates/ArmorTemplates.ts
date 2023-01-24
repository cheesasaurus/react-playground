import { ArmorTemplate, BodyPart, DamageType, EquipmentSlot } from "../../exposed/models";


interface IArmorTemplates {
    [setName: string]: {
        [ezKey: string]: ArmorTemplate;
    }
}


export const ArmorTemplates: IArmorTemplates = {
    starterSet: {
        hat: {
            id: '37a1be90-edc8-4b59-a4b7-79e700d9795f',
            slot: EquipmentSlot.Hat,
            name: 'Feathered cap',
            defense: 1,
            agilityPenalty: 0,
            effectiveness: {
                [DamageType.bash]: 20,
                [DamageType.slash]: 100,
                [DamageType.pierce]: 100,
            },
            coverage: {
                [BodyPart.Head]: 10
            }
        },
        shirt: {
            id: '5642c813-6003-45f0-b0e8-52039569e6dc',
            slot: EquipmentSlot.Shirt,
            name: 'Raggedy t-shirt',
            defense: 1,
            agilityPenalty: 0,
            effectiveness: {
                [DamageType.bash]: 20,
                [DamageType.slash]: 100,
                [DamageType.pierce]: 100,
            },
            coverage: {
                [BodyPart.Chest]: 90,
                [BodyPart.Torso]: 95,
                [BodyPart.LeftArm]: 10,
                [BodyPart.RightArm]: 10,
            }
        },
        pants: {
            id: '26ff8be3-ecaf-4ae5-869e-811252d24407',
            slot: EquipmentSlot.Pants,
            name: 'Ripped pants',
            defense: 1,
            agilityPenalty: 0,
            effectiveness: {
                [DamageType.bash]: 20,
                [DamageType.slash]: 100,
                [DamageType.pierce]: 100,
            },
            coverage: {
                [BodyPart.Torso]: 5,
                [BodyPart.LeftLeg]: 80,
                [BodyPart.RightLeg]: 80,                
            }
        },
        gloves: {
            id: '56c7587e-0b1f-4ebc-b5a6-81a234d41700',
            slot: EquipmentSlot.Gloves,
            name: 'Hobo gloves',
            defense: 1,
            agilityPenalty: 0,
            effectiveness: {
                [DamageType.bash]: 20,
                [DamageType.slash]: 100,
                [DamageType.pierce]: 100,
            },
            coverage: {
                [BodyPart.LeftArm]: 15,
                [BodyPart.RightArm]: 15,                
            }
        },
    }
};
