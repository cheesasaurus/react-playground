import React from "react";
import { DialogControl } from "./DialogControl";


export interface IDialogContext {
    control: DialogControl | undefined;
}

export const DialogContext = React.createContext<IDialogContext>({
    control: undefined,
});
