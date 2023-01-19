import React from "react";
import styles from './Dialog.module.css';
import { DialogContext } from "./DialogContext";


interface Props {
    children?: React.ReactNode;
}

interface State {

}


export class Dialog extends React.Component<Props, State> {
    public static contextType = DialogContext;
    declare context: React.ContextType<typeof DialogContext>;

    public render(): React.ReactNode {
        return (
            <div className={styles['dialog']}>
                <header className={styles['dialog-header']}>
                    <div className={styles['dialog-title']}>This is a Dialog</div>
                    <div
                        className={styles['dialog-close']}
                        onClick={this.context.control.close}
                    >
                        x
                    </div>
                </header>
                <section className={styles['dialog-content']}>
                    {this.props.children}
                </section>
            </div>
        );
    }
}