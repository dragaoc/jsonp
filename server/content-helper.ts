'use strict';

import JSON3 from 'json3';
import { filterHeaders, SimpleHeaders } from './cloudflare';
import omit from 'lodash.omit';

export const isValidJson = (str: string) => {
  try {
    JSON3.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const passBackHeaders = (incomingHeaders: SimpleHeaders) => {
  // remove those that node should generate
  const resultHeaders = omit(
    incomingHeaders,
    'connection',
    'content-encoding',
    'content-length',
    'server',
    'x-frame-options'
  );

  return filterHeaders(resultHeaders);
};
