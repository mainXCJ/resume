<template>
  <div class="flex h-screen flex-col font-sans bg-gray-100">
    <header class="bg-gray-900 text-white h-14 flex items-center justify-between px-6 shrink-0 z-10 no-print">
      <div class="text-lg font-bold tracking-wider">📄 MD-Resume Studio</div>
      
      <div class="flex gap-4 items-center">
        <label class="text-sm text-gray-300">全局字号:</label>
        <div class="flex items-center bg-gray-800 rounded px-1">
          <button @click="adjustGlobalFontSize(-0.5)" class="px-2 py-1 hover:text-blue-400">-</button>
          <span class="w-8 text-center text-sm font-bold">{{ globalFontSize.toFixed(1) }}</span>
          <button @click="adjustGlobalFontSize(0.5)" class="px-2 py-1 hover:text-blue-400">+</button>
        </div>

        <button @click="handlePrint" class="bg-blue-600 hover:bg-blue-500 px-5 py-1.5 rounded text-sm font-bold shadow-md transition-colors ml-4">
          📥 导出可编辑 PDF
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <EditorPanel />
      <PreviewPanel />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store } from './store'
import EditorPanel from './components/EditorPanel.vue'
import PreviewPanel from './components/PreviewPanel.vue'

const globalFontSize = computed({
    get: () => Number(store.config.bodyFontSize ?? 12),
    set: (value) => {
        const nextValue = Math.min(18, Math.max(9, Number(value)))
        store.config.bodyFontSize = Number(nextValue.toFixed(1))
    }
})

const adjustGlobalFontSize = (delta) => {
    globalFontSize.value = globalFontSize.value + delta
}

const handlePrint = () => {
    // 调用浏览器原生打印
    window.print();
}
</script>
