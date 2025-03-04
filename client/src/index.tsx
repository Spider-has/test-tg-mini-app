import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';

const root = ReactDOM.createRoot(document.querySelector('#application') as HTMLElement);

root.render(<App />);
