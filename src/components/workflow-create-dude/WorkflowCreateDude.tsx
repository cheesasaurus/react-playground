import React from "react";
import { Dude } from "../../black-box/models";
import { NavButtonProps, Workflow } from "../workflow/Workflow";
import { Step1, Step1UpdateInfo } from "./Step1";


interface Props {
    dudeId?: number,
    onWorkflowCompleted?: () => void,
}

interface State {
    dudeId: number | undefined,
    step: number,
    dude: Dude | undefined,
    pendingDudeName: string,
    loading: boolean,
    proceeding: boolean,
    backtracking: boolean,
}

interface Nav {
    prev: NavButtonProps,
    next: NavButtonProps,
}


export class WorkflowCreateDude extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            dudeId: props.dudeId,
            step: 1,
            pendingDudeName: '',
            loading: true,
            proceeding: false,
            backtracking: false,
            dude: undefined,
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
            }
            this.setState({
                loading: false,
                dude: response.data
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
            this.setState({proceeding: false});
        }
    }

    private async completeStep() {
        switch (this.state.step) {
            case 1:
                await this.completeStep1();
        }
        this.setState((state) => ({
            proceeding: false,
            step: state.step + 1,
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
            });
            if (response.errors && response.errors.length > 0) {
                throw Error(response.errors![0].message);
            }
            dude = response.data!;
        }
        this.setState({
            dude: dude,
        });
        // todo: more steps
        if (this.props.onWorkflowCompleted) {
            this.props?.onWorkflowCompleted();
        }
    }

    private startTransitionPrev = () => {
        // todo
    };

    private onStep1Update = (info: Step1UpdateInfo): void => {
        this.setState({
            pendingDudeName: info.dudeName,
        });
    };

    public render(): React.ReactNode {
        return (
            <Workflow nav={this.configureNav()}>
                {this.renderContent()}
            </Workflow>
        );
    }

    private renderContent(): React.ReactNode {
        switch (this.state.step) {
            case 1:
                return (
                    <Step1
                        pendingDudeName={this.state.pendingDudeName}
                        onUpdate={this.onStep1Update}
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
                text: state.step === 3 ? 'Finish' : 'Next',
                onPressed: this.startTransitionNext,
            },
        };
    }

}
