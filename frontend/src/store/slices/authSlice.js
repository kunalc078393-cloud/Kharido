import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser , registerUser , logoutUser , refreshAccessToken, getUser} from "../../services/authServices";

export const login = createAsyncThunk(
    "auth/login",
    async (userData , {rejectWithValue}) => {
        try {
            const data = await loginUser(userData);
            return data;
            
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "login failed"
                
            );
            
        }

    }
)

export const register = createAsyncThunk(
    "auth/register",
    async(userData , {rejectWithValue}) => {
        try {
            const data = await registerUser(userData);
            return data;
            
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Register Failed"
            );
        }
    }

);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await logoutUser();
            return true;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);

export const refresh = createAsyncThunk(
    "auth/refreshAccessToken",
    async (_, {rejectWithValue}) => {
        try {
            const data = await refreshAccessToken();
            return data.accessToken;
            
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "refresh token failed"
            );
            
        }
    }
);

export const getMe = createAsyncThunk(
    "auth/getMe",
    async (_, {rejectWithValue})=>{
        try {
           const data = getUser();
            return data;
        } catch (error) {
            rejectWithValue(
                error.response?.data.message || "User fetching failed"
            );
            
        }

    }
);




const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    initialized: false,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setInitialized : (state) => {
            state.initialized = true;
        }

    },
    extraReducers : (builder) =>{
        builder
            .addCase(login.pending , (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled , (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
                state.loading = false;
            })
            .addCase(login.rejected , (state, action)=>{
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.accessToken = null;
            })
            .addCase(register.pending , (state) => {
                state.loading = false;
                state.error = null;

            })
            .addCase(register.fulfilled , (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
                state.accessToken = action.payload.accessToken;

            })
            .addCase(register.rejected, (state, action)=> {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.accessToken = null;
                state.error = action.payload
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })

            .addCase(refresh.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(refresh.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })

            .addCase(refresh.rejected, (state, action)=>{
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.accessToken = null;
                state.error = null
            })

            .addCase(getMe.pending , (state) => {
                state.loading = true;
                state.error = false;
            })
            
            .addCase(getMe.fulfilled , (state, action)=>{
                state.user = action.payload.user;
                state.loading = false;
                state.error = null;
                state.isAuthenticated = true;
            })

            .addCase(getMe.rejected , (state, action) =>{
                state.user = null;
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;

            })
    }

})


export const {setInitialized} = authSlice.actions
export default authSlice.reducer;