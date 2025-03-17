import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StartUserPage } from './view/pages/startUserPage/StartUserPage';
import { RequestCreation } from './view/pages/orderCreation/OrderCreation';
import { UserOrders } from './view/pages/userOrders/UserOrders';
import { Provider } from 'react-redux';
import store from './view/store/store';

function App() {
    return (
        <Provider store={store}>
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
        </Provider>
    );
}

export default App;
