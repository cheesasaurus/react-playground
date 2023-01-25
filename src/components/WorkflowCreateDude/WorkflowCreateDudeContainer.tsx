import { useState } from "react";
import { WorkflowCreateDude } from "./WorkflowCreateDude";


export interface Props {
    dudeId?: string,
    onWorkflowCompleted?: () => void,
    onNameDetermined?: (dudeName: string) => void,
}

export function WorkflowCreateDudeContainer(props: Props) {
    // If a dudeId is passed in, we will resume creating an existing dude that hasn't been finished yet.
    // Otherwise we are going to be creating a new dude as part of the workflow,
    // and a dudeId will eventually be created and work its way back up here.
    const [dudeId, setDudeId] = useState(props.dudeId);

    return (
        <WorkflowCreateDude
            dudeId={dudeId}
            setDudeId={setDudeId}
            onWorkflowCompleted={props.onWorkflowCompleted}
            onNameDetermined={props.onNameDetermined}
        />
    );
}
