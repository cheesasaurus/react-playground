import styles from './Tooltip.module.css';
import React from "react";
import ReactDOM from "react-dom";


interface Props {
    children: React.ReactNode;
    mouseX: number,
    mouseY: number,
}


interface State {
    initialBoundingRect: DOMRect | undefined;
}


export class TooltipInstance extends React.Component<Props, State> {
    private el = document.createElement('div');
    private root = document.getElementById('tooltip-root');
    private ref: React.RefObject<HTMLDivElement>;

    public constructor(props: Props) {
        super(props);
        this.ref = React.createRef();
        this.state = {
            initialBoundingRect: undefined,
        };
    }

    public componentDidMount(): void {
        this.root?.appendChild(this.el);
        // trigger a re-render after the component has been added to the dom and can be properly measured
        this.setState({
           initialBoundingRect: this.ref.current!.getBoundingClientRect(),
        });
    }

    public componentWillUnmount(): void {
        this.root?.removeChild(this.el);
        this.setState({
            initialBoundingRect: undefined,
        });
    }

    public render(): React.ReactNode {
        return ReactDOM.createPortal(
            this._render(),
            this.el
        );
    }

    private _render(): React.ReactNode {
        const {x, y} = this.determinePosition(this.props.mouseX, this.props.mouseY);

        const style = {
            top: y,
            left: x,
        };

        return(
            <div
                ref={this.ref}
                className={styles['tooltip']}
                style={style}
            >
                {this.props.children}
            </div>
        );
    }

    private determinePosition(mouseX: number, mouseY: number): {x: number, y:number} {
        const mousePadding = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 20,
        };

        if (!this.state.initialBoundingRect) {
            return {
                x: mouseX + mousePadding.right,
                y: mouseY + mousePadding.bottom,
            };
        }

        const bounds = {
            xMin: 0,
            xMax: document.documentElement.clientWidth,
            yMin: 0,
            yMax: document.documentElement.clientHeight,
        };
        const rect = this.state.initialBoundingRect;

        // x
        let x;
        const xTowardsRightOfMouse = mouseX + mousePadding.right;
        if (xTowardsRightOfMouse + rect.width < bounds.xMax) {
            // tooltip can be at the right side of the mouse
            x = xTowardsRightOfMouse;
        }
        else {
           // not enough room at the right side of the mouse, so put the tooltip to the left
           x = mouseX - rect.width - mousePadding.left;
        }

        // y
        let y;
        const yBelowMouse = mouseY + mousePadding.bottom;
        if (yBelowMouse + rect.height < bounds.yMax) {
            // tooltip can be below the mouse
            y = yBelowMouse;
        }
        else {
            // not enough room below the mouse, so put the tooltip above the mouse
            y = mouseY - rect.height - mousePadding.top;
        }

        return {x, y};
    }

}
