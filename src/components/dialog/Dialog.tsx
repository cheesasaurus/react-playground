import React from "react";
import styles from './Dialog.module.css';
import { DialogContext } from "./DialogContext";


interface Props {
    id: string;
    title?: string;
    children: React.ReactNode;
}

interface State {

}


export class Dialog extends React.Component<Props, State> {
    public static contextType = DialogContext;
    declare context: React.ContextType<typeof DialogContext>;

    private close = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.context.control.close(this.props.id);
    };

    private bringToFront = () => {
        this.context.control.bringToFront(this.props.id);
    };

    public render(): React.ReactNode {
        return (
            <div
                className={styles['dialog']}
                data-dialog-id={this.props.id}
                onClick={this.bringToFront}
            >
                <header className={styles['dialog-header']}>
                    <div className={styles['dialog-title']}>
                        {this.props.title}
                    </div>
                    <div
                        className={styles['dialog-close']}
                        onClick={this.close}
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