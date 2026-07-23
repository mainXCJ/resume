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
          <button
            type="button"
            aria-label="减小正文字号"
            title="减小正文字号"
            @click="adjustGlobalFontSize(-0.5)"
            class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 text-sm font-bold transition-colors"
          >−</button>
          <span class="w-7 text-center text-xs font-bold tabular-nums">{{ globalFontSize.toFixed(1) }}</span>
          <button
            type="button"
            aria-label="增大正文字号"
            title="增大正文字号"
            @click="adjustGlobalFontSize(0.5)"
            class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 text-sm font-bold transition-colors"
          >+</button>
        </div>

        <button type="button" @click="handlePrint" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 border border-white/10">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          导出 PDF
        </button>
        <button
          type="button"
          title="导出可编辑的 Word 兼容版"
          @click="handleExportDocx"
          class="bg-white hover:bg-white/90 text-gray-800 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
        >
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

const escapeWordHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const renderWordInline = (value = '') => {
  let html = escapeWordHtml(value)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/【(.*?)】/g, '<strong class="tag">$1</strong>')
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
  return html
}

const renderWordContent = (content = '') => {
  const lines = String(content).split('\n')
  let html = ''
  let inTable = false

  const closeTable = () => {
    if (!inTable) return
    html += '</table>'
    inTable = false
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    const isTableLine = trimmed.startsWith('|') && trimmed.endsWith('|')
    if (isTableLine) {
      if (/^\s*\|(?:\s*[-:]+\s*\|)+\s*$/.test(trimmed)) return
      if (!inTable) {
        html += '<table class="content-table">'
        inTable = true
      }
      const cells = line
        .split('|')
        .filter((_, index, values) => index !== 0 && index !== values.length - 1)
      html += `<tr>${cells.map(cell => `<td>${renderWordInline(cell.trim())}</td>`).join('')}</tr>`
      return
    }

    closeTable()
    if (!trimmed) {
      html += '<p class="spacer">&nbsp;</p>'
      return
    }

    const unordered = line.match(/^\s*[-*+]\s+(.*)$/)
    if (unordered) {
      html += `<p class="list"><span class="marker">•</span>${renderWordInline(unordered[1])}</p>`
      return
    }

    const ordered = line.match(/^\s*((?:\d+\.)*\d+\.)\s+(.*)$/)
    if (ordered) {
      html += `<p class="list"><span class="marker">${escapeWordHtml(ordered[1])}</span>${renderWordInline(ordered[2])}</p>`
      return
    }

    html += `<p>${renderWordInline(line)}</p>`
  })

  closeTable()
  return html
}

const safeNumber = (value, fallback, min, max) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

const toPt = (pixels, fallback) => (safeNumber(pixels, fallback, 0, 200) * 0.75).toFixed(2)

const buildWordContent = () => {
  const contactItems = [
    store.info.phone,
    store.info.email,
    store.info.degree,
    store.info.location,
    store.info.github
  ].filter(Boolean)

  const photo = String(store.info.photo || '')
  const photoHTML = photo.startsWith('data:image/')
    ? `<td class="photo-cell"><img src="${escapeWordHtml(photo)}" alt=""></td>`
    : ''

  const headerHTML = `
    <table class="header-table">
      <tr>
        <td class="identity">
          <h1>${renderWordInline(store.info.name || '未命名简历')}</h1>
          ${store.info.intent ? `<p class="intent">${renderWordInline(store.info.intent)}</p>` : ''}
        </td>
        <td class="contact">${contactItems.map(item => `<p>${renderWordInline(item)}</p>`).join('')}</td>
        ${photoHTML}
      </tr>
    </table>`

  const modulesHTML = store.modules
    .filter(module => module.visible)
    .map((module) => {
      const itemsHTML = module.items.map((item) => {
        const hasHeading = !module.isSingle && (item.p1 || item.p2 || item.p3)
        const headingHTML = hasHeading
          ? `<table class="item-heading"><tr>
              <td class="item-p1">${renderWordInline(item.p1 || '')}</td>
              <td class="item-p2">${renderWordInline(item.p2 || '')}</td>
              <td class="item-p3">${renderWordInline(item.p3 || '')}</td>
            </tr></table>`
          : ''
        return `<div class="item">${headingHTML}${renderWordContent(item.content || '')}</div>`
      }).join('')

      return `<section><h2>${renderWordInline(module.title || '未命名模块')}</h2>${itemsHTML}</section>`
    })
    .join('')

  return `${headerHTML}${modulesHTML}`
}

const handleExportDocx = () => {
  const contentHTML = buildWordContent()
  const hasVisibleContent = store.modules.some(module => module.visible && module.items.length)
  if (!hasVisibleContent && !store.info.name) {
    showToast('⚠️ 简历内容为空，请先添加内容', 3000)
    return
  }

  const themeColor = store.config.themeColor
  const nameSize = toPt(store.config.nameSize, 36)
  const titleSize = toPt(store.config.titleSize, 20)
  const itemTitleSize = toPt(store.config.titleFontSize, 14)
  const bodySize = toPt(store.config.bodyFontSize, 12)
  const lineH = safeNumber(store.config.lineHeight, 1.5, 1, 2.5)
  const moduleSpacing = toPt(store.config.moduleSpacing, 12)
  const pageMargin = {
    top: safeNumber(store.config.margin.top, 10, 0, 50),
    right: safeNumber(store.config.margin.right, 10, 0, 50),
    bottom: safeNumber(store.config.margin.bottom, 10, 0, 50),
    left: safeNumber(store.config.margin.left, 10, 0, 50)
  }

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
  @page { size: A4; margin: ${pageMargin.top}mm ${pageMargin.right}mm ${pageMargin.bottom}mm ${pageMargin.left}mm; }
  body { font-family: 'Microsoft YaHei', 'SimSun', sans-serif; font-size: ${bodySize}pt; line-height: ${lineH}; color: #1f2937; margin: 0; }
  table { border-collapse: collapse; width: 100%; }
  p { margin: 0; padding: 0; }
  h1 { font-size: ${nameSize}pt; line-height: 1.1; color: ${themeColor}; margin: 0 0 4pt; }
  h2 { font-size: ${titleSize}pt; line-height: 1.2; color: ${themeColor}; border-bottom: 1.25pt solid ${themeColor}; padding: 0 0 3pt; margin: ${moduleSpacing}pt 0 5pt; page-break-after: avoid; }
  section, .item { page-break-inside: avoid; }
  .header-table td, .item-heading td { border: 0; padding: 0; vertical-align: top; }
  .identity { width: 45%; }
  .intent { font-weight: 700; }
  .contact { width: 45%; text-align: right; font-size: ${bodySize}pt; }
  .contact p { margin-bottom: 2pt; }
  .photo-cell { width: 58pt; padding-left: 8pt !important; }
  .photo-cell img { width: 52pt; height: 68pt; object-fit: cover; }
  .item { margin-bottom: 5pt; }
  .item-heading { margin-bottom: 2pt; font-size: ${itemTitleSize}pt; font-weight: 700; }
  .item-p1 { width: 36%; text-align: left; }
  .item-p2 { width: 34%; text-align: center; }
  .item-p3 { width: 30%; text-align: right; }
  .content-table { margin: 3pt 0; }
  .content-table td { border: 0.75pt solid #d1d5db; padding: 2pt 4pt; vertical-align: top; }
  .list { margin-left: 12pt; text-indent: -12pt; }
  .marker { display: inline-block; width: 12pt; color: ${themeColor}; font-weight: 700; }
  .spacer { font-size: 3pt; line-height: 3pt; }
  .tag { color: ${themeColor}; }
  strong { font-weight: 700; color: #111827; }
  em { font-style: italic; }
  a { color: ${themeColor}; text-decoration: underline; }
  code { font-family: Consolas, monospace; background: #f3f4f6; }
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
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  showToast('✅ Word 兼容版已下载')
}
</script>
