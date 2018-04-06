import { RequestHelper } from './requestHelper';
import * as validators from './validators';

const nodeRequire = (path: string) => {
  return window['require'](path);
};

const ellipsis = (value: string, max: number = 50): string => {
  return (value && value.length > max) ?
    value.slice(0, max - 3) + '...' : value;
};

const trimValues = (
  obj: { [key: string]: any },
  ...keys: string[]
): { [key: string]: any } => {
  obj = Object.assign({}, obj);

  keys.forEach(key => {
    const val = obj[key];
    if (typeof val === 'string') {
      obj[key] = val.trim();
    }
  });

  return obj;
};

const getGoogleTranslateLink = (value: string): string => {
  return `https://translate.google.com/#en/auto/${value}`;
};

const getGoogleImagesLink = (value: string): string => {
  return `https://google.com/search?tbm=isch&q=${value}`;
};

export {
  nodeRequire,
  ellipsis,
  trimValues,
  getGoogleTranslateLink,
  getGoogleImagesLink,
  RequestHelper,
  validators
};
