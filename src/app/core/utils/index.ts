import { RequestHelper } from './requestHelper';

const isElectron = () => navigator.userAgent.indexOf('Electron/') > -1;

const openInGoogleTranslate = (value: string) => {
    const url = `https://translate.google.com/#en/auto/${value}`
    if (isElectron()) {
        const { shell } = eval('require("electron")');
        shell.openExternal(url);
    } else {
        window.open(url);
    }
}

export {
    isElectron,
    openInGoogleTranslate,
    RequestHelper
};