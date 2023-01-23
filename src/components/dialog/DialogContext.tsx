import React from "react";
import { DialogControl, DialogMonitor } from "./DialogManagement";

type IDialogControl = DialogControl | undefined;
export const DialogControlContext = React.createContext<IDialogControl>(undefined);

type IDialogMonitor = DialogMonitor | undefined;
export const DialogMonitorContext = React.createContext<IDialogMonitor>(undefined);
