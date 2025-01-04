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
  hashedValue: string;
  signedValue: string;
  signMethod: string;
  sealID: string;
  sealName: string;
  sealType: string;
  sealAuthTime: string;
  sealMakeTime: string;
  sealVersion: string;
  version: string;
}
export interface ISeal {
  div_seal: HTMLElement;
  ofdSignatureInfo: IOfdSignatureInfo;
}

export class ClassOfd {
  screenWidth: number;
  ofdDocument: IOfdDocument | null = null;
  ofdMainDiv: HTMLDivElement;
  ofdContentDiv: HTMLDivElement;
  divs: HTMLDivElement[] = [];
  pageIndex: number = 1;
  scale = 0; //缩放比例
  seals: ISeal[] = []; // 签章信息
  constructor(
    _ofdMainDiv: HTMLDivElement,
    _ofdContentDiv: HTMLDivElement,
    _screenWidth: number
  ) {
    this.ofdMainDiv = _ofdMainDiv;
    this.ofdContentDiv = _ofdContentDiv;
    this.screenWidth = _screenWidth;
  }
  /**
   * 下载并解析ofd
   * @param ofd ofd文件
   * @returns
   */
  parse(ofd: string | File) {
    return new Promise<void>((resolve, reject) => {
      console.log("开始解析ofd文件...");
      parseOfdDocument({
        ofd,
        success: (res: IOfdDocument[]) => {
          console.log("解析成功", res);
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
    this.divs = renderOfd(this.screenWidth, this.ofdDocument);
  }
  /**
   * 显示ofdDiv
   */
  displayOfdDiv() {
    return new Promise<void>((resolve) => {
      this.scale = getPageScale();
      this.ofdContentDiv.innerHTML = "";
      this.seals = [];
      requestAnimationFrame(() => {
        for (const div of this.divs) {
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
    if (SES_Signature.realVersion < 4) {
      return {
        div_seal: div,
        ofdSignatureInfo: {
          signer: SES_Signature.toSign.cert["commonName"].str,
          provider: signedInfo.Provider["@_ProviderName"],
          hashedValue: SES_Signature.toSign.dataHash.replace(/\n/g, ""),
          signedValue: SES_Signature.signature.replace(/\n/g, ""),
          signMethod: SES_Signature.toSign.signatureAlgorithm.replace(
            /\n/g,
            ""
          ),
          sealID: SES_Signature.toSign.eseal.esealInfo.esID.str,
          sealName: SES_Signature.toSign.eseal.esealInfo.property.name.str,
          sealType: SES_Signature.toSign.eseal.esealInfo.property.type,
          sealAuthTime:
            "从 " +
            SES_Signature.toSign.eseal.esealInfo.property.validStart +
            " 到 " +
            SES_Signature.toSign.eseal.esealInfo.property.validEnd,
          sealMakeTime:
            SES_Signature.toSign.eseal.esealInfo.property.createDate,
          sealVersion: SES_Signature.toSign.eseal.esealInfo.header.version,
          version: SES_Signature.toSign.version,
        },
      };
    } else {
      return {
        div_seal: div,
        ofdSignatureInfo: {
          signer: SES_Signature.cert["commonName"].str,
          provider: signedInfo.Provider["@_ProviderName"],
          hashedValue: SES_Signature.toSign.dataHash.replace(/\n/g, ""),
          signedValue: SES_Signature.signature.replace(/\n/g, ""),
          signMethod: SES_Signature.signatureAlgID.replace(/\n/g, ""),
          sealID: SES_Signature.toSign.eseal.esealInfo.esID.str,
          sealName: SES_Signature.toSign.eseal.esealInfo.property.name.str,
          sealType: SES_Signature.toSign.eseal.esealInfo.property.type,
          sealAuthTime:
            "从 " +
            SES_Signature.toSign.eseal.esealInfo.property.validStart +
            " 到 " +
            SES_Signature.toSign.eseal.esealInfo.property.validEnd,
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
    //  const pageScrollCount = Math.abs(this.pageIndex - _pageIndex)
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
    console.log("放大", this.scale);
    if (this.scale < 10) {
      const _scale = Math.round(this.scale);
      this.scale = _scale <= this.scale ? _scale + 0.5 : _scale;
      setPageScale(this.scale);
      this.divs = renderOfdByScale(this.ofdDocument);
      this.displayOfdDiv();
    }
  }
  //缩小
  zoomOut() {}

  /**
   * 获取ofd页面数量
   */
  get pageCount() {
    return this.ofdDocument?.pages.length || 0;
  }
}
