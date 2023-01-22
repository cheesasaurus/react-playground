import React from "react";
import { Dude } from "../../../black-box/exposed/models";
import { NameWriting, NameWritingUpdateInfo } from "./NameWriting";
import { State } from "../WorkflowCreateDude";
import { Step, StepContext } from "../Step";

export class Step1NameWriting implements Step {
    context: StepContext;

    constructor(context: StepContext) {
        this.context = context;
    }

    private onUpdate = (info: NameWritingUpdateInfo) => {
        this.context.setState({
            pendingDudeName: info.dudeName,
        });
    };

    public renderContent(state: State): React.ReactNode {
        return (
            <NameWriting
                pendingDudeName={state.pendingDudeName}
                errors={state.errors}
                onUpdate={this.onUpdate}
                onStepCompletionRequested={this.context.transitionToNextStep}
            />
        );
    };

    public async complete(state: State): Promise<void> {
        let dude: Dude;
        if (state.dudeId === undefined) {
            const response = await window.blackBox.api.dudes.createDude(state.pendingDudeName);
            if (response.errors && response.errors.length > 0) {
                throw Error(response.errors![0].message);
            }
            dude = response.data!;
        }
        else {
            const response = await window.blackBox.api.dudes.updateDude({
                id: state.dudeId,
                name: state.pendingDudeName,
                creationStep: 2,
            });
            if (response.errors && response.errors.length > 0) {
                throw Error(response.errors![0].message);
            }
            dude = response.data!;
        }
        this.context.setState({
            dudeId: dude.id,
            dude: dude,
        });
    }
    
}
