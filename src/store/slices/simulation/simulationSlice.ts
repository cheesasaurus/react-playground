import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SimulationData, UnixTimestampMilliseconds } from "../../../black-box/exposed/models";


interface State {
    isPaused: boolean;
    tickOffset: number;
    pauseTimestamp: UnixTimestampMilliseconds,
}

const initialState: State = {
    isPaused: true,
    tickOffset: 0,
    pauseTimestamp: 0,
};

const simulationSlice = createSlice({
    name: 'simulation',
    initialState,
    reducers: {
        simulationUpdated(state, action: PayloadAction<SimulationData>) {
            const data = action.payload;
            state.isPaused = data.isPaused;
            state.tickOffset = data.tickOffset;
            state.pauseTimestamp = data.pauseTimestamp;
        }
    },
});

export const { simulationUpdated } = simulationSlice.actions;
export const simulationReducer = simulationSlice.reducer;