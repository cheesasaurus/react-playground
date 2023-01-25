import React from "react";
import { RaceSelection, RaceSelectionUpdateInfo } from "./RaceSelection";
import { InnerProps, State } from "../WorkflowCreateDude";
import { Step, StepContext } from "../Step";

export class Step2RaceSelection implements Step {
    context: StepContext;

    constructor(context: StepContext) {
        this.context = context;
    }

    private onUpdate = (info: RaceSelectionUpdateInfo) => {
        this.context.setState({
            pendingRace: info.selectedRace,
        });
    };

    public renderContent(props: InnerProps, state: State): React.ReactNode {
        return (
            <RaceSelection
                selectedRace={state.pendingRace}
                dude={props.dude!}
                onUpdate={this.onUpdate}
            />
        );
    };

    public async complete(props: InnerProps, state: State): Promise<void> {
        const response = await window.blackBox.api.dudes.updateDude({
            id: props.dudeId!,
            race: state.pendingRace,
            creationStep: 3,
        });
        if (response.errors && response.errors.length > 0) {
            throw Error(response.errors![0].message);
        }
    }
}
