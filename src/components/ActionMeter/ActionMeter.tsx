import { useState } from 'react';
import { Abilities } from '../../black-box/exposed/Abilities/Abilities';
import { Action, ActionDataIdling, ActionType } from '../../black-box/exposed/Models/Action';
import { SimulationState } from '../../store/slices/simulation/simulationSlice';
import { useInterval } from '../hooks';
import styles from './ActionMeter.module.css';


interface Props {
    action: Action;
    simulation: SimulationState;
}


export function ActionMeter(props: Props): JSX.Element {
    const [now, setNow] = useState(Date.now());
    useInterval(() => setNow(Date.now()), 16);

    const actionDescription = describeAction(props.action);
    const percent  = computePercent(now, props.simulation, props.action);

    return (
        <div className={styles['meter']}>
            <div className={styles['meter-filler']} style={{width: `${percent}%`}}></div>
            <span className={styles['meter-text']}>
                {actionDescription}
            </span>
        </div>
    );
}

function computePercent(now: number, simulation: SimulationState, action: Action|undefined) {
    if (!action || action.type === ActionType.None) {
        return 0;
    }
    const start = action.timeStart;
    const end = action.timeComplete;

    let tickTimestamp = now - simulation.tickOffset;
    if (simulation.isPaused) {
        const pauseDuration = now - simulation.pauseTimestamp;
        tickTimestamp -= pauseDuration;
    }

    const targetDuration = end - start;
    const durationElapsed = tickTimestamp - start;
    const progress = durationElapsed / targetDuration;
    return 100 * Math.min(1, progress);
}


function describeAction(action: Action|undefined) {
    if (!action) {
        return '';
    }
    if (action.type === ActionType.None) {
        return '';
    }
    if (action.type === ActionType.Idling) {
        const data = action.data as ActionDataIdling;
        const ability = Abilities[data.abilityId];
        return ability.description.present;
    }
    return 'Unknown action';
}
