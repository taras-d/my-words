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

const ellipsis = (value: string, max: number = 50): string => {
    return (value && value.length > max) ?
        value.slice(0, max - 3) + '...': value;
};

export {
    isElectron,
    requireNM,
    openInGoogleTranslate,
    ellipsis,
    RequestHelper
};
