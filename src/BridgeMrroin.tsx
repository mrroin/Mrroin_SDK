/* eslint-disable @typescript-eslint/no-this-alias */
import MrroinWeb from "./MrroinWeb";
import { v4 as uuidv4 } from "uuid";
import * as URI from "./service/Uri";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pjson = require("../package.json");

export default class BridgeMrroin {
  sdk: any;
  mobileBridge: any;
  OS: string;
  sdkWeb!: MrroinWeb;
  functionWebResponse: any;
  mrroinId: string;
  transactionId: string;
  identifierProcessContainer: string;
  identifierProfileContainer: string;
  identifierTodoContainer: any;
  identifierWalletContainer: any;
  identifierNotificationsContainer: string;
  identifierLoginContainer: string;
  mode: string;
  responseProcess: any;
  apikey: string;
  constructor(sdkmrroin: any, apikey: string, mode: string) {
    console.log("sdk web");
    console.log("version:: ", pjson.version);
    this.functionWebResponse = [];
    this.sdk = sdkmrroin;
    this.mrroinId = "";
    this.transactionId = "";
    this.identifierProcessContainer = "";
    this.identifierProfileContainer = "";
    this.identifierLoginContainer = "";
    this.identifierTodoContainer = {};
    this.identifierWalletContainer = {};
    this.identifierNotificationsContainer = "";
    this.responseProcess = {};
    this.mode = mode;
    this.apikey = apikey;
    /*
    //Inicializacion de mrroinsdknative
    this.mobileBridge = mrroinsdknative.getMobileBridgeInstance(
      apikey,
      this.functionWebResponse,
      this.sdk,
    );
    try {
      this.mobileBridge.appLoadFinish();
    } catch (e) {
      console.debug("Error this.mobileBridge.appLoadFinish");
    }

    if (window._kBridge_ !== undefined) {
      // console.debug("is Android");
      this.OS = "ANDROID";
    } else if (
      window.webkit !== undefined &&
      window.webkit.messageHandlers !== undefined &&
      window.webkit.messageHandlers._kBridge_ !== undefined
    ) {
      this.OS = "IOS";
    } else {
      this.OS = "BROWSER";
    }*/
    this.OS = "BROWSER";
    if (this.OS === "BROWSER") {
      this.sdkWeb = new MrroinWeb(sdkmrroin, this, true);
    } else {
      this.sdkWeb = new MrroinWeb(sdkmrroin, this, false);
    }
  }

  appLoadFinish(apikey: string) {
    console.debug("*****---antes appLoadFinish---Bridgemrroin", apikey);
    try {
      if (this.OS === "BROWSER") {
        // console.debug("load mrroin browser");
        // this.handleloadingmrroin(true);
        this.sdkWeb.appLoadFinish(apikey);
      } else {
        //this.sdk.onStart(apikey, "onLaunch", null);
      }
    } catch (error) {
      console.error(error);
      // alert(error)
    }
  }

  executeReturnOperationSuccess(operationId: string, result: any) {
    this.functionWebResponse[operationId + "_Success"](JSON.stringify(result));
    this.deleteFunctionWebResponse(operationId);
  }

  executeReturnOperationFailed(operationId: string, error: any) {
    this.functionWebResponse[operationId + "_Error"](error);
    this.deleteFunctionWebResponse(operationId);
  }

  deleteFunctionWebResponse(identifierWebFunction: string) {
    delete this.functionWebResponse[identifierWebFunction + "_Success"];
    delete this.functionWebResponse[identifierWebFunction + "_Error"];
  }

  getResponseError(e: any) {
    const errorResponse = {
      success: false,
      data: {
        error: e.toString(),
      },
    };
    return errorResponse;
  }

  isLoadSdk(identifierWebFunction: string) {
    if (!this.sdkWeb.loadSdk) {
      // this.executeReturnOperationSuccess(identifierWebFunction, {
      //   success: false,
      //   data: {
      //     error: "SDK mrroin not initialized!",
      //   },
      // });
      throw "SDK mrroin not initialized!";
    }
  }

  serviceExample(userName: string) {
    console.debug("login");
    console.debug(JSON.stringify(userName));
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb.serviceExample(userName).subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          // console.debug("#### mobile login")
          /*this.mobileBridge.login(identifierWebFunction, userName);*/
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  setState(id: string, state: any) {
    console.debug("setState");
    console.debug(JSON.stringify(id));
    console.debug(JSON.stringify(state));
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb.setState(id, state).subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          //this.mobileBridge.setState(identifierWebFunction, id, state);
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  getState(id: string) {
    console.debug("getState");
    console.debug(JSON.stringify(id));
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb.getState(id).subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          //this.mobileBridge.getState(identifierWebFunction, id);
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  loadQR() {
    console.debug("loadQR");
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb.loadQrScanner().subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          /*this.mobileBridge.sendGenericMsg(
            identifierWebFunction,
            "READ_QR",
            {},
          );*/
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  getGeolocalization() {
    console.debug("getGeolocalization");
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb.getGeolocalization().subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          /*this.mobileBridge.sendGenericMsg(
            identifierWebFunction,
            "GET_DEVICE_INFO",
            {},
          );*/
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  getLanguage() {
    console.debug("getLanguage");
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb.getLanguage().subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          /*this.mobileBridge.sendGenericMsg(
            identifierWebFunction,
            "GET_DEVICE_LANGUAGE",
            {},
          );*/
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  downloadFileAsB64(name: string, content: string, mimeType: string) {
    console.debug("downloadFileAsB64");
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.sdkWeb.downloadFileAsB64(name, content, mimeType).subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          throw "No implemented in mobile";
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  downloadFileAsBinary(name: string, content: string, mimeType: string) {
    console.debug("downloadFileAsBinary");
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.sdkWeb.downloadFileAsBinary(name, content, mimeType).subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          throw "No implemented in mobile";
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  uploadFile(mimeTypesSupport: any) {
    console.debug("uploadFile");
    console.debug(JSON.stringify(mimeTypesSupport));
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.sdkWeb.uploadFile(mimeTypesSupport).subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          /*this.mobileBridge.sendGenericMsg(
            identifierWebFunction,
            "SELECT_FILE",
            {
              mimeTypes: mimeTypesSupport,
            },
          );*/
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  takePhotoCamera(
    title: string,
    subtitle: string,
    documentType: string,
    side: string,
    country: string,
    pluginId: string,
    description: string,
  ) {
    console.debug("takePhotoCamera");
    console.debug(JSON.stringify(title));
    console.debug(JSON.stringify(subtitle));
    console.debug(JSON.stringify(documentType));
    console.debug(JSON.stringify(side));
    console.debug(JSON.stringify(country));
    console.debug(JSON.stringify(pluginId));
    console.debug(JSON.stringify(description));

    // console.debug("scannerDocument********");
    // console.debug(title, subtitle, documentType, side);
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb
            .takePhotoCamera(
              title,
              subtitle,
              documentType,
              side,
              country,
              pluginId,
              description,
            )
            .subscribe(
              (x: any) => {
                self.executeReturnOperationSuccess(identifierWebFunction, x);
              },
              (e: any) => {
                self.executeReturnOperationSuccess(
                  identifierWebFunction,
                  self.getResponseError(e),
                );
              },
            );
        } else {
          /*this.mobileBridge.sendGenericMsg(
            identifierWebFunction,
            "SCAN_DOCUMENT",
            {
              title: title,
              subtitle: subtitle,
              pluginId: pluginId,
              documentType: documentType,
              side: side,
              country: country,
            },
          );*/
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  downscalerImage(value: any, width: any, height: any) {
    console.debug("downscalerImage");
    console.debug(value, width, height);
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        // self.isLoadSdk(identifierWebFunction);
        self.sdkWeb.downscalerImage(value, width, height).subscribe(
          (x: any) => {
            // self.sincronizedWallet();
            self.executeReturnOperationSuccess(identifierWebFunction, x);
          },
          (e: any) => {
            self.executeReturnOperationSuccess(
              identifierWebFunction,
              self.getResponseError(e),
            );
          },
        );
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  setValueDocument(id: any, value: any) {
    console.debug("setValueDocument");
    console.debug(JSON.stringify(id));
    console.debug(JSON.stringify(value));
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb.setValueDocument(id, value).subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          //this.mobileBridge.setState(identifierWebFunction, id, value);
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  getValueDocument(id: any) {
    console.debug("getValueDocument");
    console.debug(JSON.stringify(id));
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb.getValueDocument(id).subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          //this.mobileBridge.getState(identifierWebFunction, id);
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }

  getOS() {
    return this.OS;
  }

  getToken() {
    console.debug("getToken");
    const identifierWebFunction = uuidv4();
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        self.functionWebResponse[identifierWebFunction + "_Success"] = resolve;
        self.functionWebResponse[identifierWebFunction + "_Error"] = reject;
        if (this.OS === "BROWSER") {
          self.isLoadSdk(identifierWebFunction);
          self.sdkWeb.getToken().subscribe(
            (x: any) => {
              self.executeReturnOperationSuccess(identifierWebFunction, x);
            },
            (e: any) => {
              self.executeReturnOperationSuccess(
                identifierWebFunction,
                self.getResponseError(e),
              );
            },
          );
        } else {
          /*this.mobileBridge.sendGenericMsg(
            identifierWebFunction,
            "GET_TOKEN",
            {},
          );*/
        }
      } catch (error) {
        self.executeReturnOperationSuccess(
          identifierWebFunction,
          self.getResponseError(error),
        );
        self.deleteFunctionWebResponse(identifierWebFunction);
      }
    });
  }
}
