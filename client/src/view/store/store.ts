import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderCreationSlice/orderCreation';
import userReducer from './userSlice/user';
import ordersListReducer from './orderListSlice/orderList';
import logger from 'redux-logger';
import feedbackReducer from './feedbackSlice/feedback';
const store = configureStore({
    reducer: {
        order: orderReducer,
        user: userReducer,
        ordersList: ordersListReducer,
        feedback: feedbackReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
