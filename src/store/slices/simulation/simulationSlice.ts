import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SimulationData, UnixTimestampMilliseconds } from "../../../black-box/exposed/models";
import { SimulationThunks } from "./SimulationThunks";


export interface SimulationState {
    isPaused: boolean;
    tickOffset: number;
    pauseTimestamp: UnixTimestampMilliseconds,
}

const initialState: SimulationState = {
    isPaused: true,
    tickOffset: 0,
    pauseTimestamp: 0,
};


function updateSimulationData(stateDraft: SimulationState, fresh: SimulationData) {
    stateDraft.isPaused = fresh.isPaused;
    stateDraft.tickOffset = fresh.tickOffset;
    stateDraft.pauseTimestamp = fresh.pauseTimestamp;
}

const simulationSlice = createSlice({
    name: 'simulation',
    initialState,
    reducers: {
        simulationUpdated(state, action: PayloadAction<SimulationData>) {
            updateSimulationData(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(SimulationThunks.fetchData.fulfilled, (state, action) => {
            updateSimulationData(state, action.payload);
        });
        builder.addCase(SimulationThunks.fetchData.rejected, (state, action) => {
            console.warn(action.payload);
        });
    },
});

export const { simulationUpdated } = simulationSlice.actions;
export const simulationReducer = simulationSlice.reducer;