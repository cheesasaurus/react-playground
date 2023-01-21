import React from "react";
import styles from './Dialog.module.css';
import { DialogConfig } from "./DialogConfig";
import { DialogContext } from "./DialogContext";


interface Props {
    id: string;
    config: DialogConfig;
    children: React.ReactNode;
    dragBoundary?: React.RefObject<HTMLElement>;
}

interface State {
    dragging: boolean;
    lastDragUpdateX: number,
    lastDragUpdateY: number,
    offsetLeft: number;
    offsetTop: number;
}

export class Dialog extends React.Component<Props, State> {
    public static contextType = DialogContext;
    declare context: React.ContextType<typeof DialogContext>;

    public constructor(props: Props) {
        super(props);
        this.state = {
            dragging: false,
            lastDragUpdateX: NaN,
            lastDragUpdateY: NaN,
            offsetLeft: 0,
            offsetTop: 0,
        };
    }

    private close = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.context.control!.close(this.props.id);
    };

    private bringToFront = () => {
        this.context.control!.bringToFront(this.props.id);
    };

    private onCloseButtonMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    private onHeaderMouseDown = (e: React.MouseEvent) => {
        this.bringToFront();
        document.addEventListener('mouseup', this.onGlobalMouseUpWhileDragging);
        document.addEventListener('mousemove', this.onGlobalMouseMoveWhileDragging);
        this.setState({
            dragging: true,
            lastDragUpdateX: e.clientX,
            lastDragUpdateY: e.clientY,
        });
    };

    private onGlobalMouseUpWhileDragging = (e: MouseEvent) => {
        const pos = this.clampedPos(e);
        const offset = {
            x: pos.x - this.state.lastDragUpdateX,
            y: pos.y - this.state.lastDragUpdateY,
        };
        document.removeEventListener('mouseup', this.onGlobalMouseUpWhileDragging);
        document.removeEventListener('mousemove', this.onGlobalMouseMoveWhileDragging);
        this.setState({
            dragging: false,
            offsetLeft: this.state.offsetLeft - offset.x,
            offsetTop: this.state.offsetTop - offset.y,
        });
    };

    private onGlobalMouseMoveWhileDragging = (e: MouseEvent) => {
        const pos = this.clampedPos(e);
        const offset = {
            x: pos.x - this.state.lastDragUpdateX,
            y: pos.y - this.state.lastDragUpdateY,
        };
        this.setState({
            dragging: false,
            lastDragUpdateX: pos.x,
            lastDragUpdateY: pos.y,
            offsetLeft: this.state.offsetLeft - offset.x,
            offsetTop: this.state.offsetTop - offset.y,
        });
    };

    /**
     * Given the MouseEvent e, determine the nearest on-screen position
     * @param e 
     */
    private clampedPos(e: MouseEvent) {
        const boundary = this.props.dragBoundary;
        let minX, maxX, minY, maxY;
        if (boundary) {
            const rect = boundary.current!.getBoundingClientRect();
            minX = rect.left;
            maxX = rect.right;
            minY = rect.top;
            maxY = rect.bottom;
        }
        else {
            minX = 0;
            maxX = window.innerWidth;
            minY = 0;
            maxY = window.innerHeight;
        }

        return {
            x: Math.min(maxX, Math.max(minX, e.clientX)),
            y: Math.min(maxY, Math.max(minY, e.clientY))
        };
    }

    public render(): React.ReactNode {
        return (
            <div
                className={styles['dialog']}
                data-dialog-id={this.props.id}
                onClick={this.bringToFront}
                style={{
                    marginLeft: -this.state.offsetLeft,
                    marginTop: -this.state.offsetTop,
                }}
            >
                <header className={styles['dialog-header']} onMouseDown={this.onHeaderMouseDown}>
                    <div className={styles['dialog-title']}>
                        {this.props.config.title}
                    </div>
                    <div
                        className={styles['dialog-close']}
                        onMouseDown={this.onCloseButtonMouseDown}
                        onClick={this.close}
                    >
                        x
                    </div>
                </header>
                {this.renderContent()}
            </div>
        );
    }

    private renderContent(): React.ReactNode {
        if (this.props.config.useRawContent) {
            return this.props.children;
        }
        return (
            <section className={styles['dialog-content']}>
                {this.props.children}
            </section>
        );
    }
}