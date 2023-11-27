<template>
  <div v-if="props.toasts.length > 0" class="toast-list" align="center">
    <fwb-toast v-for="(item, i) in props.toasts" :key="i" :type="item.type" closable class="w-full">{{ item.message }}</fwb-toast>
  </div>
</template>

<script setup>
import { FwbToast } from "flowbite-vue";

const props = defineProps({
  toasts: { type: Array, default:() => [] },
})
</script>

<style scoped>
  .toast-list{
    @apply fixed top-4 right-4 z-40 space-y-2 w-full max-w-xs;

    & > div{
      @apply border border-slate-200;
      animation: toastIn .3s;
    }
  }

  @keyframes toastIn {
    from{
      transform: translateX(100%);
    }
    to{
      transform: translateX(0%);
    }
  }
</style>