import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StartUserPage } from './view/pages/startUserPage/StartUserPage';
import { RequestCreation } from './view/pages/orderCreation/OrderCreation';
import { UserOrders } from './view/pages/userOrders/UserOrders';
import { Provider } from 'react-redux';
import store from './view/store/store';
import { initData, User, useSignal } from '@telegram-apps/sdk-react';
import { useEffect, useMemo } from 'react';
import { setUserData, TgUserData } from './view/store/userSlice/user';
import { useAppDispatch, useAppSelector } from './view/hooks/hooks';
import { FeedBackForm } from './view/pages/feedbackForm/FeedBackForm';
import { fetchOrders } from './view/store/orderListSlice/orderList';

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
    const userId = useAppSelector(state => state.user.chatId);
    const userRows = useMemo(() => {
        return initDataState?.user;
    }, [initDataState]);
    useEffect(() => {
        if (userRows) {
            const userData = tgUserStateToUserSlice(userRows);
            dispatch(setUserData(userData));
        }
    }, [userRows]);
    useEffect(() => {
        if (userId > 0) dispatch(fetchOrders(userId));
    }, [userId]);
    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <RoutesList routes={RoutesListData} />
        </BrowserRouter>
    );
};

export const WELCOME_PAGE_URL = '/start';
export const ORDER_CREATION_URL = '/orderCreation';
export const ORDER_LIST_URL = '/ordersList';
export const FEEDBACK_URL = '/feedback';

const RoutesListData: RouteProps[] = [
    {
        path: WELCOME_PAGE_URL,
        element: <StartUserPage />,
    },
    {
        path: '*',
        element: <StartUserPage />,
    },
    {
        path: ORDER_CREATION_URL,
        element: <RequestCreation />,
    },
    {
        path: ORDER_LIST_URL,
        element: <UserOrders />,
    },
    {
        path: FEEDBACK_URL,
        element: <FeedBackForm />,
    },
];

type RouteProps = {
    path: string;
    element: JSX.Element;
};

type RoutesListProps = {
    routes: RouteProps[];
};

const RoutesList = (props: RoutesListProps) => {
    const routesList = props.routes.map((el, i) => <Route key={i} path={el.path} element={el.element} />);
    return <Routes>{routesList}</Routes>;
};
export default App;
