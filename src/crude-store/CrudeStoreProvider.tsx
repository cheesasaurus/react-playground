import React from "react";
import { CrudeStore } from "./CrudeStore";


export const CrudeStoreContext = React.createContext<CrudeStore|undefined>(undefined);


interface Props {
    children: React.ReactNode;
}


export class CrudeStoreProvider extends React.Component<Props> {
    store = new CrudeStore();

    public render(): React.ReactNode {
        return (
            <CrudeStoreContext.Provider value={this.store}>
                {this.props.children}
            </CrudeStoreContext.Provider>
        );
    }
}
