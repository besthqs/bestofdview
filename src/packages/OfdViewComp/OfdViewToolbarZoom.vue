<template>
  <div class="tool-bar">
    <div class="ofd-view-toolbar-icon"     
    :class="{'ofd-view-toolbar-disabled': pageCount===0}"
    title="缩小" @click="$emit('zoomOut')">
      <i class="iconfont icon-zoom-out" />
    </div>
    |
    <div class="ofd-view-toolbar-icon" 
    :class="{'ofd-view-toolbar-disabled': pageCount===0}"
    title="放大" @click="$emit('zoomIn')">
      <i class="iconfont icon-zoom-in" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{  pageCount: number }>();
defineEmits<{
  (e: "zoomOut"): void;
  (e: "zoomIn"): void;
}>();
</script>
<style scoped>
.tool-bar {
  display: flex;
  align-items: center;
}
</style>
