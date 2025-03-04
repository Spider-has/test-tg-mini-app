import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RequestsList } from './view/pages/requestsList/RequestsList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<RequestsList></RequestsList>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
