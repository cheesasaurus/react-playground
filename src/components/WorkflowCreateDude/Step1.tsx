import styles from './WorkflowCreateDude.module.css';
import React, { ChangeEvent } from "react";


export interface Step1UpdateInfo {
    dudeName: string;
}

interface Props {
    pendingDudeName: string;
    errors: Array<string>;
    onUpdate: (info: Step1UpdateInfo) => void;
    onStepCompletionRequested: () => void;
}

interface State {

}

export class Step1 extends React.Component<Props, State> {

    private pendingDudeNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.onUpdate({
            dudeName: e.target.value,
        });
    };

    private onInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            this.props.onStepCompletionRequested();
        }
    };

    render(): React.ReactNode {

        const errors = this.props.errors.map(errorMessage => <div key={errorMessage}>{errorMessage}</div>);

        return(
            <div className={styles['step-1-container']}>
                <div>
                    name: <input
                        type='text'
                        value={this.props.pendingDudeName}
                        onChange={this.pendingDudeNameChanged}
                        onKeyDown={this.onInputKeyDown}
                        size={30}
                        autoFocus
                    />
                </div>
                <div className={styles['errors']}>
                    {errors}
                </div>
            </div>
        );
        
    }
}