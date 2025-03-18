import {
    isTMA,
    LaunchParams,
    mockTelegramEnv,
    parseInitData,
    retrieveLaunchParams,
} from '@telegram-apps/sdk-react';
import osidronAvatar from './view/static/images/osidron_avatar.jpg';
const metaData = true;

export const tgInitData = async () => {
    if (metaData) {
        await (async () => {
            if (await isTMA()) {
                return;
            }

            const initDataRaw = new URLSearchParams([
                [
                    'user',
                    JSON.stringify({
                        id: 99281932,
                        first_name: 'Denis',
                        last_name: 'Kistanov',
                        username: 'Osidron',
                        language_code: 'ru',
                        is_premium: false,
                        allows_write_to_pm: true,
                        photo_url: osidronAvatar,
                    }),
                ],
                ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
                ['auth_date', '1716922846'],
                ['start_param', 'debug'],
                ['chat_type', 'sender'],
                ['chat_instance', '8428209589180549439'],
                ['signature', '6fbdaab833d39f54518bd5c3eb3f511d035e68cb'],
            ]).toString();
            let lp: LaunchParams | undefined;
            try {
                lp = retrieveLaunchParams();
            } catch (e) {
                lp = {
                    themeParams: {
                        accentTextColor: '#6ab2f2',
                        bgColor: '#17212b',
                        buttonColor: '#5288c1',
                        buttonTextColor: '#ffffff',
                        destructiveTextColor: '#ec3942',
                        headerBgColor: '#17212b',
                        hintColor: '#708499',
                        linkColor: '#6ab3f3',
                        secondaryBgColor: '#232e3c',
                        sectionBgColor: '#17212b',
                        sectionHeaderTextColor: '#6ab3f3',
                        subtitleTextColor: '#708499',
                        textColor: '#f5f5f5',
                    },
                    initData: parseInitData(initDataRaw),
                    initDataRaw,
                    version: '8',
                    platform: 'tdesktop',
                };
            }
            lp.initData = parseInitData(initDataRaw);
            mockTelegramEnv(lp);

            console.warn(
                '⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.',
            );
        })();
    }
};
