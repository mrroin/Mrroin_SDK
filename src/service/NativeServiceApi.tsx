/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-this-alias */
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
import { throwError, from, of, Observable, zip } from "rxjs";
import ServiceApi from "./ServiceApi";
import MrroinWeb from "../MrroinWeb";
import StorageApi from "./StorageApi";
import _, { every } from "lodash";
import QrScanner from "qr-scanner";
import * as unzip from "@zip.js/zip.js";
import { generate } from "@prescott/geo-pattern";
const pica = require("pica")(["js"]);

export default class NativeServiceApi extends ServiceApi {
  MrroinWeb: MrroinWeb;
  functionUIResponse: any;
  busMapp: any;
  parcels: any;
  busTopics: any;
  connectionWss: any;
  storageApi: StorageApi;

  constructor(MrroinWeb: MrroinWeb) {
    super(MrroinWeb);
    this.MrroinWeb = MrroinWeb;
    this.functionUIResponse = [];
    this.busMapp = [];
    this.parcels = {};
    this.busTopics = {};
    this.connectionWss = {};
    this.storageApi = new StorageApi();
  }

  createScript() {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = function () {
      window.SystemJS = window.System;

      const script3 = document.createElement("script");
      script3.type = "text/javascript";
      script3.onload = function () {
        console.debug("script3");
      };
      script3.src = "https://unpkg.com/systemjs@4.1.0/dist/extras/amd.js";
      document.body.append(script3);

      const script4 = document.createElement("script");
      script4.type = "text/javascript";
      script4.onload = function () {
        console.debug("script4");
      };
      script4.src =
        "https://unpkg.com/systemjs@4.1.0/dist/extras/use-default.js";
      document.body.append(script4);
    };
    script.src = "https://unpkg.com/systemjs@4.1.0/dist/system.js";
    document.body.append(script);
  }

  initTakePhotoCamera(
    data: any,
    side: any,
    title: any,
    subtitle: any,
    documentType: any,
    country: any,
    description: any,
    pluginId: any,
  ) {
    const nativePromise = new Promise((resolve, reject) => {
      const id = uuidv4();
      const configCamera = this.configurationCamera(documentType, id);
      this.takePhotoCamera(
        configCamera[0],
        configCamera[1],
        {
          data,
          side,
          title,
          subtitle,
          documentType,
          country,
          description,
          pluginId,
        },
        resolve,
        id,
      );
    });
    return from(nativePromise).pipe(map((x) => x));
  }

  upscalerImage(image: string) {
    console.debug("upscalerImage", image);
    const nativePromise = new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.src = "data:image/png;base64," + image;
        img.style.filter = "brightness(.7)";
        img.onload = () => {
          const srcImage: any = document.createElement("canvas");
          srcImage.id = "src";
          srcImage.width = img.width;
          srcImage.height = img.height;
          srcImage.style.filter = "brightness(.7)";
          srcImage.style.display = "none";
          document.body.appendChild(srcImage);
          let ctx: any = null;
          ctx = srcImage.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const offScreenCanvas = document.createElement("canvas");
          srcImage.id = "to";
          offScreenCanvas.width = img.width;
          offScreenCanvas.height = img.height;
          offScreenCanvas.style.filter = "brightness(.7)";
          pica
            .resize(srcImage, offScreenCanvas, {
              filter: "mks2013",
              // transferable: true,
              // unsharpAmount: 0,
              // unsharpRadius: 0.5,
              // unsharpThreshold: 0,
              transferable: false,
              unsharpAmount: 0,
              unsharpRadius: 0.5,
              unsharpThreshold: 0,
            })
            .then((result: any) => {
              console.debug(result);
              return pica.toBlob(result, "image/jpeg", 3);
            })
            .then((blob: any) => {
              console.debug("resized to canvas & created blob!");
              console.debug(blob);
              const reader = new FileReader();
              reader.onload = function () {
                const dataUrl: any = reader.result;
                const base64 = dataUrl.split(",")[1];
                console.debug(base64);
                const src = document.getElementById("src");
                if (src) {
                  src.remove();
                }
                const to = document.getElementById("to");
                if (to) {
                  to.remove();
                }
                console.debug("RESOLVE");
                resolve({ success: true, data: { image: base64 } });
              };
              reader.readAsDataURL(blob);
            });
        };
      } catch (e: any) {
        resolve({ success: false, data: { error: e.toString() } });
      }
    });
    return from(nativePromise).pipe(map((x) => x));
  }

  downscalerImagePromise(image: string, width?: any, height?: any) {
    console.debug("downscalerImage", image);
    const nativePromise = new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.src =
          (image.includes("data:image/png;base64,")
            ? ""
            : "data:image/png;base64,") + image;
        // img.style.filter = "brightness(.7)";
        img.style.background = "transparent";
        img.onload = () => {
          const srcImage: any = document.createElement("canvas");
          srcImage.id = "src";
          srcImage.width = img.width;
          srcImage.height = img.height;
          // srcImage.style.filter = "brightness(.7)";
          srcImage.style.background = "transparent";
          // srcImage.style.display = "none";
          document.body.appendChild(srcImage);
          let ctx: any = null;
          ctx = srcImage.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const offScreenCanvas = document.createElement("canvas");
          srcImage.id = "to";
          offScreenCanvas.width = width ? width : img.width;
          offScreenCanvas.height = height ? height : img.height;
          // offScreenCanvas.style.filter = "brightness(.7)";
          offScreenCanvas.style.background = "transparent";
          pica
            .resize(srcImage, offScreenCanvas, {
              filter: "mks2013",
              // transferable: true,
              // unsharpAmount: 0,
              // unsharpRadius: 0.5,
              // unsharpThreshold: 0,
              transferable: false,
              unsharpAmount: 0,
              unsharpRadius: 0.5,
              unsharpThreshold: 0,
            })
            .then((result: any) => {
              console.debug(result);
              return pica.toBlob(result, "image/png", 3);
            })
            .then((blob: any) => {
              console.debug("resized to canvas & created blob!");
              console.debug(blob);
              const reader = new FileReader();
              reader.onload = function () {
                const dataUrl: any = reader.result;
                const base64 = dataUrl.split(",")[1];
                console.debug(base64);
                const src = document.getElementById("src");
                if (src) {
                  src.remove();
                }
                const to = document.getElementById("to");
                if (to) {
                  to.remove();
                }
                console.debug("RESOLVE");
                resolve({ success: true, data: { image: base64 } });
              };
              reader.readAsDataURL(blob);
            });
        };
      } catch (e: any) {
        resolve({ success: false, data: { error: e.toString() } });
      }
    });
    return nativePromise;
  }

  downscalerImage(image: string, width?: any, height?: any) {
    console.debug("downscalerImage", image);
    return from(this.downscalerImagePromise(image, width, height)).pipe(
      map((x) => x),
    );
  }

  watermark(image: string, label: string) {
    console.debug("watermark", image);
    //aqui usar watermark.js
    const nativePromise = new Promise((resolve, reject) => {
      try {
        const self = this;
        // const canvas = document.createElement("canvas");
        const iWatermark = new Image();
        const iMark = "Certified with mrroin";
        // var canvas = document.getElementById("demo");
        const canvas = document.createElement("canvas");
        // const canvas: any = document.getElementById("demo");
        const ctx: any = canvas.getContext("2d");
        iWatermark.onload = () => {
          // (C1) ADD BACKGROUND IMAGE
          const canvasWidth = iWatermark.width;
          const canvasHeight = iWatermark.height;
          console.log(canvasWidth, canvasHeight);
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          ctx?.drawImage(iWatermark, 0, 0, canvasWidth, canvasHeight);
          ctx.fillStyle = "#01364d";
          ctx.textBaseline = "middle";
          ctx.font = "bold 25px Roboto";
          ctx?.fillText(iMark, 10, canvas.height - 20);
          const iBack = new Image();
          iBack.onload = () => {
            console.debug(
              "iBack",
              iBack,
              canvasWidth - iBack.width,
              canvasHeight - iBack.height,
            );
            ctx.drawImage(iBack, canvasWidth - 85, canvasHeight - 85, 85, 85);
            ctx.textBaseline = "middle";
            ctx.font = "bold 15px Roboto";
            ctx.textBaseline = "middle";
            ctx.font = "bold 15px Roboto";
            const gradient = ctx.createLinearGradient(200, 0, canvas.width, 0);
            gradient.addColorStop("0", "#42cbf7");
            gradient.addColorStop("0.5", "#01364d");
            gradient.addColorStop("1.0", "white");
            ctx.fillStyle = gradient;
            // ctx.rotate(-0.4);
            // ctx.textAlign = "right";
            ctx.globalAlpha = 0.5;
            ctx?.fillText(
              label,
              canvas.width / 2 - 160,
              canvas.height / 2 - 60,
            );
            ctx?.fillText(
              label,
              canvas.width / 2 - 160,
              canvas.height / 2 + 10,
            );
            ctx?.fillText(
              label,
              canvas.width / 2 - 160,
              canvas.height / 2 + 80,
            );

            ctx?.fillText(label, 20, canvas.height / 2 - 80);
            ctx?.fillText(label, 20, canvas.height / 2 - 10);
            ctx?.fillText(label, 20, canvas.height / 2 + 60);

            ctx?.fillText(
              label,
              canvas.width / 2 + 220,
              canvas.height / 2 - 40,
            );
            ctx?.fillText(
              label,
              canvas.width / 2 + 220,
              canvas.height / 2 + 30,
            );
            ctx?.fillText(
              label,
              canvas.width / 2 + 220,
              canvas.height / 2 + 100,
            );
            ctx.restore();
            generate({
              input: "",
              color: "#00000000",
              patterns: [
                "chevrons",
                // "diamonds",
                // "hexagons",
                // "octagons",
                // "plaid",
                // "squares",
                // "tessellation",
                // "triangles",
                // "xes",
              ],
              baseColor: "#01364d",
            }).then((pattern) => {
              console.log(pattern);
              // expected output: "Success!"
              const dataUri = pattern.toDataURL();
              // console.debug("dataUri", dataUri);
              const img = new Image();
              img.onload = function () {
                ctx.globalAlpha = 0.2;
                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                const water = canvas.toDataURL("image/png", 0.7);
                console.debug(water);
                resolve({ success: true, data: water });
                // self
                //   .downscalerImagePromise(
                //     water,
                //     canvasWidth - 50,
                //     canvasHeight - 50,
                //   )
                //   .then((downscalerImage: any) => {
                //     console.debug("downscalerImage", downscalerImage);
                //     console.debug(downscalerImage.data.image);
                //     resolve({
                //       success: true,
                //       data: downscalerImage.data.image,
                //     });
                //   });
              };
              img.src = dataUri;
            });
          };
          iBack.src =
            "data:image/png;base64,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";
        };
        iWatermark.src = "data:image/png;base64," + image;
      } catch (e: any) {
        resolve({ success: false, data: { error: e.toString() } });
      }
    });
    return from(nativePromise).pipe(map((x) => x));
  }

  setValueDocument(id: any, value: any) {
    const documentSave = {
      id: id,
      value: value,
    };
    return this.MrroinWeb.DBServiceApi.insertDocument(documentSave).pipe(
      map((response: any) => {
        console.debug(response);
        return { success: true, data: response };
      }),
      catchError((er) => {
        throw er;
      }),
    );
  }

  configurationCamera(documentType: any, id: string) {
    let cameraInside: any;
    let divCamera: any;
    const camera: any = document.createElement("div");
    camera.id = id;
    if (camera) {
      const sizesCameraCards = {
        INE421: {
          widthCamera: "83vw",
          heightCamera: "26vh",
        },
        INE430: {
          widthCamera: "70vw",
          heightCamera: "26vh",
        },
        INE530: {
          widthCamera: "60vw",
          heightCamera: "26vh",
        },
        INE600: {
          widthCamera: "73vw",
          heightCamera: "26vh",
        },
        INE750: {
          widthCamera: "51vw",
          heightCamera: "30vh",
        },
        INE830: {
          widthCamera: "33vw",
          heightCamera: "26vh",
        },
        INE960: {
          widthCamera: "51vw",
          heightCamera: "30vh",
        },
        INE1024: {
          widthCamera: "30vw",
          heightCamera: "30vh",
        },
        INE1280: {
          widthCamera: "43vw",
          heightCamera: "30vh",
        },
        INE1500: {
          widthCamera: "25vw",
          heightCamera: "30vh",
        },
        INE1920: {
          widthCamera: "51vw",
          heightCamera: "30vh",
        },
        INE1921: {
          widthCamera: "25vw",
          heightCamera: "29vh",
        },
        "421": {
          widthCamera: "100vw",
          heightCamera: "90vh",
        },
        "500": {
          widthCamera: "100vw",
          heightCamera: "90vh",
        },
        "600": {
          widthCamera: "75vw",
          heightCamera: "68vh",
        },
        "750": {
          widthCamera: "59vw",
          heightCamera: "68vh",
        },
        "830": {
          widthCamera: "52vw",
          heightCamera: "59vh",
        },
        "960": {
          widthCamera: "52vw",
          heightCamera: "59vh",
        },
        "1024": {
          widthCamera: "52vw",
          heightCamera: "62vh",
        },
        "1280": {
          widthCamera: "52vw",
          heightCamera: "59vh",
        },
        "1500": {
          widthCamera: "52vh",
          heightCamera: "59vh",
        },
        "1920": {
          widthCamera: "59vh",
          heightCamera: "59vh",
        },
        "1921": {
          widthCamera: "59vh",
          heightCamera: "59vh",
        },
      };
      let siseScreen: any = "1280";
      console.debug(window.innerWidth, siseScreen, "INNNERCAMERA");
      if (window.innerWidth < 421) {
        siseScreen = "421";
      } else if (window.innerWidth < 430) {
        siseScreen = "430";
      } else if (window.innerWidth < 530) {
        siseScreen = "530";
      } else if (window.innerWidth < 600) {
        siseScreen = "600";
      } else if (window.innerWidth < 750) {
        siseScreen = "750";
      } else if (window.innerWidth < 830) {
        siseScreen = "830";
      } else if (window.innerWidth < 960) {
        siseScreen = "960";
      } else if (window.innerWidth < 1025) {
        siseScreen = "1024";
      } else if (window.innerWidth < 1280) {
        siseScreen = "1280";
      } else if (window.innerWidth < 1500) {
        siseScreen = "1500";
      } else if (window.innerWidth < 1920) {
        siseScreen = "1920";
      } else if (window.innerWidth > 1920) {
        siseScreen = "1921";
      }

      const sizeCamera = documentType
        ? "INE" === documentType
          ? sizesCameraCards[documentType + siseScreen]
          : sizesCameraCards[siseScreen]
        : {
            widthCamera: "95vw",
            heightCamera: "95vh",
          };
      camera.innerHTML =
        '<js-camera id="jscamera2" controls autoplay facing="back" width="' +
        1920 +
        '" height="' +
        1080 +
        '"></js-camera>';
      document.body.appendChild(camera);
      const camera2 = document.querySelector("#jscamera2");
      camera.style.height = "100%";
      camera.style.width = 0;
      camera.style.position = "fixed";
      camera.style.background = "#000";
      camera.style.zIndex = 16777200;
      camera.style.pointerEvents = "all";
      camera.style.top = 0;
      camera.style.left = 0;
      camera.style.overflow = "hidden";
      camera.style.transition = "opacity 1s ease";
      camera.style.width = "100%";
      camera.style.display = "flex";
      camera.style.flexDirection = "column";
      camera.style.justifyContent = "center";
      camera.style.textAlign = "center";
      const cameraStyles: any | null =
        document.getElementsByClassName("camera");
      // cameraStyles[0].style.width = sizeCamera.widthCamera;
      // cameraStyles[0].style.height = sizeCamera.heightCamera;
      cameraStyles[0].style.textAlign = "center";
      cameraStyles[0].style.display = "flex";
      cameraStyles[0].style.alignItems = "center";
      // cameraStyles[0].style.margin = "0 auto";
      const cameraVideo: any = document.getElementsByClassName("camera-video");
      cameraVideo[0].style.width = sizeCamera.widthCamera;
      cameraVideo[0].style.height = sizeCamera.heightCamera;
      cameraVideo[0].style.position = "relative";
      cameraVideo[0].style.margin = "0 auto";

      const buttonPause = document.getElementsByClassName("camera-player");
      buttonPause[0].remove();
      const cameraCaptured: any =
        document.getElementsByClassName("camera-captured");
      cameraCaptured[0].style.visibility = "hidden";
      const cameraControls: any = document.getElementsByClassName(
        "camera-controls-content",
      );
      cameraControls[0].style.display = "block";
      cameraInside = camera2;
      divCamera = camera;
    }
    return [divCamera, cameraInside];
  }

  getFieldList(fieldList: any) {
    const lastFieldList = fieldList[fieldList.length - 1];
    return lastFieldList;
  }

  listener(event: any, id: any, resolve: any, operationParameters: any) {
    if (event.detail && event.detail.code) {
      const divJsCamera: any = document.getElementById(id);
      console.debug(event, divJsCamera);
      divJsCamera.remove();
      resolve({
        success: false,
        data: { error: "invalid File" },
      });
      return of({
        success: false,
        data: { error: "invalid File" },
      }).pipe((x: any) => {
        return x;
      });
      return divJsCamera.remove();
    }
    console.debug(event.detail, "general");
    if (
      operationParameters.documentType.toUpperCase() === "VOTER_CARD_MEX" ||
      operationParameters.documentType.toUpperCase() === "INE"
    ) {
      if (
        (event.detail.rawResponse.ChipPage === 0 &&
          operationParameters.side.toUpperCase() === "BACK") ||
        (event.detail.rawResponse.ChipPage === 1 &&
          operationParameters.side.toUpperCase() === "FRONT")
      ) {
        resolve({
          success: false,
          data: {
            error: "side.document.invalid",
          },
        });
      }
    }
    const fieldList = this.getFieldList(event.detail.images.fieldList);
    const isUpload = event.detail.lowLvlResponse.log;
    console.debug(fieldList);

    const containerType = fieldList.valueList.filter((item: any) => {
      return item.containerType === 1;
    });
    if (isUpload) {
      if (fieldList.valueList.length > 2) {
        const image = fieldList.valueList[0].value;
        const uuidState = uuidv4();
        const imagenScaler = this.upscalerImage(image);
        console.debug(imagenScaler);
        this.upscalerImage(image).subscribe((response: any) => {
          console.debug(response, "RESPONSE");
          if (response.success === false) {
            throw response && response.data && response.data.error
              ? response.data.error
              : "extractdocumentdata.not.found.imageFront";
          }
          const documentSave = {
            id: uuidState,
            value: JSON.stringify({
              ...operationParameters,
              id: uuidState,
              data: response.data.image,
              datapng: image,
            }),
          };
          this.MrroinWeb.DBServiceApi.insertDocument(documentSave).subscribe(
            (response: any) => {
              console.debug(response);
              const divJsCamera: any = document.getElementById(id);
              divJsCamera.remove();
              resolve({
                success: true,
                data: {
                  ...operationParameters,
                  id: uuidState,
                  data: response.data,
                  datapng: image,
                },
              });
            },
          ),
            catchError((error) => {
              const divJsCamera: any = document.getElementById(id);
              divJsCamera.remove();
              resolve({
                success: false,
                data: {
                  error: error.toString(),
                },
              });
              return of({
                success: false,
                data: {
                  error: error.toString(),
                },
              }).pipe((x: any) => {
                return x;
              });
            });
        });
      } else {
        const image = containerType[0].value;
        const uuidState = uuidv4();
        const imagenScaler = this.upscalerImage(image);
        this.upscalerImage(image).subscribe((response: any) => {
          console.debug(response, "RESPONSE");
          if (response.success === false) {
            throw response && response.data && response.data.error
              ? response.data.error
              : "extractdocumentdata.not.found.imageFront";
          }
          const documentSave = {
            id: uuidState,
            value: JSON.stringify({
              ...operationParameters,
              id: uuidState,
              data: response.data.image,
              datapng: image,
            }),
          };
          this.MrroinWeb.DBServiceApi.insertDocument(documentSave).subscribe(
            (response: any) => {
              const divJsCamera: any = document.getElementById(id);
              divJsCamera.remove();
              console.debug(response);
              resolve({
                success: true,
                data: {
                  ...operationParameters,
                  id: uuidState,
                  data: response.data,
                  datapng: image,
                },
              });
            },
          ),
            catchError((error) => {
              const divJsCamera: any = document.getElementById(id);
              divJsCamera.remove();
              resolve({
                success: false,
                data: {
                  error: error.toString(),
                },
              });
              return of({
                success: false,
                data: {
                  error: error.toString(),
                },
              }).pipe((x: any) => {
                return x;
              });
            });
        });
      }
    } else if (!isUpload) {
      if (containerType.length === 1) {
        const image = containerType[0].value;
        const uuidState = uuidv4();
        const imagenScaler = this.upscalerImage(image);
        console.debug(imagenScaler);
        this.upscalerImage(image).subscribe((response: any) => {
          console.debug(response, "RESPONSE");
          if (response.success === false) {
            throw response && response.data && response.data.error
              ? response.data.error
              : "extractdocumentdata.not.found.imageFront";
          }
          const documentSave = {
            id: uuidState,
            value: JSON.stringify({
              ...operationParameters,
              id: uuidState,
              data: response.data.image,
              datapng: image,
            }),
          };
          this.MrroinWeb.DBServiceApi.insertDocument(documentSave).subscribe(
            (response: any) => {
              console.debug(response);
              const divJsCamera: any = document.getElementById(id);
              divJsCamera.remove();
              console.debug(response);
              resolve({
                success: true,
                data: {
                  ...operationParameters,
                  id: uuidState,
                  data: response.data,
                  datapng: image,
                },
              });
            },
          ),
            catchError((error) => {
              const divJsCamera: any = document.getElementById(id);
              divJsCamera.remove();
              resolve({
                success: false,
                data: {
                  error: error.toString(),
                },
              });
              return of({
                success: false,
                data: {
                  error: error.toString(),
                },
              }).pipe((x: any) => {
                return x;
              });
            });
        });
      } else {
        this.upscalerImage(containerType[0].value)
          .pipe((imageFront) => {
            return imageFront;
          })
          .subscribe((imageFront: any) => {
            this.upscalerImage(containerType[1].value)
              .pipe((imageBack) => {
                return imageBack;
              })
              .subscribe((imageBack: any) => {
                const uuidStateFront = uuidv4();
                const documentSaveFront = {
                  id: uuidStateFront,
                  value: JSON.stringify({
                    ...operationParameters,
                    id: uuidStateFront,
                    data: imageFront.data.image,
                    datapng: containerType[0].value,
                  }),
                };
                const uuidStateBack = uuidv4();
                const documentSaveBack = {
                  id: uuidStateBack,
                  value: JSON.stringify({
                    ...operationParameters,
                    id: uuidStateBack,
                    data: imageBack.data.image,
                    datapng: containerType[1].value,
                  }),
                };
                this.MrroinWeb.DBServiceApi.insertDocument(documentSaveFront)
                  .pipe((responseFrontInsert: any) => {
                    return responseFrontInsert;
                  })
                  .subscribe((responseFrontInsert: any) => {
                    this.MrroinWeb.DBServiceApi.insertDocument(documentSaveBack)
                      .pipe((responseBackInsert) => {
                        return responseBackInsert;
                      })
                      .subscribe((responseBackInsert: any) => {
                        const divJsCamera: any = document.getElementById(id);
                        divJsCamera.remove();
                        resolve({
                          success: true,
                          data: {
                            frontId: responseFrontInsert.id,
                            frontImage: responseFrontInsert.data,
                            backId: responseBackInsert.id,
                            backImage: responseBackInsert.data,
                          },
                        });
                      });
                  });
                catchError((error) => {
                  const divJsCamera: any = document.getElementById(id);
                  divJsCamera.remove();
                  resolve({
                    success: false,
                    data: {
                      error: error.toString(),
                    },
                  });
                  return of({
                    success: false,
                    data: {
                      error: error.toString(),
                    },
                  }).pipe((x: any) => {
                    return x;
                  });
                });
              });
          });
      }
    }
  }

  loadQr() {
    const loadQrPromise = new Promise((resolve, reject) => {
      // const tag: any = document.getElementById("mrroin");
      const close: any = document.createElement("div");
      close.innerHTML =
        '<svg height="60" width="60" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="11"  x2="11" y2="1" stroke="white" stroke-width="2"/><line x1="1" y1="1" x2="11" y2="11" stroke="white" stroke-width="2"/></svg>';
      const appElement: any = document.createElement("div");
      appElement.id = "qrCode";
      appElement.style.height = "100%";
      appElement.style.width = "100%";
      appElement.style.position = "fixed";
      appElement.style.zIndex = "16777199";
      appElement.style.pointerEvents = "all";
      appElement.style.top = "0";
      appElement.style.left = "0";
      appElement.style.overflow = "hidden";
      appElement.style.transition = "opacity 1s ease";
      appElement.style.display = "flex";
      appElement.style.justifyContent = "center";
      appElement.style.alignItems = "center";
      // appElement.style.padding= "10%";
      appElement.style.flexDirection = "column";
      appElement.style.background = "black";
      const videoElement: any = document.createElement("video");
      const selectElement: any = document.createElement("select");
      videoElement.id = "qr";
      videoElement.style.width = "400vw";
      videoElement.style.height = "400px";
      selectElement.style.marginTop = "30px";
      selectElement.style.color = "#000000";
      selectElement.style.borderRadius = "20px";
      selectElement.style.backgroundColor = "#FFFFFF";
      selectElement.style.height = "30px";
      selectElement.style.padding = "5px";
      close.style.alignSelf = "flex-end";
      close.style.width = "6vw";
      document.body.appendChild(appElement);
      appElement.appendChild(close);
      appElement.appendChild(videoElement);
      appElement.appendChild(selectElement);
      const qr: any = document.getElementById("qr");
      const qrScanner = new QrScanner(
        qr,
        (result: any) => {
          console.debug(result);
          qrScanner.stop();
          const div: any = document.getElementById("qrCode");
          div.remove();
          resolve({
            success: true,
            data: {
              result: result.data,
            },
          });
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        },
      );
      qrScanner.start().then(() => {
        QrScanner.listCameras(true).then((cameras: any) =>
          cameras.forEach((camera: any) => {
            const option = document.createElement("option");
            option.value = camera.id;
            option.text = camera.label;
            selectElement.add(option);
          }),
        );
      });
      selectElement.addEventListener(
        "change",
        (event: { target: { value: any } }) => {
          qrScanner.setCamera(event.target.value);
        },
      );
      close.addEventListener("click", (event: { target: { value: any } }) => {
        resolve({
          success: false,
          data: {
            result: "sdk.load.qr.close",
          },
        });
        qrScanner.stop();
        const div: any = document.getElementById("qrCode");
        div.remove();
      });
    });
    return from(loadQrPromise).pipe(map((x) => x));
  }

  downloadFileAsB64(name: string, content: string, mimeType: string) {
    const downloadFileAsB64Promise = new Promise((resolve, reject) => {
      try {
        if (mimeType.includes("image")) {
          const pageImage = new Image();
          pageImage.src = "data:" + mimeType + ";base64," + content;
          pageImage.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = pageImage.naturalWidth;
            canvas.height = pageImage.naturalHeight;
            const ctx: any = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(pageImage, 0, 0);
            const link = document.createElement("a");
            link.download = name;
            canvas.toBlob((blob: any) => {
              console.debug(blob);
              link.href = URL.createObjectURL(blob);
              link.click();
              link.remove();
            });
          };
        } else {
          const linkSource = "data:" + mimeType + ";base64," + content;
          const downloadLink = document.createElement("a");
          const fileName = name;
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          downloadLink.remove();
          // blob = new Blob([window.atob(content)], {
          //   type: mimeType,
          // });
          // console.debug(content);
          // console.debug("*_* blob: ", blob, content);
          // const url = window.URL.createObjectURL(blob);
          // const link = document.createElement("a");
          // link.href = url;
          // link.download = name ? name : "download";
          // link.dispatchEvent(new MouseEvent("click"));
          // window.URL.revokeObjectURL(url);
          // link.remove();
        }
        resolve({
          success: true,
          data: { message: "file download successfully" },
        });
      } catch (e: any) {
        resolve({
          success: false,
          data: { error: e.toString() },
        });
      }
    });
    return from(downloadFileAsB64Promise).pipe(map((x) => x));
  }

  downloadFileAsBinary(name: string, content: string, mimeType: string) {
    const downloadFileAsB64Promise = new Promise((resolve, reject) => {
      try {
        const blob = this.getBlob(content, mimeType);
        const reader = new FileReader();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.dispatchEvent(new MouseEvent("click"));
        window.URL.revokeObjectURL(url);
        resolve({
          success: true,
          data: { message: "file download successfully" },
        });
      } catch (e: any) {
        resolve({
          success: false,
          data: { error: e.toString() },
        });
      }
    });
    return from(downloadFileAsB64Promise).pipe(map((x) => x));
  }

  uploadFile(mimeTypes: any): any {
    const uploadFilePromise = new Promise((resolve, reject) => {
      try {
        console.debug(mimeTypes.join(","));
        const inputFile: any = document.createElement("INPUT");
        inputFile.id = "fileuploadkd";
        inputFile.setAttribute("type", "file");
        inputFile.multiple = false;
        inputFile.accept = mimeTypes.join(",");
        inputFile.click();
        inputFile.onchange = () => {
          // console.debug("input onchange file");
          const doc: any = document.getElementById("fileuploadkd");
          if (doc) {
            const fileUpload = doc.files[0];
            //console.debug(fileUpload);
            const reader = new FileReader();
            reader.readAsDataURL(fileUpload);
            reader.onload = function () {
              doc.remove();
              const content: any = reader.result ? reader.result : "";
              // console.debug(content);
              resolve({
                success: true,
                data: {
                  name: fileUpload.name,
                  type: fileUpload.type
                    ? fileUpload.type
                    : content.split(";")[0],
                  size: fileUpload.size,
                  lastModified: fileUpload.lastModified,
                  file: content.split(",").pop(),
                },
              });
            };
            reader.onerror = function (error) {
              throw "not.load.files";
            };
          }
        };
        document.body.appendChild(inputFile);
      } catch (e: any) {
        const doc: any = document.getElementById("fileuploadkd");
        doc.remove();
        resolve({
          success: false,
          data: { error: e.toString() },
        });
      }
    });
    return from(uploadFilePromise).pipe(map((x) => x));
  }

  bin2hex(file: any) {
    let i;
    let f = 0;
    const a = [];
    file += "";
    f = file.length;
    for (i = 0; i < f; i++) {
      a[i] = file
        .charCodeAt(i)
        .toString(16)
        .replace(/^([\da-f])$/, "0$1");
    }
    return a.join("");
  }

  getBlob(file: string, mimeType?: string) {
    const byteCharacters = atob(file);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = undefined;
    if (mimeType) {
      console.debug("set mimeType to blob, ", mimeType);
      blob = new Blob(byteArrays, {
        type: mimeType,
      });
      blob = blob.slice(0, blob.size, mimeType);
    } else {
      blob = new Blob(byteArrays);
    }
    return blob;
  }

  takePhotoCamera(
    cameraDiv: any,
    cameraJs: any,
    operationParameters: any,
    resolve: any,
    id: string,
  ) {
    let takePhoto = false;
    cameraJs.on("tookphoto", (evt: { detail: { base64: string } }) => {
      console.debug(evt);
      takePhoto = true;
      console.debug(evt.detail.base64);
      if (cameraDiv && takePhoto) {
        const uuidState = uuidv4();
        console.debug(
          JSON.stringify({
            id: uuidState,
            value: JSON.stringify({
              ...operationParameters,
              id: uuidState,
              data: evt.detail.base64.replace("data:image/png;base64,", ""),
              datapng: evt.detail.base64.replace("data:image/png;base64,", ""),
            }),
          }),
        );
        const documentSave = {
          id: uuidState,
          value: JSON.stringify({
            ...operationParameters,
            id: uuidState,
            data: evt.detail.base64.replace("data:image/png;base64,", ""),
            datapng: evt.detail.base64.replace("data:image/png;base64,", ""),
          }),
        };
        console.debug(documentSave);
        console.debug("documentSave");
        this.MrroinWeb.DBServiceApi.insertDocument(documentSave).subscribe(
          (response: any) => {
            const divJsCamera: any = document.getElementById(id);
            cameraJs.close();
            divJsCamera.remove();
            resolve({
              success: true,
              data: {
                ...response,
              },
            });
          },
        ),
          catchError((error) => {
            const divJsCamera: any = document.getElementById(id);
            divJsCamera.remove();
            resolve({
              success: false,
              data: {
                error: error.toString(),
              },
            });
            return of({
              success: false,
              data: {
                error: error.toString(),
              },
            }).pipe((x: any) => {
              return x;
            });
          });
      }
    });
  }

  getGeolocalization() {
    const getGeoPromise = new Promise(function (resolve, reject) {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (data) => {
              resolve({
                success: true,
                data: {
                  accuracy: data.coords.accuracy,
                  altitude: data.coords.altitude,
                  altitudeAccuracy: data.coords.altitudeAccuracy,
                  heading: data.coords.heading,
                  latitude: data.coords.latitude,
                  longitude: data.coords.longitude,
                  speed: data.coords.speed,
                },
              });
            },
            (error) => {
              resolve({
                success: false,
                data: {
                  error: error.message,
                },
              });
            },
          );
        } else {
          resolve({
            success: false,
            data: {
              error: "Geolocation is not supported by this browser.",
            },
          });
        }
      } catch (e) {
        resolve({
          success: false,
          data: {
            error: "Geolocation is not supported by this browser.",
          },
        });
      }
    });
    return from(getGeoPromise).pipe(map((x) => x));
  }

  getLanguage() {
    const getGeoPromise = new Promise(function (resolve, reject) {
      try {
        const language = navigator.language.split(/[-_]/)[0];
        resolve({
          success: true,
          data: {
            language,
          },
        });
      } catch (e) {
        resolve({
          success: false,
          data: {
            error: "Language is not supported by this browser.",
          },
        });
      }
    });
    return from(getGeoPromise).pipe(map((x) => x));
  }

  dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString: any = window.atob(dataURI);

    // write the bytes of the string to an ArrayBuffer
    const ab: any = new ArrayBuffer(byteString.length);
    const ia: any = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const bb = new Blob([ab]);
    return bb;
  }

  unzip(dataZip: any) {
    console.debug("load zip");
    const self = this;
    let files: any = [];
    files = [];
    const unzipResponse = new Promise(function (resolve, reject) {
      try {
        if (dataZip) {
          console.debug("load zip");
          const reader = new unzip.ZipReader(new unzip.BlobReader(dataZip));
          // get all entries from the zip
          reader.getEntries().then((entries: any) => {
            if (entries.length) {
              let countEntries = 0;
              entries.map(function (entry: any) {
                const value = entry.filename;
                // console.debug(value);
                entry
                  .getData(new unzip.TextWriter(), {
                    onprogress: (index: any, max: any) => {
                      // console.debug(index, max);
                    },
                  })
                  .then((text: any) => {
                    console.debug(value, text);
                    files.push(text);
                    countEntries++;
                    if (countEntries === entries.length) {
                      resolve({
                        success: true,
                        data: files,
                      });
                    }
                  })
                  .catch(() => {
                    countEntries++;
                    if (countEntries === entries.length) {
                      resolve({
                        success: true,
                        data: files,
                      });
                    }
                  });
              });
              reader.close();
              console.debug(entries.length);
            }
          });
        } else {
          console.debug("zip is empty");
          resolve({
            success: false,
            data: { error: "zip.empty" },
          });
        }
      } catch (err: any) {
        console.error(err);
        resolve({ success: false, data: { error: err.toString() } });
      }
    });
    return from(unzipResponse).pipe(map((x) => x));
  }

  zip(dataZip: string, fileName: string) {
    console.debug("create zip");
    const unzipResponse = new Promise(function (resolve, reject) {
      try {
        if (dataZip) {
          const zipFileWriter = new unzip.BlobWriter();
          const dataZipReader = new unzip.TextReader(dataZip);
          const zipWriter = new unzip.ZipWriter(zipFileWriter);
          zipWriter
            .add(fileName, dataZipReader)
            .then(() => {
              zipWriter
                .close()
                .then(() => {
                  const zipFileBlob = zipFileWriter.getData();
                  // const reader = new FileReader();
                  // reader.readAsDataURL(zipFileBlob);
                  // reader.onloadend = function () {
                  //   const base64data = reader.result;
                  //   console.log(base64data);
                  // };
                  resolve({
                    success: true,
                    data: zipFileBlob,
                  });
                })
                .catch((e: any) => {
                  resolve({
                    success: true,
                    data: { error: e.toString() },
                  });
                });
            })
            .catch((e: any) => {
              resolve({
                success: true,
                data: { error: e.toString() },
              });
            });
        } else {
          console.debug("zip is empty");
          resolve({
            success: false,
            data: { error: "zip.create.empty" },
          });
        }
      } catch (err: any) {
        console.error(err);
        resolve({ success: false, data: { error: err.toString() } });
      }
    });
    return from(unzipResponse).pipe(map((x) => x));
  }
}
