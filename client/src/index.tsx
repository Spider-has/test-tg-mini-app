import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { init } from './init.ts';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

const debug = true;
import { tgInitData } from './telegramMock.ts';

await tgInitData();
const root = ReactDOM.createRoot(document.querySelector('#application') as HTMLElement);
try {
    // Configure all application dependencies.
    await init(retrieveLaunchParams().startParam === 'debug' || debug);

    root.render(<App />);
} catch (e) {
    console.error(e);
    root.render(<h3>Вы находитесь не внутри телеграм app</h3>);
}
