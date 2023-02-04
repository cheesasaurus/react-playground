import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiErrors } from "../black-box/interface";

/**
 * https://redux-toolkit.js.org/usage/usage-with-typescript#defining-a-pre-typed-createasyncthunk
 * 
 * but this doesn't exactly work.
 * 
 * to get the RootState and AppDispatch types (without defining manually) we need to init the store...
 * to init the store we need the reducers for each slice, which are built with createSlice...
 * to build createSlice we need the async thunks...
 * which would be built using this createBlackBoxAsyncThunk function...
 * which needs the RootState and AppDispatch... and so circular dependency :/
 */

/*
export const createBlackBoxAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState,
    dispatch: AppDispatch,
    rejectValue: ServiceErrors,
}>();
*/


/**
 * type of the action payload when rejected
 */
interface RejectValue {
    /**
     * errors received from the black box response
     */
    errors?: ApiErrors;

    /**
     * any error thrown while executing the thunk
     */
    exception?: any;
};


/**
 * https://redux-toolkit.js.org/usage/usage-with-typescript#defining-a-pre-typed-createasyncthunk
 */
export const createBlackBoxAsyncThunk = createAsyncThunk.withTypes<{
    rejectValue: RejectValue,
}>();
