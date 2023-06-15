import BridgeMrroin from "./BridgeMrroin";
import { from } from "rxjs";

export default class mrroinSDKApi {
  bridge: BridgeMrroin;
  private _apiKey: string[];
  busTopics: any[];
  private _onEvent: any;
  currentMapp: string;
  constructor(apikey: string, onEvent: any, mode: string) {
    this._apiKey = [];
    this.busTopics = [];
    this._onEvent = {};
    this._onEvent[apikey] = onEvent;
    this._apiKey.push(apikey);
    this.bridge = new BridgeMrroin(this, apikey, mode);
    this.currentMapp = "";
  }

  setInscance(apikey: string, onEvent: any) {
    console.debug("setInscance:::");
    console.debug(apikey);
    this._onEvent[apikey] = onEvent;
    this._apiKey.push(apikey);
    this.bridge.appLoadFinish(apikey);
  }

  onStart(apiKey: any, type: string, data: any, error: string) {
    console.debug("--------------------onStart---------------");
    return this._onEvent[apiKey]({ type: type, data: data }, error);
  }

  onEvent(apiKey: any, type: string, payload: any) {
    console.debug("--------------------onStart---------------");
    if ("onBusEvent" === type) {
      console.debug("onBusEvent");
    } else {
      this._onEvent[apiKey](payload);
    }
  }

  clone(apikey: any) {
    const instance = Object.assign(
      Object.create(Object.getPrototypeOf(window.instanceSDKMrroin)),
    );
    instance.currentMapp = apikey;
    instance.onStart = window.instanceSDKMrroin.onStart;
    instance.setInscance = window.instanceSDKMrroin.setInscance;
    instance.clone = window.instanceSDKMrroin.clone;
    instance.topicsPortals = window.instanceSDKMrroin.topicsPortals;
    instance.onEvent = window.instanceSDKMrroin.onEvent;
    instance.processResult = window.instanceSDKMrroin.processResult;
    instance._apiKey = window.instanceSDKMrroin._apiKey;
    instance._onEvent = window.instanceSDKMrroin._onEvent;
    instance.bridge = window.instanceSDKMrroin.bridge;
    instance.bridge.apikey = apikey;
    // console.debug(window.instanceSDKMrroin.busTopics);
    instance.busTopics = window.instanceSDKMrroin.busTopics;
    instance.bridge.sdk = instance;
    return instance;
  }

  processResult(promise: any, callbackSucces: any, callbackError: any) {
    from(promise).subscribe(
      function (x) {
        console.debug("processResult");
        callbackSucces(x);
      },
      function (err) {
        console.error("Error: " + err);
        callbackError({
          success: false,
          data: {
            error: err.toString(),
          },
        });
      },
      function () {
        // console.debug("Completed");
      },
    );
  }

  serviceExample(userName: string, callbackSucces: any, callbackError: any) {
    const promise = this.bridge.serviceExample(userName);
    this.processResult(promise, callbackSucces, callbackError);
  }

  takePhotoCamera(
    title: string,
    subtitle: string,
    documentType: string,
    side: string,
    country: string,
    pluginId: string,
    description: string,
    callbackSucces: any,
    callbackError: any,
  ) {
    const promise = this.bridge.takePhotoCamera(
      title,
      subtitle,
      documentType,
      side,
      country,
      pluginId,
      description,
    );
    this.processResult(promise, callbackSucces, callbackError);
  }

  setState(id: string, state: any, callbackSucces: any, callbackError: any) {
    const promise = this.bridge.setState(id, state);
    this.processResult(promise, callbackSucces, callbackError);
  }

  getState(id: string, callbackSucces: any, callbackError: any) {
    const promise = this.bridge.getState(id);
    this.processResult(promise, callbackSucces, callbackError);
  }

  loadQR(callbackSucces: any, callbackError: any) {
    const promise = this.bridge.loadQR();
    this.processResult(promise, callbackSucces, callbackError);
  }

  getGeolocalization(callbackSucces: any, callbackError: any) {
    const promise = this.bridge.getGeolocalization();
    this.processResult(promise, callbackSucces, callbackError);
  }

  getLanguage(callbackSucces: any, callbackError: any) {
    const promise = this.bridge.getLanguage();
    this.processResult(promise, callbackSucces, callbackError);
  }

  downloadFileAsB64(
    name: string,
    content: string,
    mimeType: string,
    callbackSucces: any,
    callbackError: any,
  ) {
    const promise = this.bridge.downloadFileAsB64(name, content, mimeType);
    this.processResult(promise, callbackSucces, callbackError);
  }

  downloadFileAsBinary(
    name: string,
    content: string,
    mimeType: string,
    callbackSucces: any,
    callbackError: any,
  ) {
    const promise = this.bridge.downloadFileAsBinary(name, content, mimeType);
    this.processResult(promise, callbackSucces, callbackError);
  }

  uploadFile(mimeTypes: any, callbackSucces: any, callbackError: any) {
    const promise = this.bridge.uploadFile(mimeTypes);
    this.processResult(promise, callbackSucces, callbackError);
  }

  downscalerImage(
    value: any,
    width: any,
    height: any,
    callbackSucces: any,
    callbackError: any,
  ) {
    const promise = this.bridge.downscalerImage(value, width, height);
    this.processResult(promise, callbackSucces, callbackError);
  }

  setValueDocument(
    id: any,
    value: any,
    callbackSucces: any,
    callbackError: any,
  ) {
    const promise = this.bridge.setValueDocument(id, value);
    this.processResult(promise, callbackSucces, callbackError);
  }

  getValueDocument(id: any, callbackSucces: any, callbackError: any) {
    const promise = this.bridge.getValueDocument(id);
    this.processResult(promise, callbackSucces, callbackError);
  }

  getOS() {
    return this.bridge.getOS();
  }

  getToken(callbackSucces: any, callbackError: any) {
    const promise = this.bridge.getToken();
    this.processResult(promise, callbackSucces, callbackError);
  }
}
