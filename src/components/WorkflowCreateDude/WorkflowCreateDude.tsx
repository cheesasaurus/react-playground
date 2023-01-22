import React from "react";
import { Dude } from "../../black-box/exposed/models";
import { Race } from "../../black-box/exposed/DudeModifierPresets/Races";
import { NavButtonProps, Workflow } from "../Workflow/Workflow";
import { RaceSelection, RaceSelectionUpdateInfo } from "./RaceSelection";
import { Step1, Step1UpdateInfo } from "./Step1";
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
    private steps = 3;
    private stepsX: (Step|null)[] = [];

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
        this.stepsX = [
            null,
            new Step1X(stepContext),
            new Step2X(stepContext),
            new Step3X(stepContext),
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
        this.stepsX = [];
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
        switch (this.state.step) {
            case 1:
                await this.completeStep1();
                break;
            case 2:
                await this.completeStep2();
                break;
            case 3:
                await this.completeStep3();
                break;
        }

        const isLastStep = this.state.step === this.steps;
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

    private async completeStep1() {
        let dude: Dude;
        if (this.state.dudeId === undefined) {
            const response = await window.blackBox.api.dudes.createDude(this.state.pendingDudeName);
            if (response.errors && response.errors.length > 0) {
                throw Error(response.errors![0].message);
            }
            dude = response.data!;
        }
        else {
            const response = await window.blackBox.api.dudes.updateDude({
                id: this.state.dudeId,
                name: this.state.pendingDudeName,
                creationStep: 2,
            });
            if (response.errors && response.errors.length > 0) {
                throw Error(response.errors![0].message);
            }
            dude = response.data!;
        }
        this.setState({
            dudeId: dude.id,
            dude: dude,
        });
    }

    private async completeStep2() {
        let dude: Dude;
        const response = await window.blackBox.api.dudes.updateDude({
            id: this.state.dudeId!,
            race: this.state.pendingRace,
            creationStep: 3,
        });
        if (response.errors && response.errors.length > 0) {
            throw Error(response.errors![0].message);
        }
        dude = response.data!;
        this.setState({
            dude: dude,
        });
    }

    private async completeStep3() {
        let dude: Dude;
        const response = await window.blackBox.api.dudes.updateDude({
            id: this.state.dudeId!,
            profession: this.state.pendingProfession,
            finishCreation: true,
        });
        if (response.errors && response.errors.length > 0) {
            throw Error(response.errors![0].message);
        }
        dude = response.data!;
        this.setState({
            dude: dude,
        });
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
        return this.stepsX[this.state.step]?.renderContent(this.props, this.state);
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
                text: state.step === this.steps ? 'Finish' : 'Next',
                onPressed: this.startTransitionNext,
            },
        };
    }

}



interface Step {
    complete(): void;
    renderContent(props: Props, state: State): React.ReactNode;
}

interface StepContext {
    setState(nextState: any): any;
    transitionToNextStep(): void;
}

class Step1X implements Step {
    context: StepContext;

    constructor(context: StepContext) {
        this.context = context;
    }

    private onUpdate = (info: Step1UpdateInfo) => {
        this.context.setState({
            pendingDudeName: info.dudeName,
        });
    };

    public renderContent(props: Props, state: State): React.ReactNode {
        return (
            <Step1
                pendingDudeName={state.pendingDudeName}
                errors={state.errors}
                onUpdate={this.onUpdate}
                onStepCompletionRequested={this.context.transitionToNextStep}
            />
        );
    };

    public complete(): void {
        // todo
    }

}


class Step2X implements Step {
    context: StepContext;

    constructor(context: StepContext) {
        this.context = context;
    }

    private onUpdate = (info: RaceSelectionUpdateInfo) => {
        this.context.setState({
            pendingRace: info.selectedRace,
        });
    };

    public renderContent(props: Props, state: State): React.ReactNode {
        return (
            <RaceSelection
                selectedRace={state.pendingRace}
                dude={state.dude!}
                onUpdate={this.onUpdate}
            />
        );
    };

    public complete(): void {
        // todo
    }
}


class Step3X implements Step {
    context: StepContext;

    constructor(context: StepContext) {
        this.context = context;
    }

    private onUpdate = (info: ProfessionSelectionUpdateInfo) => {
        this.context.setState({
            pendingProfession: info.selectedProfession,
        });
    };

    public renderContent(props: Props, state: State): React.ReactNode {
        return (
            <ProfessionSelection
                selectedProfession={state.pendingProfession}
                dude={state.dude!}
                onUpdate={this.onUpdate}
            />
        );
    };

    public complete(): void {
        // todo
    }
}
