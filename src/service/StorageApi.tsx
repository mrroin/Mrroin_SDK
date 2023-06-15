/**
 * @classdesc service for validate
 * @class ValidateApi
 * @hideconstructor
 */
import _ from "lodash";

import {
  map,
  catchError,
  mergeMap,
  filter,
  merge,
  delay,
} from "rxjs/operators";
import { throwError, from, of } from "rxjs";
import CryptoJS from "crypto-js";
import LZString from "lz-string";

export default class StorageApi {
  setState(id: string, state: string, saveLocalStorage: boolean) {
    const setState = new Promise(function (resolve, reject) {
      try {
        const token = CryptoJS.AES.encrypt(state, "mrroinPlatform").toString();
        if (saveLocalStorage) {
          localStorage.setItem(
            "kd-" + LZString.compress(id),
            LZString.compress(token),
          );
        } else {
          sessionStorage.setItem(
            "kd-" + LZString.compress(id),
            LZString.compress(token),
          );
        }
        resolve({ success: true });
      } catch (err: any) {
        console.error(err);
        resolve({ success: false, data: { error: err.toString() } });
      }
    });
    return from(setState).pipe(map((x) => x));
  }
  setStateLine(id: string, state: string, saveLocalStorage: boolean) {
    try {
      const token = CryptoJS.AES.encrypt(state, "mrroinPlatform").toString();
      if (saveLocalStorage) {
        localStorage.setItem(
          "kd-" + LZString.compress(id),
          LZString.compress(token),
        );
      } else {
        sessionStorage.setItem(
          "kd-" + LZString.compress(id),
          LZString.compress(token),
        );
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  getState(id: string, getLocalStorage: boolean) {
    const getState = new Promise(function (resolve, reject) {
      try {
        let dataVerify: any;
        if (getLocalStorage) {
          dataVerify = localStorage.getItem("kd-" + LZString.compress(id));
        } else {
          dataVerify = sessionStorage.getItem("kd-" + LZString.compress(id));
        }
        if (dataVerify) {
          const decompress: any = LZString.decompress(dataVerify);
          const bytes = CryptoJS.AES.decrypt(decompress, "mrroinPlatform");
          let state = bytes.toString(CryptoJS.enc.Utf8);
          try {
            if ("" === state) {
              resolve({ success: false, data: { error: "get.state.empty" } });
            } else {
              state = JSON.parse(state);
            }
          } catch (e: any) {
            console.debug(e);
          }
          resolve({ success: true, data: state });
        }
        resolve({ success: false, data: { error: "get.state.unknow.state" } });
      } catch (err: any) {
        console.error(err);
        resolve({ success: false, data: { error: err.toString() } });
      }
    });
    return from(getState).pipe(map((x) => x));
  }

  clearState(id: string, getLocalStorage: boolean) {
    const getState = new Promise(function (resolve, reject) {
      try {
        console.debug("remove: kd-" + LZString.compress(id));
        if (getLocalStorage) {
          localStorage.removeItem("kd-" + LZString.compress(id));
        } else {
          sessionStorage.removeItem("kd-" + LZString.compress(id));
        }
        resolve({ success: true, data: { error: "item..state.removed" } });
      } catch (err: any) {
        console.error(err);
        resolve({ success: false, data: { error: err.toString() } });
      }
    });
    return from(getState).pipe(map((x) => x));
  }
}
