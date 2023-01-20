import React, { ChangeEvent } from "react";


export interface Step1UpdateInfo {
    dudeName: string;
}

interface Props {
    pendingDudeName: string;
    onUpdate: (info: Step1UpdateInfo) => void;
}

interface State {

}

export class Step1 extends React.Component<Props, State> {

    private pendingDudeNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.onUpdate({
            dudeName: e.target.value,
        });
    };

    render(): React.ReactNode {
        return(
            <div>
                <label>
                    name: <input
                        type='text'
                        value={this.props.pendingDudeName}
                        onChange={this.pendingDudeNameChanged}
                    />
                </label>
            </div>
        );
        
    }
}