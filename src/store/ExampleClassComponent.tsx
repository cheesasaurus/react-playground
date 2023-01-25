import React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { amountAdded, incremented } from './slices/db/dbSlice';
import { DudesThunks } from './slices/db/thunks/dudes';

// example of using a class component connected to the store


interface Props {
    count?: number;
    dispatch?: AppDispatch;
    add5?: () => void;
}

/**
 * `connect` uses mapStateToProps to add props derived from the store's state (it's basically a selector)
 */
const mapStateToProps = (state: RootState, ownProps: Props) => {
    return {
        count: state.db.counter,
    };
};

/**
 * `connect` uses mapDispatchToProps to add some predefined dispatches to the props
 */
const mapDispatchToProps = (dispatch: AppDispatch) => ({
    add5: () => dispatch(amountAdded(5)),
    dispatch: dispatch, // we can also provide the raw dispatch function
});

export const ExampleClassComponent = connect(mapStateToProps, mapDispatchToProps)(
    // This is an anonymous class being passed to `connect`,
    // which in turn creates the actual class that will be used in the app.
    // But maybe it's better to expose this internal class for testing purposes.
    class extends React.Component<Props> {
        constructor(props: Props) {
            super(props);
        }
        
        private increment = () => {
            this.props.dispatch!(incremented());
        };
        
        private add5 = () => {
            this.props.add5!();
        };
        
        private fetchDudes = () => {
            this.props.dispatch!(DudesThunks.fetchAll());
        };
        
        public render(): React.ReactNode {
            return (
                <div>
                    <button onClick={this.increment}>count is: {this.props.count}</button>
                    <button onClick={this.add5}>add 5</button>
                    <button onClick={this.fetchDudes}>fetch dudes</button>
                </div>
            );
        }
        
    }    
);
        