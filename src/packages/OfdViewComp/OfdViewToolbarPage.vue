<template>
  <div class="tool-bar">
    <div class="ofd-view-toolbar-icon" @click="$emit('firstPage')">
      <i class="iconfont icon-left2" />
    </div>
    <div class="ofd-view-toolbar-icon" @click="$emit('prePage')">
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
    <div class="ofd-view-toolbar-icon" @click="$emit('nextPage')">
      <i class="iconfont icon-right" />
    </div>
    <div class="ofd-view-toolbar-icon" @click="$emit('lastPage')">
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
