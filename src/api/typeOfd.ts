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

export class ClassOfd {
  screenWidth: number;
  ofdDocument: IOfdDocument | null = null;
  ofdMainDiv: HTMLDivElement;
  ofdContentDiv: HTMLDivElement;
  divs: HTMLDivElement[] = [];
  pageIndex: number = 1;
  scale = 0; //缩放比例
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
      requestAnimationFrame(() => {
        for (const div of this.divs) {
          this.ofdContentDiv.appendChild(div);
        }
        resolve();
      });
    });
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
