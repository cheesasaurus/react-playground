import React from "react";
import { State } from "./WorkflowCreateDude";




export interface Step {
    complete(state: State): Promise<void>;
    renderContent(state: State): React.ReactNode;
}

export interface StepContext {
    setState(nextState: any): any;
    transitionToNextStep(): void;
}
