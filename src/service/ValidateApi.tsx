/**
 * @classdesc service for validate
 * @class ValidateApi
 * @hideconstructor
 */
import _ from "lodash";
import { throwError, concat, of, Observable } from "rxjs";
import {
  map,
  catchError,
  mergeMap,
  filter,
  merge,
  delay,
} from "rxjs/operators";

export default class ValidateApi {
  validateServiceExample(userName: string) {
    return of(!_.isEmpty(userName)).pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        } else {
          throw "login.invalid.request";
        }
      }),
    );
  }

  validateTakePhotoCamera(
    title: string,
    subtitle: string,
    documentType: string,
    side: string,
    country: string,
    pluginId: string,
    description: string,
  ) {
    return of(
      // !_.isEmpty(title) &&
      // !_.isEmpty(subtitle) &&
      !_.isEmpty(documentType) &&
        !_.isEmpty(country) &&
        !_.isEmpty(side) &&
        !_.isEmpty(pluginId),
    ).pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        } else {
          throw "scanner.document.invalid.request";
        }
      }),
    );
  }

  validateSetDocument(id: any, value: any) {
    return of(
      // !_.isEmpty(title) &&
      !_.isEmpty(id) && !_.isEmpty(value),
    ).pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        } else {
          throw "set.document.invalid.request";
        }
      }),
    );
  }

  validateGetDocument(id: any) {
    return of(
      // !_.isEmpty(title) &&
      !_.isEmpty(id),
    ).pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        } else {
          throw "get.document.invalid.request";
        }
      }),
    );
  }

  validateSetState(id: string, state: string) {
    return of(
      // !_.isEmpty(title) &&
      // !_.isEmpty(subtitle) &&
      !_.isEmpty(id) && !_.isEmpty(state),
    ).pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        } else {
          throw "set.state.invalid.request";
        }
      }),
    );
  }

  validateDownloadFileAsB64(name: string, content: string, mimeType: string) {
    return of(
      !_.isEmpty(name) && !_.isEmpty(content) && !_.isEmpty(mimeType),
    ).pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        } else {
          throw "download.file.invalid.request";
        }
      }),
    );
  }

  validateDownloadFileAsBinary(
    name: string,
    content: string,
    mimeType: string,
  ) {
    return of(
      !_.isEmpty(name) && !_.isEmpty(content) && !_.isEmpty(mimeType),
    ).pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        } else {
          throw "download.file.invalid.request";
        }
      }),
    );
  }

  validateGetState(id: string) {
    return of(
      // !_.isEmpty(title) &&
      // !_.isEmpty(subtitle) &&
      !_.isEmpty(id),
    ).pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        } else {
          throw "get.state.invalid.request";
        }
      }),
    );
  }
}
