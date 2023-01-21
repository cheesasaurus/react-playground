import styles from './DudeList.module.css';
import { Dude } from "../../black-box/exposed/models";
import { HitPoints } from './HitPoints';


interface Props {
    dude: Dude;
}


export function DudeListItem(props: Props) {
    const dude = props.dude;
    return (
        <div className={styles['dude']}>
            <div className={styles['dude-name']} title={dude.name}>{dude.name}</div>
            <div className={styles['dude-hp']}>
                <HitPoints hp={dude.hp}></HitPoints>
            </div>
        </div>
    );
}


