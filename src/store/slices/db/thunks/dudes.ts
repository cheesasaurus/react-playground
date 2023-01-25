import { createAsyncThunk } from "@reduxjs/toolkit";
import { createBlackBoxAsyncThunk } from "../../../utils";


export const DudesThunks = {

    fetchOneById: createAsyncThunk(
        'db/dudes/fetchOneById',
        async (dudeId: string, thunkAPI) => {
            // todo
        }
    ),

    fetchAll: createBlackBoxAsyncThunk(
        'db/dudes/fetchAll',
        async (notused, thunkAPI) => {
            try {
                const response = await window.blackBox.api.dudes.getDudes();
                if (response.errors) {
                    return thunkAPI.rejectWithValue({errors: response.errors});
                }
                return response.data!;
            }
            catch (exception) {
                return thunkAPI.rejectWithValue({exception});
            }            
        }
    ),

};


