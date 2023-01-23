import React from "react";
import { Dude } from "../../../black-box/exposed/models";
import { RaceSelection, RaceSelectionUpdateInfo } from "./RaceSelection";
import { Props, State } from "../WorkflowCreateDude";
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

    public renderContent(state: State): React.ReactNode {
        return (
            <RaceSelection
                selectedRace={state.pendingRace}
                dude={state.dude!}
                onUpdate={this.onUpdate}
            />
        );
    };

    public async complete(props: Props, state: State): Promise<void> {
        let dude: Dude;
        const response = await window.blackBox.api.dudes.updateDude({
            id: state.dudeId!,
            race: state.pendingRace,
            creationStep: 3,
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
