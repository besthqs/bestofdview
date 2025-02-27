<template>
  <div class="tool-bar">
    <div
      class="ofd-view-toolbar-icon"
      :title="isFullScreen ? '退出全屏' : '全屏'"
      @click="$emit('toggleFullScreen')"
    >
      <i
        class="iconfont"
        :class="isFullScreen ? 'icon-exit-fullscreen' : 'icon-full_screen'"
      />
    </div>
    <div
      class="ofd-view-toolbar-icon"
      :class="{ 'ofd-view-toolbar-disabled': pageCount === 0 }"
      title="打印"
      @click="$emit('printOfd')"
    >
      <i class="iconfont icon-print" />
    </div>
    <div
      class="ofd-view-toolbar-icon"
      :class="{ 'ofd-view-toolbar-disabled': pageCount === 0 }"
      title="下载"
      @click="$emit('downOfd')"
    >
      <i class="iconfont icon-xiazai" />
    </div>
    <div
      class="ofd-view-toolbar-icon"
      :class="{ 'ofd-view-toolbar-disabled': pageCount === 0 }"
      title="证书列表"
      @click="$emit('showCertList')"
    >
      <i class="iconfont icon-certlist" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
defineProps<{ pageCount: number }>();
defineEmits<{
  (e: "toggleFullScreen"): void;
  (e: "printOfd"): void;
  (e: "downOfd"): void;
  (e: "showCertList"): void;
}>();

onMounted(() => {
  document.addEventListener("fullscreenchange", updateFullScreen);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", updateFullScreen);
});

const isFullScreen = ref(false);
const updateFullScreen = () => {
  isFullScreen.value = !!document.fullscreenElement;
};
</script>
<style scoped>
.tool-bar {
  display: flex;
  align-items: center;
  padding-right: 20px;
}
</style>
