<template>
  <div
    id="preview-container"
    ref="previewContainerRef"
    class="w-1/2 print:w-full flex justify-center overflow-y-auto overflow-x-hidden p-4 no-scrollbar bg-gray-50 print:bg-white print:p-0 items-start"
  >
    <div v-html="printStyle"></div>

    <!-- 屏幕预览 -->
    <div class="print:hidden flex flex-col items-center gap-6 w-full">
      <div
        v-for="(page, pageIndex) in paginatedPages"
        :key="`screen-page-${pageIndex}`"
        class="screen-page-shell shrink-0"
        :style="screenPageShellStyle"
      >
        <div
          data-resume-screen-page
          class="resume-paper bg-white shadow-2xl relative"
          :style="screenPreviewPageStyle"
        >
          <!-- 侧栏模板：双栏结构 -->
          <template v-if="store.template === 'sidebar'">
            <div class="flex" :style="{ minHeight: '297mm' }">
              <!-- 左侧侧栏 -->
              <div class="shrink-0" :style="{ width: '35%', background: store.config.themeColor }">
                <div v-for="block in page.filter(b => b.__side === 'left')" :key="block.id">
                  <ResumeContentBlock
                    :block="block"
                    :block-id="block.id"
                    :render-rich-text="renderRichText"
                    :store="store"
                  />
                </div>
              </div>
              <!-- 右侧主内容 -->
              <div class="flex-1 p-5" :style="{ background: '#ffffff' }">
                <div v-for="block in page.filter(b => b.__side === 'right')" :key="block.id">
                  <ResumeContentBlock
                    :block="block"
                    :block-id="block.id"
                    :render-rich-text="renderRichText"
                    :store="store"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- 其他模板：标准单栏 -->
          <template v-else>
            <ResumeContentBlock
              v-for="block in page"
              :key="block.id"
              :block="block"
              :block-id="block.id"
              :render-rich-text="renderRichText"
              :store="store"
            />
          </template>
        </div>
      </div>
    </div>

    <!-- 测量容器（用于分页计算） -->
    <div
      aria-hidden="true"
      inert
      role="presentation"
      class="fixed left-[-99999px] top-0 opacity-0 pointer-events-none print:hidden"
    >
      <div ref="measurePageRef" class="resume-paper bg-white relative" :style="measurePageStyle">
        <template v-if="store.template === 'sidebar'">
          <div class="flex">
            <div :style="{ width: '35%', background: store.config.themeColor }">
              <div v-for="block in screenBlocks.filter(b => b.__side === 'left')" :key="block.id">
                <ResumeContentBlock :block="block" :block-id="block.id" :render-rich-text="renderRichText" :store="store" />
              </div>
            </div>
            <div class="flex-1 p-5">
              <div v-for="block in screenBlocks.filter(b => b.__side === 'right')" :key="block.id">
                <ResumeContentBlock :block="block" :block-id="block.id" :render-rich-text="renderRichText" :store="store" />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <ResumeContentBlock
            v-for="block in screenBlocks"
            :key="block.id"
            :block="block"
            :block-id="block.id"
            :render-rich-text="renderRichText"
            :store="store"
          />
        </template>
      </div>
    </div>

    <!-- 打印画布：直接复用屏幕预览的分页结果，保证生成样式与预览一致 -->
    <div id="resume-canvas" aria-hidden="true" inert role="presentation" class="hidden print:block">
      <div
        v-for="(page, pageIndex) in paginatedPages"
        :key="`print-page-${pageIndex}`"
        class="resume-paper print-page bg-white relative"
        :class="{ 'print-page-last': pageIndex === paginatedPages.length - 1 }"
        :style="screenPageStyle"
      >
        <template v-if="store.template === 'sidebar'">
          <div class="flex" :style="{ minHeight: '297mm' }">
            <div class="shrink-0" :style="{ width: '35%', background: store.config.themeColor }">
              <div v-for="block in page.filter(b => b.__side === 'left')" :key="block.id">
                <ResumeContentBlock :block="block" :block-id="block.id" :render-rich-text="renderRichText" :store="store" />
              </div>
            </div>
            <div class="flex-1 p-5" :style="{ background: '#ffffff' }">
              <div v-for="block in page.filter(b => b.__side === 'right')" :key="block.id">
                <ResumeContentBlock :block="block" :block-id="block.id" :render-rich-text="renderRichText" :store="store" />
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <ResumeContentBlock
            v-for="block in page"
            :key="block.id"
            :block="block"
            :block-id="block.id"
            :render-rich-text="renderRichText"
            :store="store"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { store } from '../store'
import { TEMPLATES, getThemeOptions } from '../templates.js'
import ResumeContentBlock from './ResumeContentBlock.vue'

const measurePageRef = ref(null)
const previewContainerRef = ref(null)
const paginatedPages = ref([])
const screenScale = ref(1)
const measuredPageSize = ref({ width: 0, height: 0 })
let paginationFrame = null
let resizeObserver = null

const visibleModules = computed(() => store.modules.filter(mod => mod.visible))
const tableSeparatorPattern = /^\s*\|(?:\s*[-:]+\s*\|)+\s*$/

// 当切换模板时，自动更新主题色和配置
watch(() => store.template, (newTemplateId) => {
  const tpl = TEMPLATES.find(t => t.id === newTemplateId)
  if (tpl) {
    // 如果当前主题色不在新模板的色板中，重置为第一个
    const newColors = getThemeOptions(newTemplateId)
    const isMatchingColor = newColors.some(c => c.value === store.config.themeColor)
    if (!isMatchingColor) {
      store.config.themeColor = newColors[0].value
    }
    store.themeOptions = newColors
  }
})

const sharedPageStyle = computed(() => {
  const isSidebar = store.template === 'sidebar'
  const margin = store.config.margin

  return {
    width: '210mm',
    minHeight: '297mm',
    height: 'max-content',
    boxSizing: 'border-box',
    padding: isSidebar ? '0' : `${margin.top}mm ${margin.right}mm ${margin.bottom}mm ${margin.left}mm`,
    lineHeight: store.config.lineHeight,
    '--print-theme-color': store.config.themeColor,
    '--resume-body-line-height': store.config.lineHeight,
    '--print-page-margin-top': `${margin.top}mm`,
    '--print-page-margin-bottom': `${margin.bottom}mm`,
  }
})

const screenPageStyle = computed(() => ({
  ...sharedPageStyle.value,
  background: '#ffffff'
}))

const screenPreviewPageStyle = computed(() => ({
  ...screenPageStyle.value,
  transform: `scale(${screenScale.value})`,
  transformOrigin: 'top left'
}))

const screenPageShellStyle = computed(() => {
  const { width, height } = measuredPageSize.value
  if (!width || !height) return { width: '210mm', minHeight: '297mm' }
  return {
    width: `${width * screenScale.value}px`,
    height: `${height * screenScale.value}px`
  }
})

const measurePageStyle = computed(() => ({
  ...sharedPageStyle.value,
  height: '297mm',
  minHeight: '297mm',
  overflow: 'hidden',
  background: '#ffffff'
}))

// ---------- 侧栏模板的模块分配 ----------
const isSidebarModule = (mod) => {
  // 技能、证书、评价等模块放入侧栏
  return ['skills', 'cert', 'eval'].includes(mod.id)
}

// ---------- 创建打印分块 ----------
const createModuleTitleBlock = (mod, suffix = '', side = null) => ({
  id: `${mod.id}-title${suffix}`,
  type: 'module-title',
  mod,
  __side: side || (isSidebarModule(mod) ? 'left' : 'right')
})

const createPrintBlocks = () => {
  const isSidebar = store.template === 'sidebar'

  if (isSidebar) {
    // 侧栏模板：左侧-个人信息 + 部分模块；右侧-其他模块
    const leftBlocks = [
      { id: 'sidebar-info', type: 'sidebar-info', __side: 'left' }
    ]
    const rightBlocks = []

    visibleModules.value.forEach((mod) => {
      if (isSidebarModule(mod)) {
        // 左侧模块
        leftBlocks.push({
          id: `${mod.id}-title`,
          type: 'sidebar-module-title',
          mod,
          isFirst: true,
          __side: 'left'
        })
        mod.items.forEach((item, idx) => {
          leftBlocks.push({
            id: `${mod.id}-item-${idx}`,
            type: 'sidebar-item',
            mod,
            item,
            showDivider: mod.showDivider && idx < mod.items.length - 1,
            __side: 'left'
          })
        })
      } else {
        // 右侧模块
        rightBlocks.push({
          id: `${mod.id}-title`,
          type: 'main-module-title',
          mod,
          __side: 'right'
        })
        mod.items.forEach((item, idx) => {
          const isLastItem = idx === mod.items.length - 1
          rightBlocks.push({
            id: `${mod.id}-heading-${idx}`,
            type: 'main-item-heading',
            mod,
            item,
            __side: 'right'
          })
          rightBlocks.push({
            id: `${mod.id}-content-${idx}`,
            type: 'main-item-content',
            mod,
            item,
            content: item.content,
            __side: 'right'
          })
          if (isLastItem) {
            rightBlocks.push({
              id: `${mod.id}-spacing`,
              type: 'main-spacing',
              height: store.config.moduleSpacing,
              __side: 'right'
            })
          }
        })
      }
    })

    return [...leftBlocks, ...rightBlocks]
  }

  // 标准/极简/优雅模板：使用原来的单一列表逻辑
  const blocks = [{ id: 'header', type: 'header' }]

  visibleModules.value.forEach((mod) => {
    blocks.push(createModuleTitleBlock(mod))

    mod.items.forEach((item, idx) => {
      const isLastItem = idx === mod.items.length - 1
      blocks.push({
        id: `${mod.id}-item-${idx}`,
        type: 'item',
        mod,
        item,
        showDivider: mod.showDivider && !isLastItem,
        marginBottom: isLastItem ? store.config.moduleSpacing : 8
      })
    })
  })

  return blocks
}

// ---------- 屏幕渲染分块（更精细的段） ----------
const splitPreviewSegments = (content) => {
  if (!content) return []
  return content
    .split('\n')
    .flatMap((line, lineIndex) => {
      const trimmed = line.trim()
      const isTableLine = trimmed.startsWith('|') && trimmed.endsWith('|')
      if (isTableLine) {
        if (tableSeparatorPattern.test(trimmed)) return []
        const cells = line
          .split('|')
          .filter((_, index, arr) => index !== 0 && index !== arr.length - 1)
          .map(cell => cell.trim())
        return [{ type: 'table-row', cells, segmentIndex: lineIndex }]
      }
      return [{ type: 'item-content', content: line, segmentIndex: lineIndex }]
    })
}

const createScreenBlocks = () => {
  const isSidebar = store.template === 'sidebar'

  if (isSidebar) {
    // 侧栏模板使用与打印同样的分块
    return createPrintBlocks()
  }

  // 标准/极简/优雅模板的精细分块
  const blocks = [{ id: 'header', type: 'header' }]

  visibleModules.value.forEach((mod) => {
    blocks.push(createModuleTitleBlock(mod))

    mod.items.forEach((item, idx) => {
      const itemBaseId = `${mod.id}-item-${idx}`
      const isLastItem = idx === mod.items.length - 1
      const itemSpacing = isLastItem ? store.config.moduleSpacing : 8
      const hasHeading = !mod.isSingle && (item.p1 || item.p2 || item.p3)
      const segments = splitPreviewSegments(item.content)

      if (hasHeading) {
        blocks.push({
          id: `${itemBaseId}-heading`,
          type: 'item-heading',
          mod,
          item
        })
      }

      if (segments.length) {
        segments.forEach((segment, segmentIdx) => {
          blocks.push({
            id: `${itemBaseId}-${segment.type}-${segmentIdx}`,
            mod,
            item,
            ...segment
          })
        })
      }

      if (mod.showDivider && !isLastItem) {
        blocks.push({
          id: `${itemBaseId}-divider`,
          type: 'divider',
          mod
        })
      }

      if (itemSpacing > 0) {
        blocks.push({
          id: `${itemBaseId}-spacing`,
          type: 'spacing',
          height: itemSpacing,
          mod
        })
      }
    })
  })

  return blocks
}

const screenBlocks = computed(createScreenBlocks)

const updateScreenScale = () => {
  const container = previewContainerRef.value
  const measurePage = measurePageRef.value
  if (!container || !measurePage) return

  const containerStyles = window.getComputedStyle(container)
  const horizontalPadding =
    (parseFloat(containerStyles.paddingLeft) || 0) +
    (parseFloat(containerStyles.paddingRight) || 0)
  const availableWidth = Math.max(0, container.clientWidth - horizontalPadding)
  const pageRect = measurePage.getBoundingClientRect()
  if (!pageRect.width || !availableWidth) return

  measuredPageSize.value = { width: pageRect.width, height: pageRect.height }
  screenScale.value = Math.min(1, Math.max(0.2, availableWidth / pageRect.width))
}

const queuePagination = async () => {
  if (paginationFrame) cancelAnimationFrame(paginationFrame)
  await nextTick()
  paginationFrame = requestAnimationFrame(() => {
    paginationFrame = requestAnimationFrame(() => {
      paginationFrame = null
      updateScreenScale()
      paginateBlocks()
    })
  })
}

const paginateBlocks = () => {
  const measurePage = measurePageRef.value
  const blocks = screenBlocks.value

  if (!measurePage || !blocks.length) {
    paginatedPages.value = blocks.length ? [blocks] : []
    return
  }

  const styles = window.getComputedStyle(measurePage)
  const paddingTop = parseFloat(styles.paddingTop) || 0
  const paddingBottom = parseFloat(styles.paddingBottom) || 0
  const pageContentHeight = measurePage.getBoundingClientRect().height - paddingTop - paddingBottom
  const nodeList = measurePage.querySelectorAll('[data-block-id]')
  const heights = new Map(Array.from(nodeList, (node) => [node.dataset.blockId, node.getBoundingClientRect().height]))
  const getBlockHeight = (block) => {
    if (!block) return 0
    if (heights.has(block.id)) return heights.get(block.id) ?? 0
    if (block.type === 'module-title') return heights.get(`${block.mod.id}-title`) ?? 0
    return 0
  }
  const getStickyGroupHeight = (block, nextBlock) => {
    if (!block) return 0
    if (block.type !== 'module-title' && block.type !== 'item-heading') return getBlockHeight(block)
    return getBlockHeight(block) + getBlockHeight(nextBlock)
  }
  const pushCurrentPage = () => {
    if (!currentPage.length) return
    pages.push(currentPage)
    currentPage = []
    usedHeight = 0
  }

  const pages = []
  let currentPage = []
  let usedHeight = 0

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    const blockHeight = getBlockHeight(block)
    const hasCurrentContent = currentPage.length > 0

    if (block.type === 'module-title' || block.type === 'item-heading' || block.type === 'main-module-title') {
      const nextBlock = blocks[index + 1]
      const groupHeight = getStickyGroupHeight(block, nextBlock)
      if (hasCurrentContent && nextBlock && usedHeight + groupHeight > pageContentHeight) {
        pushCurrentPage()
      }
    } else if (hasCurrentContent && usedHeight + blockHeight > pageContentHeight) {
      const lastBlock = currentPage[currentPage.length - 1]
      const lastBlockIsSticky = lastBlock?.type === 'module-title' || lastBlock?.type === 'item-heading' || lastBlock?.type === 'main-module-title'

      if (lastBlockIsSticky) {
        const carriedBlock = currentPage.pop()
        usedHeight -= getBlockHeight(carriedBlock)
        pushCurrentPage()
        currentPage = [carriedBlock]
        usedHeight = getBlockHeight(carriedBlock)
      } else {
        pushCurrentPage()
      }
    }

    currentPage.push(block)
    usedHeight += blockHeight
  }

  if (currentPage.length) pages.push(currentPage)
  paginatedPages.value = pages
}

onMounted(() => {
  queuePagination()
  resizeObserver = new ResizeObserver(queuePagination)
  if (previewContainerRef.value) resizeObserver.observe(previewContainerRef.value)
  window.addEventListener('resize', queuePagination)
  if (document.fonts?.ready) {
    document.fonts.ready.then(queuePagination)
  }
})

onBeforeUnmount(() => {
  if (paginationFrame) cancelAnimationFrame(paginationFrame)
  resizeObserver?.disconnect()
  window.removeEventListener('resize', queuePagination)
})

watch(screenBlocks, queuePagination, { deep: true, immediate: true })
watch(
  () => [
    store.info.name,
    store.info.intent,
    store.info.phone,
    store.info.email,
    store.info.degree,
    store.info.location,
    store.info.photo,
    store.config.margin.top,
    store.config.margin.right,
    store.config.margin.bottom,
    store.config.margin.left,
    store.config.lineHeight,
    store.config.moduleSpacing,
    store.config.nameSize,
    store.config.titleSize,
    store.config.titleFontSize,
    store.config.bodyFontSize,
    store.config.avatarScale,
    store.config.themeColor,
    store.template,
  ],
  queuePagination,
  { immediate: true }
)

const printStyle = computed(() => `
  <style>
    @media print {
      html, body, #app {
        display: block !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }
      .no-print { display: none !important; }
      #preview-container {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        display: block !important;
        width: 100% !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        background: white !important;
      }
      @page {
        size: A4 portrait;
        margin: 0 !important;
      }
      #resume-canvas {
        display: block !important;
        position: static !important;
        width: 100% !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        background: #ffffff !important;
        overflow: visible !important;
      }
      #resume-canvas .print-page {
        width: 210mm !important;
        min-height: 297mm !important;
        height: 297mm !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        overflow: hidden !important;
        page-break-after: always !important;
        break-after: page !important;
      }
      #resume-canvas .print-page-last {
        page-break-after: auto !important;
        break-after: auto !important;
      }
      .page-break-lines { background-image: none !important; }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
`)

const renderRichText = (text) => {
  if (!text) return ''
  const lines = text.split('\n')
  let html = ''
  let inTable = false
  const orderedState = []
  const escapeHtml = (str) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const getLevel = (indentation) => Math.floor(indentation.replace(/\t/g, '  ').length / 2)
  const resetOrderedState = (level = 0) => { orderedState.length = level }

  const parseInline = (str) => {
    let res = escapeHtml(str)
    res = res.replace(/`([^`]+)`/g, '<code class="px-1 rounded bg-gray-100 text-gray-800">$1</code>')
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    res = res.replace(/\*(.*?)\*/g, '<em class="text-gray-800" style="font-style: italic !important; font-family: sans-serif !important; font-synthesis: style !important;">$1</em>')
    res = res.replace(/【(.*?)】/g, `<strong style="color: ${store.config.themeColor}; background: rgba(0,0,0,0.04); padding: 0 4px; border-radius: 2px; margin: 0 2px;">$1</strong>`)
    res = res.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" class="underline" target="_blank" rel="noreferrer">$1</a>')
    return res
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      resetOrderedState()
      if (!inTable) {
        html += `<table class="w-full text-[0.95em] border-collapse my-1.5 text-gray-700">`
        inTable = true
      }
      if (line.match(/\|[-:\s]+\|/)) continue
      const cells = line.split('|').filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1)
      html += '<tr style="page-break-inside: avoid; break-inside: avoid;">'
      cells.forEach(cell => { html += `<td class="border border-gray-300 px-2 py-1">${parseInline(cell.trim())}</td>` })
      html += '</tr>'
      continue
    } else if (inTable) {
      html += '</table>'
      inTable = false
    }
    if (!line.trim()) {
      resetOrderedState()
      html += '<div class="h-1"></div>'
      continue
    }
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)/)
    if (ulMatch) {
      const level = getLevel(ulMatch[1])
      const padding = level * 1.2
      resetOrderedState(level + 1)
      let markerHtml = ''
      const themeColor = store.config.themeColor
      if (level === 0) {
        markerHtml = `<span style="color: ${themeColor}; font-size: 1.32em; line-height: 1; font-weight: 700;">&#8226;</span>`
      } else if (level === 1) {
        markerHtml = `<span style="color: ${themeColor}; font-size: 1.2em; line-height: 1; font-weight: 700;">&#9702;</span>`
      } else {
        markerHtml = `<span style="color: ${themeColor}; font-size: 1.05em; line-height: 1; font-weight: 700;">&#9642;</span>`
      }
      html += `
        <div style="padding-left: ${padding}rem; display: grid; grid-template-columns: 1.25em minmax(0, 1fr); column-gap: 0.35em; align-items: start; page-break-inside: avoid; break-inside: avoid;">
          <div style="height: ${store.config.lineHeight}em; display: flex; align-items: center; justify-content: center;">
            ${markerHtml}
          </div>
          <span style="min-width: 0;">${parseInline(ulMatch[2])}</span>
        </div>`
      continue
    }
    const olMatch = line.match(/^(\s*)((?:\d+\.)*\d+)\.\s+(.*)/)
    if (olMatch) {
      const level = getLevel(olMatch[1])
      const padding = level * 1.2
      const markerParts = olMatch[2].split('.').map(part => parseInt(part, 10)).filter(num => !Number.isNaN(num))
      const usesHierarchicalMarker = olMatch[2].includes('.')
      for (let idx = 0; idx < level; idx += 1) {
        if (!orderedState[idx]) orderedState[idx] = 1
      }
      orderedState[level] = usesHierarchicalMarker && markerParts.length
        ? markerParts[markerParts.length - 1]
        : (orderedState[level] || 0) + 1
      orderedState.length = level + 1
      const displayMarker = `${orderedState.join('.')}.`
      html += `<div style="padding-left: ${padding}rem; display: grid; grid-template-columns: max-content minmax(0, 1fr); column-gap: 0.35em; align-items: start; page-break-inside: avoid; break-inside: avoid;">
          <span class="font-bold text-gray-700 whitespace-nowrap" style="display: inline-block;">${displayMarker}</span>
          <span style="min-width: 0;">${parseInline(olMatch[3])}</span>
        </div>`
      continue
    }
    resetOrderedState()
    html += `<div style="page-break-inside: avoid; break-inside: avoid;">${parseInline(line)}</div>`
  }
  if (inTable) html += '</table>'
  return html
}
</script>

<style scoped>
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    outline: none !important;
  }
  .w-1\/2 { width: 100% !important; }
  .resume-paper {
    width: 210mm !important;
    min-height: 297mm !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    background: #ffffff !important;
  }
}
</style>
