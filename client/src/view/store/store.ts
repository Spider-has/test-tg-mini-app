import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderCreationSlice/orderCreation';
import userReducer from './userSlice/user';
import ordersListReducer from './orderListSlice/orderList';

const store = configureStore({
    reducer: {
        order: orderReducer,
        user: userReducer,
        ordersList: ordersListReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
