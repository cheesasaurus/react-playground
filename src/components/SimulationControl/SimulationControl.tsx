import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";


interface Props {
    
}

export function SimulationControl(props: Props) {
    const [waiting, setWaiting] = useState(false);

    const onPlay = useCallback(async () => {
        setWaiting(true);
        await window.blackBox.api.simulation.play();
        setWaiting(false);
    }, []);

    const onPause = useCallback(async () => {
        setWaiting(true);
        await window.blackBox.api.simulation.pause();
        setWaiting(false);
    }, []);

    const isSimulationPaused = useSelector((state: RootState) => state.simulation.isPaused);
    const disablePlay = waiting || !isSimulationPaused;
    const disablePause = waiting || isSimulationPaused;

    return (
        <div>
            Simulation:&nbsp;
            <button onClick={onPlay} disabled={disablePlay}>Play</button>
            <button onClick={onPause} disabled={disablePause}>Pause</button>
        </div>
    );
}