import { UUID } from "../../../../black-box/exposed/models";
import { createBlackBoxAsyncThunk } from "../../../utils";


export const DudesThunks = {

    fetchOneById: createBlackBoxAsyncThunk(
        'db/dudes/fetchOneById',
        async (dudeId: UUID, thunkAPI) => {
            try {
                const response = await window.blackBox.api.dudes.getDude(dudeId);
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

    fetchAll: createBlackBoxAsyncThunk(
        'db/dudes/fetchAll',
        async (notused, thunkAPI) => {
            try {
                const response = await window.blackBox.api.dudes.getAllDudes();
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


