import React from "react";
import { DialogControl } from "./DialogControl";

export type IDialogControlContext = DialogControl | undefined;

export const DialogControlContext = React.createContext<IDialogControlContext>(undefined);
