import { RequestHelper } from './requestHelper';

const nodeRequire = (path: string) => {
    return window['require'](path);
};

const openInGoogleTranslate = (value: string) => {
    const { shell } = nodeRequire('electron');
    shell.openExternal(`https://translate.google.com/#en/auto/${value}`);
};

const ellipsis = (value: string, max: number = 50): string => {
    return (value && value.length > max) ?
        value.slice(0, max - 3) + '...' : value;
};

const trimValues = (
    obj: {[key: string]: any},
    ...keys: string[]
): {[key: string]: any} => {
    obj = Object.assign({}, obj);

    keys.forEach(key => {
        const val = obj[key];
        if (typeof val === 'string') {
            obj[key] = val.trim();
        }
    });

    return obj;
};

export {
    nodeRequire,
    openInGoogleTranslate,
    ellipsis,
    trimValues,
    RequestHelper
};
