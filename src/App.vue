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

        <button @click="handlePrint" class="bg-blue-600 hover:bg-blue-500 px-5 py-1.5 rounded text-sm font-bold shadow-md transition-colors">
          📥 导出 PDF
        </button>
        <button @click="handleExportDocx" class="bg-emerald-600 hover:bg-emerald-500 px-5 py-1.5 rounded text-sm font-bold shadow-md transition-colors">
          📝 导出 Word
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

const handleExportDocx = () => {
  // 获取简历渲染内容
  const canvas = document.getElementById('resume-canvas')
  if (!canvas) { alert('请先预览简历'); return }

  const contentHTML = canvas.innerHTML
  const themeColor = store.config.themeColor
  const nameSize = store.config.nameSize
  const titleSize = store.config.titleSize
  const bodySize = store.config.bodyFontSize
  const lineH = store.config.lineHeight

  // 构建 Word 兼容的 HTML 文档
  const docHTML = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
  /* 页面设置 */
  @page { size: A4; margin: 14mm 13mm; }
  body { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: ${bodySize}pt; line-height: ${lineH}; color: #374151; }
  h1 { font-size: ${nameSize}pt; color: ${themeColor}; margin: 0 0 4px; }
  h2 { font-size: ${titleSize}pt; color: ${themeColor}; border-bottom: 1.5px solid #eee; padding-bottom: 4px; margin: 8px 0 6px; }
  table { width: 100%; border-collapse: collapse; margin: 4px 0; }
  td { border: 1px solid #d1d5db; padding: 3px 6px; font-size: ${bodySize}pt; }
  .icon { display: none; }
  hr { border: none; border-top: 1px dashed #e5e7eb; margin: 4px 0; }
  strong { font-weight: 700; color: #111; }
  em { font-style: italic; }
  a { color: ${themeColor}; text-decoration: underline; }
  img { max-width: 80px; height: auto; }
</style>
</head>
<body>
  ${contentHTML}
</body>
</html>`

  const blob = new Blob([docHTML], { type: 'application/msword;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `简历_${store.info.name || 'untitled'}.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>
