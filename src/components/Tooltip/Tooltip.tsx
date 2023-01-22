import styles from './Tooltip.module.css';
import React, { MouseEvent } from "react";


interface Props {
    children: React.ReactElement<any>;
    tooltip: React.ReactNode | string;
}


interface State {
    hovering: boolean;
}


export class Tooltip extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            hovering: false,
            // todo: position tooltip. maybe put it in a portal instead of as a sibling of the tooltip children
        };
    }

    private onMouseEnter = (e: MouseEvent) => {
        this.setState({
            hovering: true,
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
                {this.renderTooltip()}
            </>            
        );
    }

    private renderMonitoredChild(): React.ReactNode {
        const extraProps = {
            onClick: (e: MouseEvent) => console.log(e),
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave,
        };
        const el = React.Children.only(this.props.children);
        return React.cloneElement(el, extraProps);
    }

    private renderTooltip(): React.ReactNode {
        if (!this.state.hovering) {
            return undefined;
        }
        return(
            <div className={styles['tooltip']}>
                {this.props.tooltip}
            </div>
        );
    }
    
}
