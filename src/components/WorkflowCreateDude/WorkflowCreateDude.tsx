import React from "react";
import { Dude } from "../../black-box/exposed/models";
import { Race } from "../../black-box/exposed/DudeModifierPresets/Races";
import { NavButtonProps, Workflow } from "../Workflow/Workflow";
import { Profession } from "../../black-box/exposed/DudeModifierPresets/Professions";
import { Step3ProfessionSelection } from "./Step3ProfessionSelection/Step3ProfessionSelection";
import { Step2RaceSelection } from "./Step2RaceSelection/Step2RaceSelection";
import { Step1NameWriting } from "./Step1NameWriting/Step1NameWriting";
import { Step } from "./Step";


interface Props {
    dudeId?: number,
    onWorkflowCompleted?: () => void,
}

export interface State {
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
