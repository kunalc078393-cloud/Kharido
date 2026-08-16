import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import { cart , add, clear } from "../../services/cartServices";


export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_,{rejectWithValue}) => {
        try {
            const data = cart();
            return data;
            
        } catch (error) {
            rejectWithValue(
                error.response?.data?.message || "Fetching Cart failed"
            );
            
        }
        
    }
)


export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({productId, quantity=1},{dispatch, rejectWithValue})=> {
        try {
            const data = await add({productId , quantity});
            await dispatch(getCart()).unwrap();
            return data;
            
        } catch (error) {
            rejectWithValue(
                error.response?.data?.message || "Adding to cart failed"
            )            
        }
    }
)

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, {rejectWithValue}) => {
        try {
            const data = await clear();
            return data;
        } catch (error) {
            rejectWithValue(
                error.response?.data?.message || "Clear cart failed"
            )
            
        }

    }
)

const initialState = {
    cart : null,
    cartTotal : 0,
    loading : false,
    operatingCart : false,
    error : null
}


const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers : {

    },
    extraReducers : (builder)=> {
        builder
            .addCase(getCart.pending ,(state)=> {
                state.loading = true;
                state.null = null
            })
            .addCase(getCart.fulfilled, (state, action)=> {
                state.cart = action.payload.cart;
                state.cartTotal = action.payload.cartTotal;
                state.loading = false;
                state.error = null
            })
            .addCase(getCart.rejected, (state, action)=> {
                state.loading = false;
                state.error = action.payload
            })

            .addCase(addToCart.pending , (state)=> {
                state.operatingCart = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state)=>{
                state.operatingCart = false;
                state.error = null;
                
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(clearCart.pending , (state)=>{
                state.operatingCart = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled , (state, action)=>{
                state.operatingCart = false;
                state.cartTotal = 0;
                state.error = null;
                state.cart.items = [];
            })
            .addCase(clearCart.rejected , (state, action)=>{
                state.operatingCart = false;
                state.error = action.payload;
            })

    }

})

export default cartSlice.reducer ;