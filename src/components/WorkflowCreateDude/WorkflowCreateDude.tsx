import React from "react";
import { Dude } from "../../black-box/exposed/models";
import { Race } from "../../black-box/exposed/DudeModifierPresets/Races";
import { NavButtonProps, Workflow } from "../Workflow/Workflow";
import { Profession } from "../../black-box/exposed/DudeModifierPresets/Professions";
import { Step3ProfessionSelection } from "./Step3ProfessionSelection/Step3ProfessionSelection";
import { Step2RaceSelection } from "./Step2RaceSelection/Step2RaceSelection";
import { Step1NameWriting } from "./Step1NameWriting/Step1NameWriting";
import { Step } from "./Step";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { DudesThunks } from "../../store/slices/db/thunks/dudes";


interface Props {
    dudeId?: string,
    onWorkflowCompleted?: () => void,
    onNameDetermined?: (dudeName: string) => void,
    setDudeId: (dudeId: string) => void,
}

export interface InnerProps extends Props {
    dude: Dude | undefined,
    loadDude: (dudeId: string) => void;
}

export interface State {
    step: number,
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

const mapStateToProps = (state: RootState, props: Props) => {
    if (!props.dudeId) {
        return {
            dude: undefined,
        };
    }
    return {
        dude: state.db.entities.dudes[props.dudeId],
    };
};

const mapDispatchToProps = (dispatch: AppDispatch, props: Props) => {
    return {
        loadDude: (dudeId: string) => dispatch(DudesThunks.fetchOneById(dudeId)),
    };
};


export const WorkflowCreateDude = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<InnerProps, State> {
        private stepCount = 3;
        private steps: (Step|null)[] = [];
    
        public constructor(props: InnerProps) {
            super(props);
            this.state = {
                step: props.dude ? props.dude.creation.step : 1,
                loading: !!(props.dudeId && !props.dude),
                proceeding: false,
                backtracking: false,
                errors: Array<string>(),
                pendingDudeName: props.dude ? props.dude.name : '',
                pendingRace: props.dude ? props.dude.race : Race.Human,
                pendingProfession: props.dude ? props.dude.profession : Profession.Beggar,
            };
            this.initSteps();
        }
    
        public componentDidMount(): void {
            this.initSteps();
            if (!this.props.dudeId) {
                return;
            }
            if (this.props.onNameDetermined && this.props.dude) {
                this.props.onNameDetermined(this.props.dude.name);
            }
            this.props.loadDude(this.props.dudeId);
        }
    
        public componentWillUnmount() {
            // remove circular reference for gc.
            // (the steps reference this via the context, and this references the steps)
            this.steps = [];
        }

        private initSteps() {
            const stepContext = {
                setState: (newState: any) => this.setState(newState),
                transitionToNextStep: this.startTransitionNext,
                setDudeId: (dudeId: string) => this.props.setDudeId(dudeId),
            };
            this.steps = [
                null,
                new Step1NameWriting(stepContext),
                new Step2RaceSelection(stepContext),
                new Step3ProfessionSelection(stepContext),
            ];
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
            await this.steps[this.state.step]?.complete(this.props, this.state);
    
            const isLastStep = this.state.step === this.stepCount;
            if (isLastStep) {
                if (this.props.onWorkflowCompleted) {
                    this.props.onWorkflowCompleted();
                }
                return;
            }
    
            this.setState((state) => ({
                proceeding: false,
                errors: [],
                step: state.step + 1,
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
            return this.steps[this.state.step]?.renderContent(this.props, this.state);
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
);
