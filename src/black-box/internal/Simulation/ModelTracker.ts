import { UUID } from "../../exposed/models";

export class ModelTracker {
    private updated = {
        dudes: new Set(),
        equipment: new Set(),
        actions: new Set(),
    };

    private deleted = {
        dudes: new Set(),
        equipment: new Set(),
        actions: new Set(),
    };

    public updatedDude(id: UUID) {
        this.updated.dudes.add(id);
    }

    public updatedEquipment(id: UUID) {
        this.updated.equipment.add(id);
    }

    public updatedAction(id: UUID) {
        this.updated.actions.add(id);
    }

    public deletedDude(id: UUID) {
        this.updated.dudes.delete(id);
        this.deleted.dudes.add(id);
    }

    public deletedEquipment(id: UUID) {
        this.updated.equipment.delete(id);
        this.deleted.equipment.add(id);
    }

    public deletedAction(id: UUID) {
        this.updated.actions.delete(id);
        this.deleted.actions.add(id);
    }

}
