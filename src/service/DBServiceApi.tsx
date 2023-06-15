/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-this-alias */
/**
 * @classdesc SDK de interaccion de Micro apps mrroin
 * @class mrroinSDKApi
 * @hideconstructor
 */
import "idempotent-babel-polyfill";
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
import _ from "lodash";
import * as RxDB from "rxdb";
import * as schema from "./schemaApp";
import * as db from "pouchdb-adapter-idb";
import { addPouchPlugin, getRxStoragePouch } from "rxdb/plugins/pouchdb";
import { createRxDatabase, addRxPlugin } from "rxdb/plugins/core";
import { RxDBEncryptionPlugin } from "rxdb/plugins/encryption";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
const pjson = require("../../package.json");

export default class DBServiceApi {
  mrroinWeb: MrroinWeb;
  constructor(mrroinWeb: MrroinWeb) {
    this.mrroinWeb = mrroinWeb;
    addRxPlugin(RxDBEncryptionPlugin);
    addRxPlugin(RxDBQueryBuilderPlugin);
    addPouchPlugin(db);
  }

  createDatabase() {
    console.debug("init createDatabase");
    const self = this;
    const createDatabasePromise = new Promise(function (resolve, reject) {
      if (!window.dbMrroin) {
        createRxDatabase({
          ignoreDuplicate: true,
          name:
            window.mrroinGlobalState.organizationID + "mrroin" + pjson.version, // <- name
          storage: getRxStoragePouch("idb"),
          //schema: schema.schemaApplication,
          password: "KdD4t4B4se$$", // <- password (optional)
          multiInstance: true, // <- multiInstance (optional, default: true)
        })
          .then((db) => {
            console.debug("createRxDatabase ok");
            console.debug(db);
            window.dbMrroin = db;
            window.dbMrroin
              .addCollections({
                document: {
                  name: "document",
                  schema: schema.schemaDocument,
                },
              })
              .then((collections: any) => {
                console.debug("addCollections ok");
                window.mrroinCollection = collections;
                resolve({
                  success: true,
                });
              })
              .catch((error: any) => {
                console.debug("addCollections error");
                reject(error);
                // resolve({
                //   success: false,
                //   data: {
                //     error: error.toString(),
                //   },
                // });
              });
          })
          .catch((error) => {
            console.debug("createRxDatabase error");
            reject(error);
            // resolve({
            //   success: false,
            //   data: {
            //     error: error.toString(),
            //   },
            // });
          });
      } else {
        console.debug("db already exist");
        resolve({
          success: true,
        });
      }
    });
    return from(createDatabasePromise).pipe(map((x) => x));
  }

  insertDocument(document: any) {
    console.debug("insertDocumentRx");
    console.debug(document);
    const insertDocumentRx = new Promise(function (resolve, reject) {
      window.dbMrroin.document.upsert(document).then((responseInsert: any) => {
        let data = responseInsert.toJSON().value;
        try {
          data = JSON.parse(data);
        } catch (e: any) {
          console.debug("insertDocument ", e);
        }
        resolve(data);
      });
    });
    return from(insertDocumentRx).pipe(map((x) => x));
  }

  getDocument(id: any) {
    const getDocument = new Promise(function (resolve, reject) {
      // console.debug("consultando documento");
      window.mrroinCollection.document
        .findOne()
        .where("id")
        .eq(id)
        .exec()
        .then((document: any) => {
          // console.debug("respuesta documento");
          if (document) {
            const documentData = document.toJSON();
            console.debug(documentData);
            try {
              documentData.value = JSON.parse(documentData.value);
            } catch (e) {
              console.debug("insertDocument ", e);
            }
            resolve({
              success: true,
              data: documentData.value,
            });
          } else {
            resolve({
              success: false,
              data: { error: "document.not.found", payload: id },
            });
          }
        });
    });
    return from(getDocument).pipe(map((x) => x));
  }
}
