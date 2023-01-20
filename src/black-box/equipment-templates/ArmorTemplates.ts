import { BodyPart, DamageType, EquipmentSlot } from "../models";

export const ArmorTemplates = {
    starterSet: {
        idRange: [1, 100],
        hat: {
            id: 1,
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
            id: 2,
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
            id: 3,
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
            id: 4,
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
