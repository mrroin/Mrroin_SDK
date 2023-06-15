declare global {
  interface Window {
    _kBridge_: any;
    instanceSDKMrroin: any;
    webkit: any;
    mrroinGlobalState: any;
    busChannel: any;
    dbMrroin: any;
    mrroinCollection: any;
    SystemJS: any;
    System: any;
    popStateListener: any;
    identifier: any;
    onpopstatePrevious: any;
    process: {
      env: {
        DEBUG: undefined;
      };
    };
    JSDEDGECERTUTIL: any;
    verificaParidad: any;
    generaSello: any;
  }
}
declare const initializeInSandBoxMode: (
  organizationID: string,
  apikey: string,
  userClient: string,
  passwordClient: string,
  onEvent: any,
) => any;
declare const initializeInDevelopmentMode: (
  organizationID: string,
  apikey: string,
  userClient: string,
  passwordClient: string,
  onEvent: any,
) => any;
declare const initializeInQualityAssuranceMode: (
  organizationID: string,
  apikey: string,
  userClient: string,
  passwordClient: string,
  onEvent: any,
) => any;
declare const initialize: (
  organizationID: string,
  apikey: string,
  userClient: string,
  passwordClient: string,
  onEvent: any,
) => any;
declare const getInstance: (identifier: string) => any;
declare const getVersion: () => string;
export {
  initialize,
  initializeInDevelopmentMode,
  getInstance,
  getVersion,
  initializeInSandBoxMode,
  initializeInQualityAssuranceMode,
};
