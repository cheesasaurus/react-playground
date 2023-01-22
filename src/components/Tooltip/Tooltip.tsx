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

    public constructor(props: Props) {
        super(props);
        this.state = {
            hovering: false,
            x: 0,
            y: 0,
        };
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
        this.setState({
            hovering: true,
            x: e.clientX,
            y: e.clientY,
        });
    };

    private onMouseLeave = (e: MouseEvent) => {
        this.setState({
            hovering: false,
        });
    };

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
            top: this.state.y - 10,
            left: this.state.x + 30,
        };

        return(
            <div
                className={styles['tooltip']}
                style={style}
            >
                {this.props.tooltip}
            </div>
        );
    }

}
