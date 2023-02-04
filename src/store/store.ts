import { configureStore } from "@reduxjs/toolkit";
import { dbReducer } from "./slices/db/dbSlice";
import { dragDropReducer } from "./slices/dragDrop/dragDropSlice";
import { simulationReducer } from "./slices/simulation/simulationSlice";

export const store = configureStore({
    reducer: {
        db: dbReducer,
        dragDrop: dragDropReducer,
        simulation: simulationReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;