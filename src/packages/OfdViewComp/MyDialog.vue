<template>
  <div v-if="modelValue" class="my-dialog-overlay" @click="closeOnClickOutside">
    <div class="my-dialog" @click.stop>
      <div class="my-dialog-header">
        <slot name="header">{{ title }}</slot>
        <button class="my-dialog-close" @click="closeDialog">X</button>
      </div>
      <div class="my-dialog-body">
        <slot></slot>
      </div>
      <div class="my-dialog-footer">
        <slot name="footer">
          <button @click="closeDialog">关闭</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

// 定义 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "提示",
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
});

// 定义 emits
const emit = defineEmits(["update:modelValue"]);

// 关闭对话框
const closeDialog = () => {
  emit("update:modelValue", false);
};

// 点击外部关闭对话框
const closeOnClickOutside = () => {
  if (props.closeOnClickOutside) {
    closeDialog();
  }
};
</script>

<style scoped>
.my-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.my-dialog {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 60%;
  max-width: 600px;
  min-width: 300px;
  overflow: hidden;
}

.my-dialog-header {
  padding: 16px 24px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.my-dialog-close {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.my-dialog-body {
  padding: 24px;
}

.my-dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}
</style>
