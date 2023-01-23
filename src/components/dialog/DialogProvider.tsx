import React from "react";
import { DialogControlContext, DialogMonitorContext } from "./DialogContext";
import { DialogControl, DialogMonitor, factoryDialogManagement } from "./DialogManagement";


interface Props {
    children: React.ReactNode;
}


export class DialogProvider extends React.Component<Props> {
    providing: {
        dialogControl: DialogControl,
        dialogMonitor: DialogMonitor,
    };

    public constructor(props: Props) {
        super(props);
        this.providing = factoryDialogManagement();
    }

    public render(): React.ReactNode {
        return (
            <DialogMonitorContext.Provider value={this.providing.dialogMonitor}>
                <DialogControlContext.Provider value={this.providing.dialogControl}>
                    {this.props.children}
                </DialogControlContext.Provider>
            </DialogMonitorContext.Provider>
        );
    }

}
