import { useAppDispatch, useAppSelector } from './hooks';
import { amountAdded, incremented } from './slices/db/dbSlice';
import { DudesThunks } from './slices/db/thunks/dudes';

// example of a function component that uses the store

interface DebugProps {
    
}

export interface DebugState {
    
}

export function ExampleFunctionComponent(props: DebugProps) {
    // todo: memoize so we're not making new instances of the functions every render
    const count = useAppSelector((storeState) => storeState.db.counter);
    const dispatch = useAppDispatch();
    
    const increment = () => {
        dispatch(incremented());
    };
    
    const fetchDudes = () => {
        dispatch(DudesThunks.fetchAll());
    };
    
    const add5 = () => dispatch(amountAdded(5));
    
    return (
        <div>
            <button onClick={increment}>count is: {count}</button>
            <button onClick={add5}>add 5</button>
            <button onClick={fetchDudes}>fetch dudes</button>
        </div>
    );
}
    