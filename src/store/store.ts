import { configureStore } from "@reduxjs/toolkit";
import { dbReducer } from "./slices/db/dbSlice";
import { dragDropReducer } from "./slices/dragDrop/dragDropSlice";

export const store = configureStore({
    reducer: {
        db: dbReducer,
        dragDrop: dragDropReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;