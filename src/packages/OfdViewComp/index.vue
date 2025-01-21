<template>
  <div class="ofd-view" ref="refOfdViewDiv">
    <div class="ofd-toolbar">
      <div class="ofd-view-toolbar-icon">
        <label>
          <i class="iconfont icon-open" />
          <input
            style="display: none"
            type="file"
            accept=".ofd"
            @change="handleFileChange"
          />
        </label>
      </div>
      <OfdViewToolbarPage
        :pageIndex="pageIndex"
        :pageCount="pageCount"
        @firstPage="firstPage"
        @prePage="prePage"
        @handlePageInputChange="handlePageInputChange"
        @nextPage="nextPage"
        @lastPage="lastPage"
      />
      <OfdViewToolbarZoom
        :pageCount="pageCount"
      @zoomOut="zoomOut" @zoomIn="zoomIn" />

    </div>
    <div class="ofd-Main" ref="refOfdMainDiv">
      <div class="ofd-Container" ref="refOfdContentDiv"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watchEffect, computed } from "vue";
import { ClassOfd } from "../../api/typeOfd";
import { debounce } from "../../utils/myfunc";

import OfdViewToolbarPage from "./OfdViewToolbarPage.vue";
import OfdViewToolbarZoom from "./OfdViewToolbarZoom.vue";

const props = withDefaults(
  defineProps<{
    showOpenFileButton?: boolean;
    ofdLink?: string;
    sealClick?: Function;
  }>(),
  { showOpenFileButton: true }
);

const domWidth = ref<number | null>(null);
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
  if (props.ofdLink) {
    ofd.value = props.ofdLink;
    //  viewOfd()
    OfdLoad();
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
    ofdObj.value = new ClassOfd(
      refOfdMainDiv.value,
      refOfdContentDiv.value,
      domWidth.value as number,
      ob,
      props.sealClick
    );
    await ofdObj.value.parse(ofd.value);
    pageCount.value = ofdObj.value.pageCount;
    ofdObj.value.getDivs();
    const contentDiv = refOfdContentDiv.value;
    if (contentDiv) {
      ofdPageDivsShow = new Map<number, boolean>();
      ofdObj.value.displayOfdDiv();
    }
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
  if (ofdObj.value) ofdObj.value.zoomOut();
};
const debounce_zoomOut = debounce(zoomOutAction, ofdObj, 500);
const zoomOut = () => {
  debounce_zoomOut();
};

const zoomInAction = () => {
  if (ofdObj.value) ofdObj.value.zoomIn();
};
const debounce_zoomIn = debounce(zoomInAction, ofdObj, 500);
const zoomIn = () => {
  debounce_zoomIn();
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
}

.ofd-view .ofd-Main {
  margin: 40px 0 0 0;
  height: calc(100% - 40px);
  overflow: scroll;
  background: #ededf0;
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
</style>
<style>
.ofd-view .ofd-Main .ofd-Container div[name="seal_img_div"]:hover {
  border: 2px dashed rgb(173, 173, 173, 173);
}
.ofd-view .ofd-Main .ofd-Container div[name="seal_img_div"]::after {
  content: seal;
}
</style>
