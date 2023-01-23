import React, { CSSProperties } from "react";
import styles from './Dialog.module.css';
import { DialogConfig } from "./DialogConfig";
import { DialogControlContext } from "./DialogContext";


interface Props {
    id: string;
    domId: string;
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
    width: string;
    height: string;
    x?: number;
    y?: number;
}

export class Dialog extends React.Component<Props, State> {
    public static contextType = DialogControlContext;
    declare context: React.ContextType<typeof DialogControlContext>;

    public constructor(props: Props) {
        super(props);
        const cfg = props.config;
        this.state = {
            dragging: false,
            lastDragUpdateX: NaN,
            lastDragUpdateY: NaN,
            offsetLeft: 0,
            offsetTop: 0,
            width: cfg.width ? `${cfg.width}px` : '',
            height: cfg.height ? `${cfg.height}px` : '',
            x: cfg.initialX,
            y: cfg.initialY,
        };
    }

    private close = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.context!.close(this.props.id);
    };

    private bringToFront = () => {
        this.context!.bringToFront(this.props.id);
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
                id={this.props.domId}
                className={styles['dialog']}
                data-dialog-id={this.props.id}
                onClick={this.bringToFront}
                style={this.style()}
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

    private style(): CSSProperties {
        const styleKv = [
            ['marginLeft', -this.state.offsetLeft],
            ['marginTop', -this.state.offsetTop],
            ['width', this.state.width],
            ['height', this.state.height],
        ];
        const transforms = [];
        if (this.state.x !== undefined) {
            styleKv.push(['left', this.state.x]);
            transforms.push('translateX(0)');
        }
        if (this.state.y !== undefined) {
            styleKv.push(['top', this.state.y]);
            transforms.push('translateY(0)');
        }
        styleKv.push(['transform', transforms.join(' ')]);
        return Object.fromEntries(styleKv);
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