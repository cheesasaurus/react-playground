import React, { MouseEvent } from "react";
import { TooltipInstance } from './TooltipInstance';


interface Props {
    children: React.ReactElement<any>;
    tooltip: React.ReactNode | string;
}


interface State {
    hovering: boolean;
    mouseX: number;
    mouseY: number;
}


export class Tooltip extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            hovering: false,
            mouseX: 0,
            mouseY: 0,
        };
    }

    private onMouseEnter = (e: MouseEvent) => {
        this.setState({
            hovering: true,
            mouseX: e.clientX,
            mouseY: e.clientY,
        });
    };

    private onMouseMove = (e: MouseEvent) => {
        this.setState({
            hovering: true,
            mouseX: e.clientX,
            mouseY: e.clientY,
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
                {this.renderTooltipInstance()}
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

    private renderTooltipInstance(): React.ReactNode {
        if (!this.state.hovering) {
            return undefined;
        }
        return (
            <TooltipInstance
                mouseX={this.state.mouseX}
                mouseY={this.state.mouseY}
            >
                {this.props.tooltip}
            </TooltipInstance>
        );
    }

}
