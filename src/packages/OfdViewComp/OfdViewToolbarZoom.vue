<template>
  <div class="tool-bar">
    <div
      class="ofd-view-toolbar-icon"
      :class="{ 'ofd-view-toolbar-disabled': pageCount === 0 }"
      title="缩小"
      @click="$emit('zoomOut')"
    >
      <i class="iconfont icon-zoom-out" />
    </div>
    |
    <div
      class="ofd-view-toolbar-icon"
      :class="{ 'ofd-view-toolbar-disabled': pageCount === 0 }"
      title="放大"
      @click="$emit('zoomIn')"
    >
      <i class="iconfont icon-zoom-in" />
    </div>
    <div>
      <select
        name="scale"
        id="scale"
        class="page-scale"
        :disabled="pageCount === 0"
        v-model="scale"
        @change="$emit('setScale', scale)"
      >
        <option
          v-for="item in scaleList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></option>
      </select>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
defineProps<{ pageCount: number }>();
defineEmits<{
  (e: "zoomOut"): void;
  (e: "zoomIn"): void;
  (e: "setScale", scale: number): void;
}>();
const scaleList = [
  { value: 0, label: "自适应" },
  { value: 0.5, label: "实际大小" },
  { value: 2.5, label: "50%" },
  { value: 3.75, label: "75%" },
  { value: 5, label: "100%" },
  { value: 6.25, label: "125%" },
  { value: 7.5, label: "150%" },
  { value: 10, label: "200%" },
];

const scale = ref(0);
</script>
<style scoped>
.tool-bar {
  display: flex;
  align-items: center;
}

.page-scale {
  height: 32px;
  border-radius: 3px;
}
</style>
