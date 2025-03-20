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

const GET_ORDERS_URL = 'http://217.114.14.144:80/api/v1/task/all/{tg_chat_id}?page=1&limit=10';

type FetchData = {
    orders: Order[];
};

export const fetchOrders = createAsyncThunk('orderList/fetchOrders', async (chatId: number) => {
    try {
        const response = await fetch(GET_ORDERS_URL.replace('{tg_chat_id}', chatId.toString()), {
            method: 'GET',
        });
        console.log(response);
        if (!response.ok) throw new Error(`request get error ${response.status}`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
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
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<FetchData>) => {
                state.status = 'succeeded';
                state.orders = action.payload.orders;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addNewOrder } = ordersListSlice.actions;

export default ordersListSlice.reducer;
