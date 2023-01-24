import React from "react";
import { MessageBus } from "../../utils";
import { DialogControlContext, DialogMonitorContext } from "./DialogContext";
import { DialogControl, DialogManager, DialogMonitor, MessageDialogsUpdated } from "./DialogManagement";


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
        const bus = new MessageBus<MessageDialogsUpdated>();
        const dialogManager = new DialogManager(bus);
        dialogManager.closeFrontmostDialogWhenKeyPressed('Escape');
        this.providing = {
            dialogControl: new DialogControl(dialogManager),
            dialogMonitor: new DialogMonitor(dialogManager, bus)
        };
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
