<template>
  <div class="ofd-view" ref="refOfdViewDiv">
    <div class="ofd-toolbar">
      <OfdViewToolbarPage
        :pageIndex="pageIndex"
        :pageCount="pageCount"
        @firstPage="firstPage"
        @prePage="prePage"
        @handlePageInputChange="handlePageInputChange"
        @nextPage="nextPage"
        @lastPage="lastPage"
      >
        <label v-if="showOpenFileButton">
          <i
            class="iconfont icon-open ofd-open-file-btn"
            title="打开.ofd文件"
          />
          <input
            style="display: none"
            type="file"
            accept=".ofd"
            @change="handleFileChange"
          />
        </label>
      </OfdViewToolbarPage>
      <OfdViewToolbarZoom
        :pageCount="pageCount"
        @zoomOut="zoomOut"
        @zoomIn="zoomIn"
        @setScale="setScale"
      />
      <OfdViewToolbarBtn
        :pageCount="pageCount"
        @toggleFullScreen="onToggleFullScreen"
        @printOfd="onPrintOfd"
        @downOfd="onDownOfd"
        @showCertList="onShowCertList"
      />
    </div>
    <div class="ofd-Main" ref="refOfdMainDiv">
      <div class="ofd-Container" ref="refOfdContentDiv"></div>
    </div>
    <FullScreenLoading :visible="loadingVisible" text="正在加载，请稍候..." />
    <MyDialog v-model:modelValue="showSealInfoDialog">
      <template #header>
        <h3>签章信息<span class="ofd-signature-info-valid">有效</span></h3>
      </template>
      <div class="ofd-signature-info" v-if="currentSealInfo">
        <div>
          <span>签章人:</span><span>{{ currentSealInfo.signer }}</span>
        </div>
        <div>
          <span>签章日期:</span><span>{{ currentSealInfo.signDate }}</span>
        </div>
        <div>
          <span>版本号:</span><span>{{ currentSealInfo.version }}</span>
        </div>
        <div>
          <span>印章标识:</span><span>{{ currentSealInfo.sealID }}</span>
        </div>
        <div>
          <span>印章名称:</span><span>{{ currentSealInfo.sealName }}</span>
        </div>
        <div>
          <span>印章类型:</span><span>{{ currentSealInfo.sealType }}</span>
        </div>
        <div>
          <span>有效时间:</span
          ><span
            >从{{ utcToLocal(currentSealInfo.sealValidStart) }}至{{
              utcToLocal(currentSealInfo.sealValidEnd)
            }}</span
          >
        </div>
        <div>
          <span>印章版本:</span><span>{{ currentSealInfo.sealVersion }}</span>
        </div>
      </div>
    </MyDialog>
    <MyDialog v-model:modelValue="showCertListDialog">
      <template #header>
        <h3>
          签章数量:<span class="ofd-signature-info-valid">{{
            ofdObj?.seals.length || 0
          }}</span>
        </h3>
      </template>
      <div class="ofd-signature-list" v-if="ofdObj">
        <div v-for="(seal, index) of ofdObj.seals" :key="'seal' + index">
          <div>{{ seal.ofdSignatureInfo.signer }}</div>
          <div>第{{ seal.pageNumber }}页</div>
        </div>
      </div>
    </MyDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watchEffect, computed } from "vue";
import { ClassOfd, type IOfdSignatureInfo } from "../../api/typeOfd";
import {
  debounce,
  utcToLocal,
  toggleFullScreen,
  printOfd,
} from "../../utils/myfunc";

import OfdViewToolbarPage from "./OfdViewToolbarPage.vue";
import OfdViewToolbarZoom from "./OfdViewToolbarZoom.vue";
import OfdViewToolbarBtn from "./OfdViewToolbarBtn.vue";
import FullScreenLoading from "./FullScreenLoading.vue";
import MyDialog from "./MyDialog.vue";

const props = withDefaults(
  defineProps<{
    showOpenFileButton?: boolean;
    ofdLink?: string;
    sealClick?: (sealInfo: IOfdSignatureInfo) => void;
  }>(),
  {
    showOpenFileButton: true,
  }
);

const loadingVisible = ref(false);
const showSealInfoDialog = ref(false);
const currentSealInfo = ref<IOfdSignatureInfo>();

const onSealClick = (sealInfo: IOfdSignatureInfo) => {
  console.log("onSealClick", sealInfo);
  if (props.sealClick) props.sealClick(sealInfo);
  else {
    currentSealInfo.value = sealInfo;
    showSealInfoDialog.value = true;
  }
};

const domWidth = ref<number | null>(null);
const screenWidth = ref(document.body.clientWidth);
const refOfdViewDiv = ref<HTMLDivElement>();

onMounted(() => {
  //设置自适应宽度
  if (refOfdViewDiv.value)
    domWidth.value = refOfdViewDiv.value.clientWidth - 50;
});

let ofdPageDivsShow = new Map<number, boolean>();

const ob = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const page_number = parseInt(
      entry.target.getAttribute("data-page-number") as string
    );
    ofdPageDivsShow.set(page_number, entry.isIntersecting);
    setTimeout(() => {
      let find_pageIndex: number | null = null;
      ofdPageDivsShow.forEach((value, key) => {
        if (value && find_pageIndex === null) {
          find_pageIndex = key;
        }
      });
      if (
        find_pageIndex !== null &&
        ofdObj.value &&
        find_pageIndex !== pageIndex.value
      ) {
        ofdObj.value.pageIndex = find_pageIndex;
      }
    }, 500);
  }
});

const ofd = ref<string | File>();
const ofdObj = ref<ClassOfd>();
watchEffect(() => {
  console.log("ofd.watchEffect", props.ofdLink);
  if (props.ofdLink) {
    ofd.value = props.ofdLink;
    //  viewOfd()
    Promise.resolve().then(() => {
      OfdLoad();
    });
  }
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    ofd.value = target.files[0];
    //viewOfd()
    OfdLoad();
  }
};

const refOfdMainDiv = ref<HTMLDivElement>();
const refOfdContentDiv = ref<HTMLDivElement>();
const pageCount = ref(0);
const pageIndex = computed(() => {
  return ofdObj.value?.pageIndex ?? 1;
});

const OfdLoad = async () => {
  if (ofd.value && refOfdMainDiv.value && refOfdContentDiv.value) {
    loadingVisible.value = true;
    ofdObj.value = new ClassOfd(
      refOfdMainDiv.value,
      refOfdContentDiv.value,
      domWidth.value as number,
      screenWidth.value as number,
      ob,
      onSealClick
    );
    await ofdObj.value.parse(ofd.value);
    pageCount.value = ofdObj.value.pageCount;
    ofdObj.value.getDivs();
    const contentDiv = refOfdContentDiv.value;
    if (contentDiv) {
      ofdPageDivsShow = new Map<number, boolean>();
      ofdObj.value.displayOfdDiv().finally(() => {
        loadingVisible.value = false;
      });
    } else loadingVisible.value = false;
  }
};

const handlePageInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  ofdObj.value?.gotoPage(parseInt(target.value));
};

// 第一页
const firstPage = () => {
  ofdObj.value?.firstPage();
};

const prePage = () => {
  ofdObj.value?.prePage();
};

const nextPage = () => {
  ofdObj.value?.nextPage();
};

const lastPage = () => {
  ofdObj.value?.lastPage();
};

const zoomOutAction = () => {
  if (ofdObj.value) {
    ofdObj.value.zoomOut().then(() => {
      loadingVisible.value = false;
    });
  } else loadingVisible.value = false;
};
const debounce_zoomOut = debounce(zoomOutAction, ofdObj, 500);
const zoomOut = () => {
  loadingVisible.value = true;
  debounce_zoomOut();
};

const zoomInAction = () => {
  if (ofdObj.value)
    ofdObj.value.zoomIn().then(() => {
      loadingVisible.value = false;
    });
  else loadingVisible.value = false;
};
const debounce_zoomIn = debounce(zoomInAction, ofdObj, 500);
const zoomIn = () => {
  loadingVisible.value = true;
  debounce_zoomIn();
};

const setScale = (scale: number) => {
  loadingVisible.value = true;
  requestAnimationFrame(() => {
    if (ofdObj.value) {
      ofdObj.value.setScale(scale).finally(() => {
        loadingVisible.value = false;
      });
    }
  });
};

const onToggleFullScreen = () => {
  if (refOfdViewDiv.value) toggleFullScreen(refOfdViewDiv.value);
};

const onPrintOfd = () => {
  if (refOfdContentDiv.value) printOfd(refOfdContentDiv.value);
};

const onDownOfd = () => {
  if (ofd.value && typeof ofd.value === "string") {
    const a = document.createElement("a");
    a.href = ofd.value;
    a.download = "my.ofd";
    a.click();
  } else if (ofd.value && typeof ofd.value === "object") {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(ofd.value);
    a.download = "my.ofd";
    a.click();
    URL.revokeObjectURL(a.href);
  }
};

const showCertListDialog = ref(false);
const onShowCertList = () => {
  showCertListDialog.value = true;
};
</script>

<style scoped>
.ofd-view {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
}

.ofd-view .ofd-toolbar {
  position: absolute;
  top: 0;
  width: 100%;
  height: 40px;
  display: flex;
  line-height: 40px;
  background-color: #f7f7f7;
  align-items: center;
  justify-content: space-between;
}

.ofd-view .ofd-Main {
  margin: 40px 0 0 0;
  height: calc(100% - 40px);
  overflow: scroll;
  background: #ededf0;
  position: relative;
  z-index: 100;
}

.ofd-view .ofd-Main .ofd-Container {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ededf0;
  overflow: hidden;
}
.ofd-open-file-btn {
  cursor: pointer;
}
.ofd-signature-info div span:first-child {
  width: 100px;
  display: inline-block;
}
.ofd-signature-info-valid {
  color: green;
  margin-left: 5px;
}
.ofd-signature-list {
  max-height: 50vh;
  overflow: scroll;
}

.ofd-signature-list > div {
  display: flex;
  justify-content: space-between;
  padding-right: 30px;
}
.ofd-signature-list > div > div:last-child {
  width: 100px;
  text-align: center;
}
</style>
<style>
.ofd-view .ofd-Main .ofd-Container div[name="seal_img_div"]:hover {
  border: 2px dashed rgb(173, 173, 173, 173);
  opacity: 0.7;
}
.ofd-view .ofd-Main .ofd-Container div[name="seal_img_div"]::after {
  content: seal;
}
</style>
