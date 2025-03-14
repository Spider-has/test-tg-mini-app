import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StartUserPage } from './view/pages/startUserPage/StartUserPage';
import { RequestCreation } from './view/pages/orderCreation/OrderCreation';
import { UserOrders } from './view/pages/userOrders/UserOrders';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/start" element={<StartUserPage />} />
                <Route path="*" element={<StartUserPage />} />
                <Route path="/orderCreation" element={<RequestCreation />} />
                <Route path="/ordersList" element={<UserOrders />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
