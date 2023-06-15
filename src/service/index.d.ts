declare module "@mrroin/mrroin-web-sdkcrypto" {
  export const keyPairCSR: any;
  export const getHash: any;
  export const query: any;
  export const hashWallet: any;
}
declare module "@mrroin/mrroin-web-bus" {
  export const getInstance: any;
}
declare module "@mrroin/mrroinsdknative" {
  export const getMobileBridgeInstance: any;
}
declare module "@mrroin/mrroin-web-bus" {
  export const getInstance: any;
}
declare module "rxmq" {
  export const channel: any;
}
declare module "upscaler" {
  export = Upscaler;
}
declare module "unzip-js" {
  export const unzip: any;
}
declare let geoip2: any;
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};
