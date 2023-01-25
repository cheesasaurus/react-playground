import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DudeMap, EquipmentMap } from '../../../black-box/exposed/models';
import { DudesThunks } from './thunks/dudes';


interface SliceState {
    counter: number;
    entities: {
        dudes: DudeMap,
        equipment: EquipmentMap,
    }
}

const initialState: SliceState = {
    counter: 0,
    entities: {
        dudes: {},
        equipment: {},
    }
};


function updateDudes(stateDraft: SliceState, fresh: DudeMap) {
    const entityType = 'dudes';
    const cached = stateDraft.entities[entityType];
    stateDraft.entities[entityType] = {...cached, ...fresh};
}

function updateEquipment(stateDraft: SliceState, fresh: EquipmentMap) {
    const entityType = 'equipment';
    const cached = stateDraft.entities[entityType];
    stateDraft.entities[entityType] = {...cached, ...fresh};
}


// Note: The reducers here can safely mutate the `state` passed in.
// (`state` is an immer "draft" object, with no references to anything in the real state)
// 
const dbSlice = createSlice({
    name: 'db',
    initialState,
    reducers: {
        incremented(state) {
            state.counter++;
        },
        amountAdded(state, action: PayloadAction<number>) {
            state.counter += action.payload;
        },
        dudesLoaded(state, action: PayloadAction<{dudes: DudeMap, equipment: EquipmentMap}>) {
            updateDudes(state, action.payload.dudes);
            updateEquipment(state, action.payload.equipment);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(DudesThunks.fetchAll.fulfilled, (state, action) => {
            updateDudes(state, action.payload.dudes);
            updateEquipment(state, action.payload.equipment);
        });
        builder.addCase(DudesThunks.fetchAll.rejected, (state, action) => {
            console.warn(action.payload);
        });
    },

});

export const { incremented, amountAdded, dudesLoaded } = dbSlice.actions;
export const dbReducer = dbSlice.reducer;