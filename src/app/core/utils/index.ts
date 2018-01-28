import { RequestHelper } from './requestHelper';

const isElectron = () => navigator.userAgent.indexOf('Electron/') > -1;

const openInGoogleTranslate = value => {
    if (isElectron()) {
        const { shell } = eval('require("electron")');
        shell.openExternal(`https://translate.google.com/#en/auto/${value}`);
    }
}

export {
    isElectron,
    openInGoogleTranslate,
    RequestHelper
};