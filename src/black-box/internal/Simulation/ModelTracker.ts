import { UUID } from "../../exposed/models";

export class ModelTracker {
    private changeCount = 0;

    private updated = {
        dudes: new Set<UUID>(),
        equipment: new Set<UUID>(),
        actions: new Set<UUID>(),
    };

    private deleted = {
        dudes: new Set<UUID>(),
        equipment: new Set<UUID>(),
        actions: new Set<UUID>(),
    };

    public updatedDude(id: UUID) {
        this.changeCount++;
        this.updated.dudes.add(id);
    }

    public updatedEquipment(id: UUID) {
        this.changeCount++;
        this.updated.equipment.add(id);
    }

    public updatedAction(id: UUID) {
        this.changeCount++;
        this.updated.actions.add(id);
    }

    public deletedDude(id: UUID) {
        this.changeCount++;
        this.updated.dudes.delete(id);
        this.deleted.dudes.add(id);
    }

    public deletedEquipment(id: UUID) {
        this.changeCount++;
        this.updated.equipment.delete(id);
        this.deleted.equipment.add(id);
    }

    public deletedAction(id: UUID) {
        this.changeCount++;
        this.updated.actions.delete(id);
        this.deleted.actions.add(id);
    }

    public getUpdatedModelIds() {
        return {
            dudes: [...this.updated.dudes.values()],
            equipment: [...this.updated.equipment.values()],
            actions: [...this.updated.actions.values()],
        }
    }

    public getDeletedModelIds() {
        return {
            dudes: [...this.deleted.dudes.values()],
            equipment: [...this.deleted.equipment.values()],
            actions: [...this.deleted.actions.values()],
        }
    }

    public haschanges(): boolean {
        return this.changeCount > 0;
    }

}
