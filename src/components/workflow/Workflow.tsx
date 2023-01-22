import styles from './Workflow.module.css';


export interface NavButtonProps {
    visible: boolean,
    disabled: boolean,
    text: string,
    onPressed: () => void,
}

interface WorkflowProps {
    children?: React.ReactNode,
    nav: {
        prev: NavButtonProps,
        next: NavButtonProps,
    },
    overflow: 'hidden' | 'auto',
}

export function Workflow(props: WorkflowProps) {
    const prev = props.nav.prev;
    const next = props.nav.next;
    return (
        <div className={styles.container}>
            <section className={styles['content']} style={{overflow: props.overflow}}>
                {props.children}
            </section>
            <section className={styles['nav-bar']}>
                <div>
                    {renderButton(prev)}
                </div>
                <div>
                    {renderButton(next)}
                </div>
            </section>
        </div>
    );
}


function renderButton(props: NavButtonProps) {
    return (
        <button
            hidden={!props.visible}
            disabled={props.disabled}
            onClick={props.onPressed}
        >
            {props.text}
        </button>
    );
}
