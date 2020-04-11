
declare module '*.json' {
  const data: Record<string, any>;
  export default data;
}

declare module 'pako/lib/deflate' {
  export {
    deflate, Deflate, deflateRaw, gzip,
  } from 'pako';
}
declare module 'pako/lib/inflate' {
  export {
    inflate, Inflate, inflateRaw, ungzip,
  } from 'pako';
}

declare module 'aes-js'
