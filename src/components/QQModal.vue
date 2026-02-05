<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { IMAGES } from '@/utils/assets'

const props = defineProps<{
  visible: boolean
}>()

// 获取正确的图片路径
const qqImageUrl = IMAGES.qqQrCode

const emit = defineEmits<{
  (e: 'close'): void
}>()

// 点击外部关闭
const handleClickOutside = (e: MouseEvent) => {
  if (props.visible) {
    emit('close')
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 10)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-95"
  >
    <div 
      v-if="visible"
      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-white/75 dark:bg-gray-800/75 backdrop-blur-sm rounded-2xl shadow-2xl z-50 w-[280px]"
      @click.stop
    >
      <div class="w-[256px] h-[256px] rounded-xl overflow-hidden">
        <img 
          :src="qqImageUrl" 
          alt="QQ二维码" 
          class="w-full h-full object-contain"
        />
      </div>
      <!-- 小箭头 -->
      <div class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white/75 dark:border-t-gray-800/75"></div>
    </div>
  </Transition>
</template>
