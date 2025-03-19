import {
    backButton,
    viewport,
    themeParams,
    miniApp,
    initData,
    init as initSDK,
    $debug,
} from '@telegram-apps/sdk-react';

// import eruda from 'eruda';

export async function init(debug: boolean) {
    // Set @telegram-apps/sdk-react debug mode.
    $debug.set(debug);

    // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
    // Also, configure the package.
    initSDK();

    // Add Eruda if needed.
    if (debug) {
        // eruda.init();
    }

    // Check if all required components are supported.
    if (!backButton.isSupported() || !miniApp.isSupported()) {
        throw new Error('ERR_NOT_SUPPORTED');
    }

    // Mount all components used in the project.
    backButton.mount();
    miniApp.mount();
    themeParams.mount();
    initData.restore();
    void viewport
        .mount()
        .catch(e => {
            console.error('Something went wrong mounting the viewport', e);
        })
        .then(() => {
            viewport.bindCssVars();
        });

    // Define components-related CSS variables.
    miniApp.bindCssVars();
    themeParams.bindCssVars();
}
