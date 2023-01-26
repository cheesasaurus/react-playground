import React from "react";
import { Dude } from "../../../black-box/exposed/models";
import { NameWriting, NameWritingUpdateInfo } from "./NameWriting";
import { InnerProps, State } from "../WorkflowCreateDude";
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

    public renderContent(props: InnerProps, state: State): React.ReactNode {
        return (
            <NameWriting
                pendingDudeName={state.pendingDudeName}
                errors={state.errors}
                onUpdate={this.onUpdate}
                onStepCompletionRequested={this.context.transitionToNextStep}
            />
        );
    };

    public async complete(props: InnerProps, state: State): Promise<void> {
        let dude: Dude;
        if (props.dudeId === undefined) {
            const response = await window.blackBox.api.dudes.createDude(state.pendingDudeName);
            if (response.errors && response.errors.length > 0) {
                throw Error(response.errors![0].message);
            }
            dude = response.data!.dude;
            this.context.setDudeId(dude.id);
        }
        else {
            const response = await window.blackBox.api.dudes.updateDude({
                id: props.dudeId,
                name: state.pendingDudeName,
                creationStep: 2,
            });
            if (response.errors && response.errors.length > 0) {
                throw Error(response.errors![0].message);
            }
            dude = response.data!.dude;
        }
        
        if (props.onNameDetermined) {
            props.onNameDetermined(dude.name);
        }
    }
    
}
