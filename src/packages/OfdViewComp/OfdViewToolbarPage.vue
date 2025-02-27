<template>
  <div class="tool-bar">
    <slot></slot>
    <div
      class="ofd-view-toolbar-icon"
      :class="{ 'ofd-view-toolbar-disabled': pageCount < 2 || pageIndex === 1 }"
      title="第一页"
      @click="$emit('firstPage')"
    >
      <i class="iconfont icon-left2" />
    </div>
    <div
      class="ofd-view-toolbar-icon"
      :class="{ 'ofd-view-toolbar-disabled': pageCount < 2 || pageIndex === 1 }"
      title="前一页"
      @click="$emit('prePage')"
    >
      <i class="iconfont icon-left" />
    </div>
    <div class="page-input" style="width: 100px">
      <input
        :disabled="pageCount === 0"
        class="page-input-num"
        type="text"
        :value="pageIndex"
        @change="handlePageInputChange"
      />
      <div>/{{ pageCount }}</div>
    </div>
    <div
      class="ofd-view-toolbar-icon"
      :class="{
        'ofd-view-toolbar-disabled': pageCount < 2 || pageIndex === pageCount,
      }"
      title="后一页"
      @click="$emit('nextPage')"
    >
      <i class="iconfont icon-right" />
    </div>
    <div
      class="ofd-view-toolbar-icon"
      :class="{
        'ofd-view-toolbar-disabled': pageCount < 2 || pageIndex === pageCount,
      }"
      title="最后一页"
      @click="$emit('lastPage')"
    >
      <i class="iconfont icon-right2" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ pageIndex: number; pageCount: number }>();

const emit = defineEmits<{
  (e: "firstPage"): void;
  (e: "prePage"): void;
  (e: "handlePageInputChange", event: Event): void;
  (e: "nextPage"): void;
  (e: "lastPage"): void;
}>();

const handlePageInputChange = (event: Event) => {
  emit("handlePageInputChange", event);
};
</script>
<style scoped>
.tool-bar {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.page-input {
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  width: 60px;
  border-radius: 3px;
}
.page-input-num {
  width: 40px;
  height: 32px;
  padding: 0 10px;
  margin: 0 3px;
  text-align: center;
}
</style>
