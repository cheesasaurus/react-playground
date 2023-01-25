import React from "react";
import { ProfessionSelection, ProfessionSelectionUpdateInfo } from "./ProfessionSelection";
import { InnerProps, State } from "../WorkflowCreateDude";
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

    public renderContent(props: InnerProps, state: State): React.ReactNode {
        return (
            <ProfessionSelection
                selectedProfession={state.pendingProfession}
                dude={props.dude!}
                onUpdate={this.onUpdate}
            />
        );
    };

    public async complete(props: InnerProps, state: State): Promise<void> {
        const response = await window.blackBox.api.dudes.updateDude({
            id: props.dudeId!,
            profession: state.pendingProfession,
            finishCreation: true,
        });
        if (response.errors && response.errors.length > 0) {
            throw Error(response.errors![0].message);
        }
    }

}
