import {
  parseOfdDocument,
  renderOfd,
  renderOfdByScale,
  setPageScale,
  getPageScale,
} from "../OfdViewUtil/index";

export interface IOfdDocument {
  //doc: string // "Doc_0";
  //document: any
  pages: IOfdPage[];
  // tpls: any
  // stampAnnot: any
  // fontResObj: any
  // drawParamResObj: any
  // multiMediaResObj: any
  // compositeGraphicUnits: any[]
}
interface IOfdPageContent {
  xml: string;
}
interface IOfdPage {
  [propName: number]: IOfdPageContent;
}

export interface IOfdSignatureInfo {
  signer: string;
  provider: string;
  //签章日期
  signDate: string;
  hashedValue: string;
  signedValue: string;
  signMethod: string;
  sealID: string;
  sealName: string;
  sealType: string;
  sealValidStart: string;
  sealValidEnd: string;
  sealMakeTime: string;
  sealVersion: string;
  version: string;
}
export interface ISeal {
  div_seal: HTMLElement;
  ofdSignatureInfo: IOfdSignatureInfo;
  pageNumber: number;
}

export class ClassOfd {
  domWidth: number;
  screenWidth: number;
  ofdDocument: IOfdDocument | null = null;
  ofdMainDiv: HTMLDivElement;
  ofdContentDiv: HTMLDivElement;
  divs: HTMLDivElement[] = [];
  pageIndex: number = 1;
  scale = 0; //缩放比例
  seals: ISeal[] = []; // 签章信息
  ob: IntersectionObserver;
  sealClick: (sealInfo: IOfdSignatureInfo) => void;
  constructor(
    _ofdMainDiv: HTMLDivElement,
    _ofdContentDiv: HTMLDivElement,
    _domWidth: number,
    _screenWidth: number,
    _ob: IntersectionObserver,
    _sealClick: (sealInfo: IOfdSignatureInfo) => void
  ) {
    this.ofdMainDiv = _ofdMainDiv;
    this.ofdContentDiv = _ofdContentDiv;
    this.domWidth = _domWidth;
    this.screenWidth = _screenWidth;
    this.ob = _ob;
    this.sealClick = _sealClick;
  }
  /**
   * 下载并解析ofd
   * @param ofd ofd文件
   * @returns
   */
  parse(ofd: string | File) {
    return new Promise<void>((resolve, reject) => {
      console.time("解析ofd文件");
      parseOfdDocument({
        ofd,
        success: (res: IOfdDocument[]) => {
          console.timeEnd("解析ofd文件");
          this.ofdDocument = res[0];
          this.pageIndex = 1;
          // showOfdPages(res[0] as unknown as IOfdDocument, domWidth.value as number)
          resolve();
        },
        fail: (error: string) => {
          console.error("解析失败", error);
          reject(error);
        },
      });
    });
  }
  /**
   * 将ofdDocument渲染成divs
   */
  getDivs() {
    this.divs = renderOfd(this.domWidth, this.ofdDocument);
  }
  /**
   * 显示ofdDiv
   */
  displayOfdDiv() {
    return new Promise<void>((resolve) => {
      this.scale = getPageScale();
      this.ofdContentDiv.innerHTML = "";
      this.seals = [];
      let maxWidth = 0;
      requestAnimationFrame(() => {
        for (const div of this.divs) {
          //计数每页div的最大宽度
          const divWidth = parseInt(
            div.style.width.substring(0, div.style.width.length - 2)
          );
          maxWidth = divWidth > maxWidth ? divWidth : maxWidth;
          this.ofdContentDiv.appendChild(div);
        }
        for (let ele of document.getElementsByName("seal_img_div")) {
          const sesSignature = ele.dataset.sesSignature;
          const signedInfo = ele.dataset.signedInfo;
          if (sesSignature && signedInfo) {
            this.seals.push(
              this.addEventOnSealDiv(
                ele,
                JSON.parse(sesSignature),
                JSON.parse(signedInfo)
              )
            );
          }
        }

        //留边，左右各 15
        maxWidth += 30;
        //如果容器小于每页宽度，就设置容器值
        //容器的宽度，可以和每页宽度比较
        const ofd_main_width: any = this.ofdMainDiv.clientWidth;
        if (ofd_main_width < maxWidth)
          this.ofdContentDiv.style.width = maxWidth + "px";
        else this.ofdContentDiv.style.width = "";

        //计算页码
        for (const div of this.divs) {
          this.ob.observe(div);
        }
        //点击印章
        for (const seal of this.seals) {
          seal.div_seal.addEventListener("click", () => {
            const sealInfo: IOfdSignatureInfo = { ...seal.ofdSignatureInfo };
            //if (this.sealClick)
            this.sealClick(sealInfo);
            //else
            /* alert(
                `证书信息\n` +
                  `签章人:${sealInfo.signer}\n` +
                  `签章提供者:${sealInfo.provider}\n` +
                  `原文摘要值:${sealInfo.hashedValue}\n` +
                  `签名值:${sealInfo.signedValue}\n` +
                  `签名算法:${sealInfo.signMethod}\n` +
                  `版本号:${sealInfo.version}\n` +
                  `印章标识:${sealInfo.sealID}\n` +
                  `印章名称:${sealInfo.sealName}\n` +
                  `印章类型:${sealInfo.sealType}\n` +
                  `有效时间:${sealInfo.sealAuthTime}\n` +
                  `制章日期:${sealInfo.sealMakeTime}\n` +
                  `印章版本:${sealInfo.sealVersion}\n`
              );*/
          });
        }
        resolve();
      });
    });
  }

  // 签章添加点击事件
  addEventOnSealDiv(
    div: HTMLElement,
    SES_Signature: any,
    signedInfo: any
  ): ISeal {
    const pageNumber = parseInt(
      div.parentElement?.getAttribute("data-page-number") as string
    );
    if (SES_Signature.realVersion < 4) {
      return {
        pageNumber,
        div_seal: div,
        ofdSignatureInfo: {
          signer: SES_Signature.toSign.cert["commonName"].str,
          provider: signedInfo.Provider["@_ProviderName"],
          signDate: signedInfo["SignatureDateTime"],
          hashedValue: SES_Signature.toSign.dataHash.replace(/\n/g, ""),
          signedValue: SES_Signature.signature.replace(/\n/g, ""),
          signMethod: SES_Signature.toSign.signatureAlgorithm.replace(
            /\n/g,
            ""
          ),
          sealID: SES_Signature.toSign.eseal.esealInfo.esID.str,
          sealName: SES_Signature.toSign.eseal.esealInfo.property.name.str,
          sealType: SES_Signature.toSign.eseal.esealInfo.property.type,
          sealValidStart:
            SES_Signature.toSign.eseal.esealInfo.property.validStart,
          sealValidEnd: SES_Signature.toSign.eseal.esealInfo.property.validEnd,
          sealMakeTime:
            SES_Signature.toSign.eseal.esealInfo.property.createDate,
          sealVersion: SES_Signature.toSign.eseal.esealInfo.header.version,
          version: SES_Signature.toSign.version,
        },
      };
    } else {
      return {
        pageNumber,
        div_seal: div,
        ofdSignatureInfo: {
          signer: SES_Signature.cert["commonName"].str,
          provider: signedInfo.Provider["@_ProviderName"],
          signDate: signedInfo["SignatureDateTime"],
          hashedValue: SES_Signature.toSign.dataHash.replace(/\n/g, ""),
          signedValue: SES_Signature.signature.replace(/\n/g, ""),
          signMethod: SES_Signature.signatureAlgID.replace(/\n/g, ""),
          sealID: SES_Signature.toSign.eseal.esealInfo.esID.str,
          sealName: SES_Signature.toSign.eseal.esealInfo.property.name.str,
          sealType: SES_Signature.toSign.eseal.esealInfo.property.type,
          sealValidStart:
            SES_Signature.toSign.eseal.esealInfo.property.validStart,
          sealValidEnd: SES_Signature.toSign.eseal.esealInfo.property.validEnd,
          sealMakeTime:
            SES_Signature.toSign.eseal.esealInfo.property.createDate,
          sealVersion: SES_Signature.toSign.eseal.esealInfo.header.version,

          version: SES_Signature.toSign.version,
        },
      };
    }
    /* (global as any).HashRet = null;
    (global as any).VerifyRet = signedInfo.VerifyRet;
    div.addEventListener("click", () => {
      if (SES_Signature.realVersion < 4) {
        this.signatureInfo.signer = SES_Signature.toSign.cert["commonName"].str;
        this.signatureInfo.provider = signedInfo.Provider["@_ProviderName"];
        this.signatureInfo.hashedValue = SES_Signature.toSign.dataHash.replace(
          /\n/g,
          ""
        );
        this.signatureInfo.signedValue = SES_Signature.signature.replace(
          /\n/g,
          ""
        );
        this.signatureInfo.signMethod =
          SES_Signature.toSign.signatureAlgorithm.replace(/\n/g, "");
        this.signatureInfo.sealID =
          SES_Signature.toSign.eseal.esealInfo.esID.str;
        this.signatureInfo.sealName =
          SES_Signature.toSign.eseal.esealInfo.property.name.str;
        this.signatureInfo.sealType =
          SES_Signature.toSign.eseal.esealInfo.property.type;
        this.signatureInfo.sealAuthTime =
          "从 " +
          SES_Signature.toSign.eseal.esealInfo.property.validStart +
          " 到 " +
          SES_Signature.toSign.eseal.esealInfo.property.validEnd;
        this.signatureInfo.sealMakeTime =
          SES_Signature.toSign.eseal.esealInfo.property.createDate;
        this.signatureInfo.sealVersion =
          SES_Signature.toSign.eseal.esealInfo.header.version;
      } else {
        this.signatureInfo.signer = SES_Signature.cert["commonName"].str;
        this.signatureInfo.provider = signedInfo.Provider["@_ProviderName"];
        this.signatureInfo.hashedValue = SES_Signature.toSign.dataHash.replace(
          /\n/g,
          ""
        );
        this.signatureInfo.signedValue = SES_Signature.signature.replace(
          /\n/g,
          ""
        );
        this.signatureInfo.signMethod = SES_Signature.signatureAlgID.replace(
          /\n/g,
          ""
        );
        this.signatureInfo.sealID =
          SES_Signature.toSign.eseal.esealInfo.esID.str;
        this.signatureInfo.sealName =
          SES_Signature.toSign.eseal.esealInfo.property.name.str;
        this.signatureInfo.sealType =
          SES_Signature.toSign.eseal.esealInfo.property.type;
        this.signatureInfo.sealAuthTime =
          "从 " +
          SES_Signature.toSign.eseal.esealInfo.property.validStart +
          " 到 " +
          SES_Signature.toSign.eseal.esealInfo.property.validEnd;
        this.signatureInfo.sealMakeTime =
          SES_Signature.toSign.eseal.esealInfo.property.createDate;
        this.signatureInfo.sealVersion =
          SES_Signature.toSign.eseal.esealInfo.header.version;
      }
      this.signatureInfo.version = SES_Signature.toSign.version;
      this.dialogVisible = true;
    });*/
  }
  /**
   * 第一页
   */
  firstPage() {
    this.gotoPage(1);
  }
  /**
   * 上一页
   */
  prePage() {
    this.gotoPage(this.pageIndex - 1);
  }

  // 下一页
  nextPage() {
    this.gotoPage(this.pageIndex + 1);
  }

  // 最后一页
  lastPage() {
    this.gotoPage(this.pageCount);
  }
  //跳转到指定页
  gotoPage(_pageIndex: number) {
    this.pageIndex =
      _pageIndex < 1
        ? 1
        : _pageIndex > this.pageCount
        ? this.pageCount
        : _pageIndex;
    const ele = this.ofdContentDiv.children[this.pageIndex - 1];
    ele?.scrollIntoView({ behavior: "instant" });
  }
  //放大
  zoomIn() {
    return new Promise<void>((resolve) => {
      if (this.scale < 10) {
        const _pgIndex = this.pageIndex;
        const _scale = Math.round(this.scale);
        this.scale = _scale <= this.scale ? _scale + 0.5 : _scale;
        setPageScale(this.scale);
        this.divs = renderOfdByScale(this.ofdDocument);
        this.displayOfdDiv().then(() => {
          this.gotoPage(_pgIndex);
          resolve();
        });
      } else {
        console.warn("已经是最大缩放比例了(<10)", this.scale);
        resolve();
      }
    });
  }
  //缩小
  zoomOut() {
    return new Promise<void>((resolve) => {
      if (this.scale > 1) {
        const _pgIndex = this.pageIndex;
        const _scale = Math.floor(this.scale);
        this.scale = _scale >= this.scale ? _scale - 0.5 : _scale;
        setPageScale(this.scale);
        this.divs = renderOfdByScale(this.ofdDocument);
        this.displayOfdDiv().then(() => {
          this.gotoPage(_pgIndex);
          resolve();
        });
      } else {
        console.warn("已经是最小缩放比例了(>1)", this.scale);
        resolve();
      }
    });
  }
  // 修改缩放比例
  setScale(scale: number) {
    return new Promise<void>((resolve) => {
      const _pgIndex = this.pageIndex;
      if (scale === 0) {
        this.divs = renderOfd(this.domWidth, this.ofdDocument);
      } else if (scale === 0.5) {
        this.divs = renderOfd(this.screenWidth, this.ofdDocument);
      } else {
        this.scale = scale;
        setPageScale(scale);
        this.divs = renderOfdByScale(this.ofdDocument);
      }
      this.displayOfdDiv().then(() => {
        this.gotoPage(_pgIndex);
        resolve();
      });
    });
  }
  /**
   * 获取ofd页面数量
   */
  get pageCount() {
    return this.ofdDocument?.pages.length || 0;
  }
}
