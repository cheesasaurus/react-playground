import React from "react";
import { UUID } from "../../black-box/exposed/models";
import { InnerProps, State } from "./WorkflowCreateDude";




export interface Step {
    complete(props: InnerProps, state: State): Promise<void>;
    renderContent(props: InnerProps, state: State): React.ReactNode;
}

export interface StepContext {
    setState(nextState: any): any;
    transitionToNextStep(): void;
    setDudeId(dudeId: UUID): void;
}
