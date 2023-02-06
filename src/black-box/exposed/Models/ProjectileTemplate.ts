import { UUID } from "../models";



export interface ProjectileTemplate {
    id: UUID;
    description: string;
    damage: number;
    speed: number;
}
