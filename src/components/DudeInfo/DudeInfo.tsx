import React from "react";
import { Dude } from "../../black-box/exposed/models";


interface Props {
    dudeId: number,
    onNameDetermined?(dudeName: string): void,
}

interface State {
    dude?: Dude,
}


export class DudeInfo extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            dude: undefined,
        };
    }

    public componentDidMount(): void {
        window.blackBox.api.dudes.getDude(this.props.dudeId).then(response => {
            if (response.errors) {
                console.error(response.errors);
                return;
            }
            const dude = response.data!;
            this.setState({
                dude: dude,
            });

            if (this.props.onNameDetermined) {
                this.props.onNameDetermined(dude.name);
            }
        });
    }


    public render(): React.ReactNode {
        return (
            <div>
                hello
            </div>
        );
    }
}
