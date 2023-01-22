import React from "react";
import { Dude } from "../../black-box/exposed/models";
import { Race } from "../../black-box/exposed/DudeModifierPresets/Races";
import { NavButtonProps, Workflow } from "../Workflow/Workflow";
import { RaceSelection, RaceSelectionUpdateInfo } from "./RaceSelection";
import { NameWriting, NameWritingUpdateInfo } from "./NameWriting";
import { ProfessionSelection, ProfessionSelectionUpdateInfo } from "./ProfessionSelection";
import { Profession } from "../../black-box/exposed/DudeModifierPresets/Professions";


interface Props {
    dudeId?: number,
    onWorkflowCompleted?: () => void,
}

interface State {
    dudeId: number | undefined,
    step: number,
    dude: Dude | undefined,
    loading: boolean,
    proceeding: boolean,
    backtracking: boolean,
    errors: Array<string>,
    pendingDudeName: string,
    pendingRace: Race,
    pendingProfession: Profession,
}

interface Nav {
    prev: NavButtonProps,
    next: NavButtonProps,
}


export class WorkflowCreateDude extends React.Component<Props, State> {
    private stepCount = 3;
    private steps: (Step|null)[] = [];

    public constructor(props: Props) {
        super(props);
        this.state = {
            dudeId: props.dudeId,
            step: 1,
            dude: undefined,
            loading: true,
            proceeding: false,
            backtracking: false,
            errors: Array<string>(),
            pendingDudeName: '',
            pendingRace: Race.Human,
            pendingProfession: Profession.Beggar,
        };
    }

    public componentDidMount(): void {
        const stepContext = {
            setState: (newState: any) => this.setState(newState),
            transitionToNextStep: this.startTransitionNext,
        };
        this.steps = [
            null,
            new Step1NameWriting(stepContext),
            new Step2RaceSelection(stepContext),
            new Step3ProfessionSelection(stepContext),
        ];

        if (!this.props.dudeId) {
            this.setState({
                loading: false,
            });
            return;
        }
        window.blackBox.api.dudes.getDude(this.props.dudeId).then(response => {
            if (response.errors) {
                console.error(response.errors);
                return;
            }
            const dude = response.data!;
            this.setState({
                loading: false,
                dude: dude,
                pendingDudeName: dude.name,
                pendingRace: dude.race,
                pendingProfession: dude.profession,
                step: dude.creation.step,
            });
        });
    }

    public componentWillUnmount() {
        // remove circular reference for gc. (the steps reference this, and this references the steps)
        this.steps = [];
    }

    private startTransitionNext = () => {
        this.transitionNext();
    };

    private async transitionNext() {
        this.setState({proceeding: true});
        try {
            await this.completeStep();
        }
        catch (e) {
            const errors = new Array<string>();
            if (e instanceof Error) {
                errors.push(e.message);
            }

            this.setState({
                proceeding: false,
                errors: errors,
            });
        }
    }

    private async completeStep() {
        await this.steps[this.state.step]?.complete(this.state);

        const isLastStep = this.state.step === this.stepCount;
        if (isLastStep) {
            if (this.props.onWorkflowCompleted) {
                this.props.onWorkflowCompleted();
            }
            return;
        }

        this.setState((state) => ({
            proceeding: false,
            step: state.step + 1,
            errors: [],
        }));
    }

    private startTransitionPrev = () => {
        this.setState((state) => ({
            step: state.step - 1
        }));
    };

    public render(): React.ReactNode {
        return (
            <Workflow nav={this.configureNav()} overflow='hidden'>
                {this.renderContent()}
            </Workflow>
        );
    }

    private renderContent(): React.ReactNode {
        if (this.state.loading) {
            return <span>loading...</span>
        }
        return this.steps[this.state.step]?.renderContent(this.state);
    }

    private configureNav(): Nav {
        const state = this.state;
        return {
            prev: {
                visible: state.step !== 1,
                disabled: state.loading || state.proceeding || state.backtracking,
                text: 'Back',
                onPressed: this.startTransitionPrev,
            },
            next: {
                visible: true,
                disabled: state.loading || state.proceeding || state.backtracking,
                text: state.step === this.stepCount ? 'Finish' : 'Next',
                onPressed: this.startTransitionNext,
            },
        };
    }

}



interface Step {
    complete(state: State): Promise<void>
    renderContent(state: State): React.ReactNode;
}

interface StepContext {
    setState(nextState: any): any;
    transitionToNextStep(): void;
}

class Step1NameWriting implements Step {
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


class Step2RaceSelection implements Step {
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

    async complete(state: State): Promise<void> {
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


class Step3ProfessionSelection implements Step {
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

    async complete(state: State): Promise<void> {
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
