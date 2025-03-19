import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Order = {
    id: number;
    tg_chat_id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
    adress: string;
    execution_date: string;
    images: string[];
    executionTimes: TimeDurations[];
    client_userName: '';
};

type TimeDurations = {
    start: string;
    end: string;
};

type ordersListState = {
    orders: Order[];
    status: 'loading' | 'succeeded' | 'failed' | 'idle';
    error: string | undefined;
};

const initialState: ordersListState = {
    orders: [],
    status: 'idle',
    error: undefined,
};

const GET_ORDERS_URL = '/api/v1/task/{tg_chat_id}?page=1&limit=10';

export const fetchOrders = createAsyncThunk('orderList/fetchOrders', async (chatId: number) => {
    const response = await fetch(GET_ORDERS_URL.replace('{tg_chat_id}', chatId.toString()), {
        method: 'GET',
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    return data;
});

const ordersListSlice = createSlice({
    name: 'orderList',
    initialState,
    reducers: {
        addNewOrder: (state, action: PayloadAction<Order>) => {
            state.orders.push(action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchOrders.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addNewOrder } = ordersListSlice.actions;

export default ordersListSlice.reducer;
