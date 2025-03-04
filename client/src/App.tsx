import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RequestsList } from './view/pages/requestsList/RequestsList';
import { RequestCreation } from './view/pages/requestCreation/RequestCreation';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/start" element={<RequestsList />} />
                <Route path="*" element={<RequestsList />} />
                <Route path="/requestCreation" element={<RequestCreation />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
