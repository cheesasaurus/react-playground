import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DragPayloadType } from "./dragPayloads";


interface SliceState {
    isDragging: boolean;
    payloadType: DragPayloadType | undefined;
    payload: any;
}

const initialState: SliceState = {
    isDragging: false,
    payloadType: undefined,
    payload: undefined,
};

const dragDropSlice = createSlice({
    name: 'dragDrop',
    initialState,
    reducers: {
        dragStarted(state, action: PayloadAction<{payloadType: DragPayloadType, payload: any}>) {
            state.isDragging = true;
            state.payloadType = action.payload.payloadType;
            state.payload = action.payload.payload;
        },
        dragEnded(state) {
            state.isDragging = false;
            state.payloadType = undefined;
            state.payload = undefined;
        },
    },
});

export const { dragStarted, dragEnded } = dragDropSlice.actions;
export const dragDropReducer = dragDropSlice.reducer;