import React from "react";
import { Props, State } from "./WorkflowCreateDude";




export interface Step {
    complete(props: Props, state: State): Promise<void>;
    renderContent(state: State): React.ReactNode;
}

export interface StepContext {
    setState(nextState: any): any;
    transitionToNextStep(): void;
}
