import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StartUserPage } from './view/pages/startUserPage/StartUserPage';
import { RequestCreation } from './view/pages/orderCreation/OrderCreation';
import { UserOrders } from './view/pages/userOrders/UserOrders';
import { Provider } from 'react-redux';
import store from './view/store/store';
import { initData, User, useSignal } from '@telegram-apps/sdk-react';
import { useEffect, useMemo } from 'react';
import { setUserData, TgUserData } from './view/store/userSlice/user';
import { useAppDispatch } from './view/hooks/hooks';

const tgUserStateToUserSlice = (tgState: User): TgUserData => {
    const fullName = tgState.firstName + tgState.lastName;
    const userName = tgState.username ? tgState.username : '';
    const avatarUrl = tgState.photoUrl ? tgState.photoUrl : '';
    console.log(fullName, userName, avatarUrl);
    return {
        chatId: tgState.id,
        fullName: fullName,
        userName: userName,
        avatarUrl: avatarUrl,
    };
};

function App() {
    return (
        <Provider store={store}>
            <Navigation />
        </Provider>
    );
}

const Navigation = () => {
    const initDataState = useSignal(initData.state);
    const dispatch = useAppDispatch();
    const userRows = useMemo(() => {
        return initDataState?.user;
    }, [initDataState]);
    useEffect(() => {
        if (userRows) {
            const userData = tgUserStateToUserSlice(userRows);
            dispatch(setUserData(userData));
        }
    }, [userRows]);
    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Routes>
                <Route path="/start" element={<StartUserPage />} />
                <Route path="*" element={<StartUserPage />} />
                <Route path="/orderCreation" element={<RequestCreation />} />
                <Route path="/ordersList" element={<UserOrders />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
