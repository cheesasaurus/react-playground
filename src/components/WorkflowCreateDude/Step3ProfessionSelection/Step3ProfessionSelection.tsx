import React from "react";
import { Dude } from "../../../black-box/exposed/models";
import { ProfessionSelection, ProfessionSelectionUpdateInfo } from "./ProfessionSelection";
import { State } from "../WorkflowCreateDude";
import { Step, StepContext } from "../Step";

export class Step3ProfessionSelection implements Step {
    context: StepContext;

    constructor(context: StepContext) {
        this.context = context;
    }

    private onUpdate = (info: ProfessionSelectionUpdateInfo) => {
        this.context.setState({
            pendingProfession: info.selectedProfession,
        });
    };

    public renderContent(state: State): React.ReactNode {
        return (
            <ProfessionSelection
                selectedProfession={state.pendingProfession}
                dude={state.dude!}
                onUpdate={this.onUpdate}
            />
        );
    };

    public async complete(state: State): Promise<void> {
        let dude: Dude;
        const response = await window.blackBox.api.dudes.updateDude({
            id: state.dudeId!,
            profession: state.pendingProfession,
            finishCreation: true,
        });
        if (response.errors && response.errors.length > 0) {
            throw Error(response.errors![0].message);
        }
        dude = response.data!;
        this.context.setState({
            dude: dude,
        });
    }
}
