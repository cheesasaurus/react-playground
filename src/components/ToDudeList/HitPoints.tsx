import { HP } from '../../black-box/exposed/models';
import styles from './DudeList.module.css';

interface Props {
    hp: HP;
}

export function HitPoints(props: Props) {
    const hp = props.hp;
    const percent = 100 * Math.min(1, hp.current / hp.max)
    return (
        <div className={styles['hp']}>
            <div className={styles['hp-label']}>HP</div>
            <div className={styles['hp-meter']}>
                <div className={styles['hp-meter-filler']} style={{width: `${percent}%`}}></div>
                <span className={styles['hp-meter-text']}>
                    {hp.current} / {hp.max}
                </span>
            </div>
        </div>
    );
}