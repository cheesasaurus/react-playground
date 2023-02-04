import { createBlackBoxAsyncThunk } from "../../utils";

export const SimulationThunks = {

    fetchData: createBlackBoxAsyncThunk(
        'simulation/fetchData',
        async (notused, thunkAPI) => {
            try {
                const response = await window.blackBox.api.simulation.getSimulationData();
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
