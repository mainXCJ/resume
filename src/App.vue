<template>
  <div class="flex h-screen flex-col font-sans bg-gradient-to-br from-gray-50 to-gray-100">
    <header class="text-white h-14 flex items-center justify-between px-5 shrink-0 z-10 no-print"
      :style="{ background: `linear-gradient(135deg, ${store.config.themeColor} 0%, ${store.config.themeColor}dd 100%)` }">
      <div class="flex items-center gap-3">
        <span class="text-xl font-bold tracking-tight">MD-Resume Studio</span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">在线简历编辑器</span>
      </div>

      <div class="flex gap-3 items-center">
        <div class="flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-1">
          <span class="text-[11px] text-white/70 font-medium">字号</span>
          <button @click="adjustGlobalFontSize(-0.5)" class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 text-sm font-bold transition-colors">−</button>
          <span class="w-7 text-center text-xs font-bold tabular-nums">{{ globalFontSize.toFixed(1) }}</span>
          <button @click="adjustGlobalFontSize(0.5)" class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 text-sm font-bold transition-colors">+</button>
        </div>

        <button @click="handlePrint" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 border border-white/10">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          导出 PDF
        </button>
        <button @click="handleExportDocx" class="bg-white hover:bg-white/90 text-gray-800 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Word
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden gap-px bg-gray-100/40">
      <EditorPanel />
      <PreviewPanel />
    </div>

    <!-- Toast 通知 -->
    <Teleport to="body">
      <div v-if="toastMessage"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-5 py-2.5 rounded-xl text-sm font-bold shadow-2xl transition-all duration-300 backdrop-blur-sm"
        :style="{ background: toastMessage.startsWith('✅') ? '#065f46ee' : '#92400eee', color: '#fff' }">
        <span class="flex items-center gap-2">{{ toastMessage }}</span>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { store } from './store'
import EditorPanel from './components/EditorPanel.vue'
import PreviewPanel from './components/PreviewPanel.vue'

const toastMessage = ref('')
let toastTimer = null
const showToast = (msg, duration = 2500) => {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMessage.value = ''; toastTimer = null }, duration)
}

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
    window.print()
}

const handleExportDocx = () => {
  // 优先读取屏幕预览内容，隐藏的 resume-canvas 用于回退
  const screenPapers = document.querySelectorAll('#preview-container [data-resume-screen-page]')
  let contentHTML = ''

  if (screenPapers.length) {
    screenPapers.forEach(page => { contentHTML += page.innerHTML + '\n<div style="page-break-before: always"></div>\n' })
    // 去掉最后一个分页符
    contentHTML = contentHTML.replace(/\n<div style="page-break-before: always"><\/div>\n$/, '')
  } else {
    const canvas = document.getElementById('resume-canvas')
    if (canvas) contentHTML = canvas.innerHTML
  }

  if (!contentHTML || contentHTML.trim() === '') {
    showToast('⚠️ 简历内容为空，请先添加内容', 3000)
    return
  }
  const themeColor = store.config.themeColor
  const nameSize = store.config.nameSize
  const titleSize = store.config.titleSize
  const bodySize = store.config.bodyFontSize
  const lineH = store.config.lineHeight
  const pageMargin = store.config.margin

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
  @page { size: A4; margin: ${pageMargin.top}mm ${pageMargin.right}mm ${pageMargin.bottom}mm ${pageMargin.left}mm; }
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
  showToast('✅ Word 文档已下载')
}
</script>
