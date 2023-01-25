import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { amountAdded, incremented } from './slices/db/dbSlice';
import { DudesThunks } from './slices/db/thunks/dudes';

// example of a function component that uses the store

interface ExampleFunctionComponentProps {
    
}

export function ExampleFunctionComponent(props: ExampleFunctionComponentProps) {
    const count = useAppSelector((storeState) => storeState.db.counter);
    const dispatch = useAppDispatch();
    
    const increment = useCallback(
        () => dispatch(incremented()),
        [dispatch]
    );

    const add5 = useCallback(
        () => dispatch(amountAdded(5)),
        [dispatch]
    );
    
    const fetchDudes = useCallback(
        () => dispatch(DudesThunks.fetchAll()),
        [dispatch]
    );
    
    return (
        <div>
            <button onClick={increment}>count is: {count}</button>
            <button onClick={add5}>add 5</button>
            <button onClick={fetchDudes}>fetch dudes</button>
        </div>
    );
}
