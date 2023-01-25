import { createAsyncThunk } from "@reduxjs/toolkit";


export const DudesThunks = {

    fetchOneById: createAsyncThunk(
        'db/dudes/fetchOneById',
        async (dudeId: string, thunkAPI) => {
            // todo
        }
    ),

    fetchAll: createAsyncThunk(
        'db/dudes/fetchAll',
        async (thunkAPI) => {
            const response = await window.blackBox.api.dudes.getDudes();
            if (response.errors) {
                response.errors.forEach(console.error)
                throw Error('response had errors');
                // todo: reject instead of throwing exception
                // return thunkAPI.rejectWithValue(response.errors);
                // 
                // https://redux-toolkit.js.org/usage/usage-with-typescript#defining-a-pre-typed-createasyncthunk
            }
            return response.data!;
        }
    ),
};
