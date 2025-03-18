import { configureStore, Tuple } from '@reduxjs/toolkit';
import orderReducer from './orderSlice/order';
import logger from 'redux-logger';
import userReducer from './userSlice/user';

const store = configureStore({
    reducer: {
        order: orderReducer,
        user: userReducer,
    },
    middleware: () => new Tuple(logger),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
