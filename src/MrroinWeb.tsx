import { Observable, zip, of, from } from "rxjs";
import {
  map,
  catchError,
  mergeMap,
  filter,
  merge,
  delay,
} from "rxjs/operators";
import ValidateApi from "./service/ValidateApi";
import ServiceApi from "./service/ServiceApi";
import StorageApi from "./service/StorageApi";
import BridgeMrroin from "./BridgeMrroin";
import AuthorizationServiceApi from "./service/AuthorizationServiceApi";
import NativeServiceApi from "./service/NativeServiceApi";
import DBServiceApi from "./service/DBServiceApi";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import * as URI from "./service/Uri";
import CryptoJS from "crypto-js";
import LZString from "lz-string";

export default class mrroinWeb {
  serviceApi: ServiceApi;
  validateApi: ValidateApi;
  storageApi: StorageApi;
  sdk: any;
  bridge: BridgeMrroin;
  authorizationServiceApi: AuthorizationServiceApi;
  nativeServiceApi: NativeServiceApi;
  DBServiceApi: DBServiceApi;
  onlyWeb: boolean;
  loadSdk: boolean;
  constructor(sdkmrroin: any, BridgeMrroin: BridgeMrroin, onlyWeb: boolean) {
    this.sdk = sdkmrroin;
    this.bridge = BridgeMrroin;
    this.DBServiceApi = new DBServiceApi(this);
    this.validateApi = new ValidateApi();
    this.authorizationServiceApi = new AuthorizationServiceApi(this);
    this.storageApi = new StorageApi();
    this.serviceApi = new ServiceApi(this);
    this.nativeServiceApi = new NativeServiceApi(this);
    this.onlyWeb = onlyWeb;
    this.loadSdk = false;
  }

  initSdkWeb() {
    console.debug("init initSdkWeb");
    this.nativeServiceApi.createScript();

    return this.authorizationServiceApi.validInfoSdk().pipe(
      mergeMap((data) =>
        this.DBServiceApi.createDatabase().pipe(
          map((response) => {
            return response;
          }),
        ),
      ),
      mergeMap(() =>
        this.authorizationServiceApi.getEvidense().pipe(
          map((evidense) => {
            console.debug("response getEvidense");
            console.debug(evidense);
            return evidense;
          }),
        ),
      ),
      catchError((error) => {
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x: any) => {
          return x;
        });
      }),
    );
  }

  appLoadFinish(apiKey: string) {
    console.debug("mrroinWeb appLoadFinish, ", apiKey);
    if (this.loadSdk) {
      this.loadSdk = true;
      this.sdk.onStart(apiKey, "onLaunch", null, null);
      // this.bridge.handleloadingmrroin(false);
    } else {
      try {
        if (this.onlyWeb) {
          this.initSdkWeb().subscribe(
            (response: any) => {
              this.loadSdk = response.success;
              if (response.success) {
                this.sdk.onStart(apiKey, "onLaunch", response.data, null);
              } else {
                this.sdk.onStart(apiKey, "onLaunch", null, response.data);
              }
              this.loadSdk = response.success;
              // this.bridge.handleloadingmrroin(false);
            },
            (e: any) => {
              this.loadSdk = false;
              this.sdk.onStart(apiKey, "onLaunch", null, e);
              // this.bridge.handleloadingmrroin(false);
            },
          );
        }
      } catch (e: any) {
        this.loadSdk = false;
        this.sdk.onStart(apiKey, "onLaunch", null, e.toString());
        // this.bridge.handleloadingmrroin(false);
      }
    }
  }

  serviceExample(userName: string) {
    return this.validateApi.validateServiceExample(userName).pipe(
      mergeMap((data) =>
        this.authorizationServiceApi.serviceExample(userName).pipe(
          map((response) => {
            return response;
          }),
        ),
      ),
      // mergeMap((token) =>
      //   this.authorizationServiceApi
      //     .saveUser(userName, identityProvider, saveUser)
      //     .pipe(
      //       map((response) => {
      //         return token;
      //       }),
      //     ),
      // ),
      // mergeMap((tokens) =>
      //   this.authorizationServiceApi
      //     .saveCookie(tokens, userName, organization)
      //     .pipe(
      //       map((response) => {
      //         return tokens;
      //       }),
      //     ),
      // ),
      catchError((error) => {
        // console.error(error);
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
  }

  setState(id: string, state: any) {
    const valueState = _.isObject(state) ? JSON.stringify(state) : state;
    return this.validateApi.validateSetState(id, state).pipe(
      mergeMap(() =>
        this.storageApi
          .setState(id, valueState, true)
          .pipe(map((token) => token)),
      ),
      catchError((error) => {
        // console.error(error);
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
  }

  getState(id: string) {
    return this.validateApi.validateGetState(id).pipe(
      mergeMap(() =>
        this.storageApi.getState(id, true).pipe(map((token) => token)),
      ),
      catchError((error) => {
        // console.error(error);
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
  }

  getGeolocalization() {
    return this.nativeServiceApi.getGeolocalization().pipe(
      mergeMap((geolocalization: any) =>
        this.authorizationServiceApi.getEvidenseInfo().pipe(
          map((res) => {
            if (geolocalization.success) {
              return {
                ...geolocalization,
                data: {
                  ...res,
                  ...geolocalization.data,
                },
              };
            } else {
              return geolocalization;
            }
          }),
        ),
      ),
      catchError((error) => {
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );

    // return this.nativeServiceApi.getGeolocalization().pipe(
    //   map((data) => {
    //     console.debug(data, "SEND");
    //     return data;
    //   }),
    //   catchError((error) => {
    //     console.debug(error, "SEND");
    //     return of({
    //       success: false,
    //       data: {
    //         error: error.toString(),
    //       },
    //     }).pipe((x) => x);
    //   }),
    // );
  }

  getLanguage() {
    return this.nativeServiceApi.getLanguage().pipe(
      map((language: any) => language),
      catchError((error) => {
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
  }

  downloadFileAsB64(name: string, content: string, mimeType: string) {
    return this.validateApi
      .validateDownloadFileAsB64(name, content, mimeType)
      .pipe(
        mergeMap((geolocalization: any) =>
          this.nativeServiceApi.downloadFileAsB64(name, content, mimeType).pipe(
            map((response) => {
              return response;
            }),
          ),
        ),
        catchError((error) => {
          return of({
            success: false,
            data: {
              error: error.toString(),
            },
          }).pipe((x) => x);
        }),
      );
  }

  downloadFileAsBinary(name: string, content: string, mimeType: string) {
    return this.validateApi
      .validateDownloadFileAsBinary(name, content, mimeType)
      .pipe(
        mergeMap((geolocalization: any) =>
          this.nativeServiceApi
            .downloadFileAsBinary(name, content, mimeType)
            .pipe(
              map((response) => {
                return response;
              }),
            ),
        ),
        catchError((error) => {
          return of({
            success: false,
            data: {
              error: error.toString(),
            },
          }).pipe((x) => x);
        }),
      );
  }

  uploadFile(mimeTypes: any) {
    return this.nativeServiceApi.uploadFile(mimeTypes).pipe(
      map((response: any) => response),
      catchError((error) => {
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
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
    return this.validateApi
      .validateTakePhotoCamera(
        title,
        subtitle,
        documentType,
        side,
        country,
        pluginId,
        description,
      )
      .pipe(
        mergeMap(() =>
          this.nativeServiceApi
            .initTakePhotoCamera(
              "",
              side,
              title,
              subtitle,
              documentType,
              country,
              description,
              pluginId,
            )
            .pipe(
              map((res) => {
                return res;
              }),
            ),
        ),
        catchError((error) => {
          // console.error(error);
          return of({
            success: false,
            data: {
              error: error.toString(),
            },
          }).pipe((x) => x);
        }),
      );
  }

  loadQrScanner() {
    return this.nativeServiceApi.loadQr().pipe(
      map((data) => {
        console.debug(data, "SEND");
        return data;
      }),
      catchError((error) => {
        console.debug(error, "SEND");
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
  }

  downscalerImage(value: any, width: any, height: any): any {
    console.debug("downscalerImage", value);
    return this.nativeServiceApi.downscalerImage(value, width, height).pipe(
      map((image: any) => {
        console.debug("image", image);
        return image;
      }),
      catchError((error) => {
        // console.error(error);
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
  }

  _base64ToArrayBuffer(base64: string) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  b64toBlob(
    b64Data: string,
    contentType: string,
    sliceSize: any,
    filename: string,
  ) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    console.log(byteArrays);

    return new File(byteArrays, filename, { type: contentType });
  }

  base64ToFile(base64: string, filename: string) {
    return this.b64toBlob(base64, "image/png", 0, filename);
  }

  dataURLtoFile(base64: string, filename: string) {
    let file: any = "";
    let mime: any = "";
    if (base64.includes(",")) {
      const arr: any = base64.split(",");
      mime = arr[0].match(/:(.*?);/)[1];
      file = arr[1];
    } else {
      file = base64;
    }
    const bstr = window.atob(file);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    if ("" === mime) {
      return new File([u8arr], filename);
    } else {
      return new File([u8arr], filename, { type: mime });
    }
  }

  setValueDocument(id: any, value: any) {
    console.debug("setValueDocument");
    const valueState = _.isObject(value) ? JSON.stringify(value) : value;
    return this.validateApi.validateSetDocument(id, valueState).pipe(
      mergeMap(() =>
        this.nativeServiceApi.setValueDocument(id, valueState).pipe(
          map((res) => {
            return res;
          }),
        ),
      ),
      catchError((error) => {
        // console.error(error);
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
  }

  getValueDocument(id: any) {
    return this.validateApi.validateGetDocument(id).pipe(
      mergeMap(() =>
        this.DBServiceApi.getDocument(id).pipe(
          map((res) => {
            return res;
          }),
        ),
      ),
      catchError((error) => {
        // console.error(error);
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
  }

  getToken() {
    return this.authorizationServiceApi.getToken().pipe(
      map((data) => data),
      catchError((error) => {
        // console.error(error);
        return of({
          success: false,
          data: {
            error: error.toString(),
          },
        }).pipe((x) => x);
      }),
    );
  }
}
