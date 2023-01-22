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

    private onStep1Update = (info: Step1UpdateInfo): void => {
        this.setState({
            pendingDudeName: info.dudeName,
        });
    };

    private onStep2Update = (info: RaceSelectionUpdateInfo): void => {
        this.setState({
            pendingRace: info.selectedRace,
        });
    }

    private onStep3Update = (info: ProfessionSelectionUpdateInfo): void => {
        this.setState({
            pendingProfession: info.selectedProfession,
        });
    }

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

        switch (this.state.step) {
            case 1:
                return (
                    <Step1
                        pendingDudeName={this.state.pendingDudeName}
                        errors={this.state.errors}
                        onUpdate={this.onStep1Update}
                        onStepCompletionRequested={this.startTransitionNext}
                    />
                );
            case 2:
                return (
                    <RaceSelection
                        selectedRace={this.state.pendingRace}
                        dude={this.state.dude!}
                        onUpdate={this.onStep2Update}
                    />
                );
            case 3:
                return (
                    <ProfessionSelection
                        selectedProfession={this.state.pendingProfession}
                        dude={this.state.dude!}
                        onUpdate={this.onStep3Update}
                    />
                );
            default:
                return undefined;
        }
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
