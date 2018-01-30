import { RequestHelper } from './requestHelper';

const isElectron = () => navigator.userAgent.indexOf('Electron/') > -1;

const requireNM = (path: string) => {
    return window['require'](path);
};

const openInGoogleTranslate = (value: string) => {
    const url = `https://translate.google.com/#en/auto/${value}`;
    if (isElectron()) {
        const { shell } = requireNM('electron');
        shell.openExternal(url);
    } else {
        window.open(url);
    }
};

export {
    isElectron,
    requireNM,
    openInGoogleTranslate,
    RequestHelper
};
