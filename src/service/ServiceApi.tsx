/**
 * @classdesc SDK de interaccion de Micro apps mrroin
 * @class mrroinSDKApi
 * @hideconstructor
 */
import * as URI from "./Uri";
import {
  map,
  catchError,
  mergeMap,
  filter,
  merge,
  delay,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import "js-camera";
import { v4 as uuidv4 } from "uuid";
import { throwError, from, of, Observable } from "rxjs";
import MrroinWeb from "../MrroinWeb";

export default class ServiceApi {
  mrroinWeb: MrroinWeb;
  constructor(mrroinWeb: MrroinWeb) {
    this.mrroinWeb = mrroinWeb;
  }

  b64toBlob(b64Data: string, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
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

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
