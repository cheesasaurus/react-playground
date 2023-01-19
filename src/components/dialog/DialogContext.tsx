import React from "react";
import { DialogControl } from "./DialogControl";


export const DialogContext = React.createContext({
    control: new DialogControl(),
});
