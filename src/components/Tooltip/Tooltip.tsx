import styles from './Tooltip.module.css';
import React, { MouseEvent } from "react";
import ReactDOM from 'react-dom';


interface Props {
    children: React.ReactElement<any>;
    tooltip: React.ReactNode | string;
}


interface State {
    hovering: boolean;
    x: number;
    y: number;
}


export class Tooltip extends React.Component<Props, State> {
    private el = document.createElement('div');
    private root = document.getElementById('tooltip-root');
    ref: React.RefObject<HTMLDivElement>;

    public constructor(props: Props) {
        super(props);
        this.state = {
            hovering: false,
            x: 0,
            y: 0,
        };
        this.ref = React.createRef();
    }

    public componentDidMount(): void {
        this.root?.appendChild(this.el);
    }

    public componentWillUnmount(): void {
        this.root?.removeChild(this.el);
    }

    private onMouseEnter = (e: MouseEvent) => {
        this.setState({
            hovering: true,
            x: e.clientX,
            y: e.clientY,
        });
    };

    private onMouseMove = (e: MouseEvent) => {
        this.determinePosition(e);
        this.setState({
            hovering: true,
            ...this.determinePosition(e),
        });
        
    };

    private onMouseLeave = (e: MouseEvent) => {
        this.setState({
            hovering: false,
        });
    };

    private determinePosition(e: MouseEvent): {x: number, y:number} {
        const mousePadding = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 20,
        };

        if (!this.ref.current) {
            return {
                x: e.clientX + mousePadding.right,
                y: e.clientY + mousePadding.bottom,
            };
        }

        const bounds = {
            xMin: 0,
            xMax: document.documentElement.clientWidth,
            yMin: 0,
            yMax: document.documentElement.clientHeight, 
        };
        const rect = this.ref.current!.getBoundingClientRect();

        // x
        let x = e.clientX;
        if (x + rect.width > bounds.xMax) {
            // tooltip should be to the left of the mouse
            x = x - rect.width - mousePadding.left;
        }
        else {
            // tooltip should be to the right of the mouse
            x = x + mousePadding.right;
        }

        // y
        let y = e.clientY;
        if (y + rect.height > bounds.yMax) {
            // tooltip should be above the mouse
            y = y - rect.height - mousePadding.top;
        }
        else {
            // tooltip should be below the mouse
            y = y + mousePadding.bottom;
        }

        return {x, y};
    }

    public render(): React.ReactNode {
        return (
            <>
                {this.renderMonitoredChild()}
                {this.renderTooltipPortal()}
            </>            
        );
    }

    private renderMonitoredChild(): React.ReactNode {
        const extraProps = {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave,
            onMouseMove: this.onMouseMove,
        };
        const el = React.Children.only(this.props.children);
        return React.cloneElement(el, extraProps);
    }

    private renderTooltipPortal() {
        return ReactDOM.createPortal(
            this.renderTooltip(),
            this.el
        );
    }

    private renderTooltip(): React.ReactNode {
        if (!this.state.hovering) {
            return undefined;
        }

        const style = {
            top: this.state.y,
            left: this.state.x,
        };

        return(
            <div
                ref={this.ref}
                className={styles['tooltip']}
                style={style}
            >
                {this.props.tooltip}
            </div>
        );
    }

}
