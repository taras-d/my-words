import { RequestHelper } from './requestHelper';

const isElectron = () => navigator.userAgent.indexOf('Electron/') > -1;

export {
    isElectron,
    RequestHelper
};