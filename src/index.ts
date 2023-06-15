/* eslint-disable @typescript-eslint/no-var-requires */
import MrroinSDKApi from "./MrroinSDKApi";

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
      env: { DEBUG: undefined };
    };
  }
}

const pjson = require("../package.json");

const initialize = function (
  organizationID: string,
  apikey: string,
  userClient: string,
  passwordClient: string,
  onEvent: any,
): any {
  if (!onEvent || typeof onEvent !== "function") {
    throw "invalid parameters by initialized mrroin SDK!";
  }
  // const tag: any = document.getElementById("mrroin");
  // if (!tag) {
  //   throw "div mrroin not found";
  // }
  if (!window.instanceSDKMrroin) {
    window.mrroinGlobalState = {
      organizationID: organizationID,
      apiKey: apikey,
      userClient: userClient,
      passwordClient: passwordClient,
      withGeolocalization: true,
      mode: "prod",
    };
    window.instanceSDKMrroin = new MrroinSDKApi(apikey, onEvent, "prod");
    window.instanceSDKMrroin.setInscance(apikey, onEvent);
  } else {
    console.debug("SDK mrroin already initialized!");
    window.instanceSDKMrroin.setInscance(apikey, onEvent);
  }
  return window.instanceSDKMrroin;
};

const getInstance = function (identifier: string): any {
  if (!window.instanceSDKMrroin) {
    throw "SDK mrroin not initialized!";
  } else {
    // console.debug("antes de hacer el clone");
    // console.log(window.instanceSDKMrroin);
    // console.log(window.instanceSDKMrroin.clone);
    return window.instanceSDKMrroin.clone(identifier);
  }
};

const getVersion = function (): string {
  console.debug(pjson.version);
  return pjson.version;
};

export { initialize, getInstance, getVersion };
