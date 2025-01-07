/*
 * ofd.js - A Javascript class for reading and rendering ofd files
 * <https://github.com/DLTech21/ofd.js>
 *
 * Copyright (c) 2020. DLTech21 All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
/**依赖: **注意版本！不要升级版本!**
 "@lapo/asn1js": "^1.2.1",
 "jszip": "^3.7.0",
 "jszip-utils": "^0.1.0",
 "ofd-xml-parser": "^0.0.2",
 "js-md5": "^0.7.3",
 "js-sha1": "^0.6.0",
 "jsrsasign": "^10.3.0",
 "sm-crypto": "^0.3.2",
 "web-streams-polyfill": "^3.1.0",
 "x2js": "^3.4.0",
 */
import { calPageBox, calPageBoxScale, renderPage } from "./ofd/ofd_render";
import { pipeline } from "./ofd/pipeline";
import { getDocRoots, parseSingleDoc, unzipOfd } from "./ofd/ofd_parser";
import { digestCheckProcess } from "./ofd/ses_signature_parser";
import { getPageScal, setPageScal } from "./ofd/ofd_util";
import * as JSZipUtils from "jszip-utils";

export const parseOfdDocument = function (options) {
  if (options.ofd instanceof File || options.ofd instanceof ArrayBuffer) {
    doParseOFD(options);
  } else {
    JSZipUtils.getBinaryContent(options.ofd, function (err, data) {
      if (err) {
        if (options.fail) {
          options.fail(err);
        }
      } else {
        options.ofd = data;
        doParseOFD(options);
      }
    });
  }
};

const doParseOFD = function (options) {
  const start = new Date();
  console.log("doParseOfd.begin", options);
  global.xmlParseFlag = 0;
  pipeline
    .call(
      this,
      async () => await unzipOfd(options.ofd),
      getDocRoots,
      parseSingleDoc
    )
    .then((res) => {
      console.log(
        "doParseOfd.then",
        res,
        new Date().getTime() - start.getTime()
      );
      if (options.success) {
        options.success(res);
      }
    })
    .catch((res) => {
      console.log(res);
      if (options.fail) {
        options.fail(res);
      }
    });
};

export const renderOfd = function (screenWidth, ofd) {
  const divArray = [];
  if (!ofd) {
    return divArray;
  }
  let i = 1; //第一页
  for (const page of ofd.pages) {
    const box = calPageBox(screenWidth, ofd.document, page);
    const pageId = Object.keys(page)[0];
    const pageDiv = document.createElement("div");

    pageDiv.id = pageId;
    pageDiv.setAttribute(
      "style",
      `margin-bottom: 10px;position: relative;width:${box.w}px;height:${box.h}px;background: white;`
    );
    //====添加页码和class
    pageDiv.setAttribute("class", "ofd-page");
    pageDiv.setAttribute("data-page-number", i++);
    //=======
    renderPage(
      pageDiv,
      page,
      ofd.tpls,
      ofd.fontResObj,
      ofd.drawParamResObj,
      ofd.multiMediaResObj,
      ofd.compositeGraphicUnits
    );
    divArray.push(pageDiv);
  }
  return divArray;
};

export const renderOfdByScale = function (ofd) {
  const divArray = [];
  if (!ofd) {
    return divArray;
  }
  let i = 1; //第一页
  for (const page of ofd.pages) {
    const box = calPageBoxScale(ofd.document, page);
    const pageId = Object.keys(page)[0];
    const pageDiv = document.createElement("div");
    pageDiv.id = pageId;
    pageDiv.setAttribute(
      "style",
      `margin-bottom: 10px;position: relative;width:${box.w}px;height:${box.h}px;background: white;`
    );
    //====添加页码和class
    pageDiv.setAttribute("class", "ofd-page");
    pageDiv.setAttribute("data-page-number", i++);
    //=======
    renderPage(
      pageDiv,
      page,
      ofd.tpls,
      ofd.fontResObj,
      ofd.drawParamResObj,
      ofd.multiMediaResObj,
      ofd.compositeGraphicUnits
    );
    divArray.push(pageDiv);
  }
  return divArray;
};

export const digestCheck = function (options) {
  // pipeline.call(this, async () => await digestCheckProcess(options.arr))
  //     .then(res => {
  //         if (options.success) {
  //             options.success(res);
  //         }
  //     });
  return digestCheckProcess(options);
};

export const setPageScale = function (scale) {
  console.log("setPageScale", scale);
  setPageScal(scale);
};

export const getPageScale = function () {
  return getPageScal();
};

export const convertDataURIToBinary = function (dataURI) {
  var raw = window.atob(dataURI);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for (var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
};
