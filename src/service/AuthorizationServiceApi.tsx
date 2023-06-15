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
import { throwError, from, of, Observable } from "rxjs";
import MrroinWeb from "../MrroinWeb";
import ServiceApi from "./ServiceApi";
import _ from "lodash";

export default class AuthorizationServiceApi extends ServiceApi {
  mrroinWeb: MrroinWeb;
  constructor(mrroinWeb: MrroinWeb) {
    super(mrroinWeb);
    this.mrroinWeb = mrroinWeb;
  }
  getIP(ip: any) {
    console.debug(ip);
  }

  getIp6() {
    return ajax({
      url: URI.API_INFO_IP_URL_SERVICE + URI.DIVIDER + URI.API6_URL_SERVICE,
      method: "GET",
    }).pipe(
      map((response: any) => {
        if (response && response.response) {
          return response.response.ip;
        } else {
          throw "service.error.getIp6";
        }
      }),
      catchError((er) => {
        throw "service.error.getIp6";
      }),
    );
  }

  getIpInfo(ip: string) {
    return ajax({
      url: URI.API_INFO_IP_URL_SERVICE + ip + "/json/",
      method: "GET",
    }).pipe(
      map((response) => {
        if (response && response.response) {
          return response.response;
        } else {
          throw "service.error.getIpInfo";
        }
      }),
      catchError((er) => {
        throw "service.error.getIpInfo";
      }),
    );
  }

  getEvidenseInfo() {
    // console.debug("getEvidense");
    return this.getIp6().pipe(
      mergeMap((ip) => this.getIpInfo(ip).pipe(map((evidense) => evidense))),
      catchError((er) => {
        return of(er);
      }),
    );
  }

  getEvidense() {
    // const allData= geoip.allData(ipAddress);
    // console.debug(JSON.stringify(allData));
    // return this.getEvidenseInfo().pipe(
    //   map((info) => {
    //     console.debug("getEvidense");
    //     const evidense: any = "service.error.getevidence" === info ? {} : info;
    //     info = {
    //       ...evidense,
    //       appName: navigator.appName,
    //       appCodeName: navigator.appCodeName,
    //       platform: navigator.platform,
    //       cookieEnabled: navigator.cookieEnabled,
    //       userAgent: navigator.userAgent,
    //     };
    //     return { success: true, data: info };
    //   }),
    // );
    const nativePromise = new Promise((resolve, reject) => {
      resolve({
        success: true,
        data: {
          appName: navigator.appName,
          appCodeName: navigator.appCodeName,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          userAgent: navigator.userAgent,
        },
      });
    });
    return from(nativePromise).pipe(map((x) => x));
  }

  refreshToken(data: any) {
    console.debug("loginClient");
    return ajax({
      url: URI.MRROIN_SERVICE + "/token?grant_type=refresh_token",
      method: "POST",
      headers: {
        "x-api-key": window.mrroinGlobalState.apiKey,
        "Content-Type": "application/json",
      },
      body: {
        refresh_token: data.refresh_token,
        identity_provider: data.identityProvider,
      },
    }).pipe(
      map((response: any) => {
        // throw "service.error.login.client";
        if (response && response.response) {
          if (response.response.success === false) {
            throw "service.error.token.expired";
          } else {
            return {
              ...response.response,
            };
          }
        } else {
          throw "service.error.refresh.token.client";
        }
      }),
      catchError((er) => {
        console.debug(er);
        throw er;
      }),
    );
  }

  tokenExpired(token: any) {
    const dataArray = token.data.access_token.split(".");
    const decoded = JSON.parse(atob(dataArray[1]));
    const now = new Date();
    const exp = new Date(decoded.exp * 1000);
    if (now.getTime() < exp.getTime()) {
      console.debug("token recovery");
      return of(token.data).pipe(map((x) => [x]));
    } else {
      console.debug("token is Expired");
      return this.refreshToken(token.data).pipe(
        mergeMap((refreshToken) => {
          if (refreshToken && refreshToken.data && refreshToken.data.error) {
            console.debug("aqui hacer forceLogout");
            return of(refreshToken).pipe(map((x) => [x]));
          } else {
            return this.mrroinWeb.storageApi
              .setState(
                "authorizationUser",
                JSON.stringify({
                  ...refreshToken,
                  identityProvider: token.data.identityProvider,
                }),
                true,
              )
              .pipe(map(() => [refreshToken]));
          }
        }),
        catchError((error) => {
          console.debug("error in refreshTokenClient");
          console.debug("c forceLogoutClient");
          console.debug(error);
          throw error;
        }),
      );
    }
  }

  getToken() {
    // console.debug("get token");
    return this.mrroinWeb.storageApi.getState("authorizationUser", true).pipe(
      map((token: any) => {
        console.debug("token");
        console.debug(JSON.stringify(token));
        if (_.isEmpty(token) || token.success === false) {
          throw "user.unauthorized";
        } else {
          return { success: true, data: token };
        }
      }),
      mergeMap((data) =>
        this.tokenExpired(data.data).pipe(
          mergeMap((token) => {
            // console.debug("token");
            // console.debug(token[0].access_token);
            // if (token[0].success !== false) {
            //   const tn = token[0].access_token.split(".");
            //   if (tn.length > 1) {
            //     // console.debug(tn[1]);
            //     const decodeTn = JSON.parse(window.atob(tn[1]));
            //     // console.debug(decodeTn);
            //     this.mrroinWeb.bridge.mrroinId = decodeTn.username;
            //   }
            // }
            return token;
          }),
        ),
      ),
      catchError((error) => {
        console.debug(error);
        throw error;
      }),
    );
  }

  serviceExample(username: string) {
    console.debug("login");
    return ajax({
      url: URI.MRROIN_SERVICE + URI.PATH_SERVICE + "/token?grant_type=password",
      method: "POST",
      headers: {
        "x-api-key": window.mrroinGlobalState.apiKey,
        "Content-Type": "application/json",
      },
      body: {
        username,
      },
    }).pipe(
      map((response: any) => {
        // throw "service.error.login.client";
        if (response && response.response) {
          return {
            ...response.response,
          };
        } else {
          throw "service.error.login.client";
        }
      }),
      catchError((er) => {
        console.debug(er);
        throw er;
      }),
    );
  }

  validInfoSdk() {
    if (
      !window.mrroinGlobalState.organizationID ||
      !window.mrroinGlobalState.apiKey ||
      !window.mrroinGlobalState.userClient ||
      !window.mrroinGlobalState.passwordClient
    ) {
      throw "invalid client information by initialized mrroin SDK!";
    }
    return of({
      success: true,
    }).pipe(
      map((x) => {
        return [x];
      }),
    );
  }

  decodeJwt(token: string) {
    const decoded = this.wt_decode(token);
    return decoded;
  }

  wt_decode(token: any) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }

  isValidToken(exp: any) {
    if (Date.now() >= exp * 1000) {
      return false;
    }
    return true;
  }

  validToken(token: string) {
    console.debug("validToken");
    let isValid = false;
    try {
      const valuesToken = this.decodeJwt(token);
      isValid = this.isValidToken(valuesToken.exp);
    } catch (e) {
      console.debug(e);
    }
    return isValid;
  }
}
