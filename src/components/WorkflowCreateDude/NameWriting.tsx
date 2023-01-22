import styles from './WorkflowCreateDude.module.css';
import React, { ChangeEvent } from "react";


export interface NameWritingUpdateInfo {
    dudeName: string;
}

interface Props {
    pendingDudeName: string;
    errors: Array<string>;
    onUpdate: (info: NameWritingUpdateInfo) => void;
    onStepCompletionRequested: () => void;
}

interface State {

}

export class NameWriting extends React.Component<Props, State> {

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
