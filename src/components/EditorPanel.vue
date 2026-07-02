<template>
  <div class="w-1/2 bg-white border-r shadow-lg flex flex-col h-screen no-print">
    
    <div class="flex border-b sticky top-0 bg-white z-30 text-sm font-bold text-gray-600 shrink-0">
      <button @click="activeTab = 'content'" class="flex-1 py-4 text-center hover:bg-gray-50 transition-colors" :class="activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : ''">📝 内容填写</button>
      <button @click="activeTab = 'global'" class="flex-1 py-4 text-center hover:bg-gray-50 transition-colors" :class="activeTab === 'global' ? 'text-blue-600 border-b-2 border-blue-600' : ''">🎨 全局配置</button>
      <button @click="activeTab = 'module'" class="flex-1 py-4 text-center hover:bg-gray-50 transition-colors" :class="activeTab === 'module' ? 'text-blue-600 border-b-2 border-blue-600' : ''">⚙️ 模块排版</button>
      
      <div class="flex items-center gap-2 px-4 border-l bg-gray-50 shrink-0">
        <label class="cursor-pointer text-[10px] bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded transition-colors shadow-sm flex items-center gap-1 font-bold">
          📂 导入草稿
          <input type="file" accept=".json" class="hidden" @change="handleImportJSON" />
        </label>
        <button @click="exportDraftToJSON" class="text-[10px] bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded transition-colors shadow-sm font-bold flex items-center gap-1">
          💾 导出配置
        </button>
        <button @click="resetDraft" class="text-[10px] bg-red-50 border border-red-100 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded transition-colors shadow-sm font-bold flex items-center gap-1">
          🗑️ 恢复默认
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto overflow-x-hidden block">
      
      <div v-show="activeTab === 'content'" class="min-h-full flex flex-col">
        <div class="flex flex-wrap border-b bg-gray-50 sticky top-0 z-20 p-1 gap-1 shadow-inner shrink-0">
          <button @click="activeSubTab = 'info'" 
            class="px-3 py-2 rounded-md text-[11px] font-bold transition-all border flex items-center gap-1"
            :class="activeSubTab === 'info' ? 'bg-white text-blue-600 border-blue-200 shadow-sm' : 'text-gray-500 border-transparent hover:bg-gray-100'">
            <span class="icon text-xs text-blue-400">👤</span> 基本信息
          </button>
          
          <button v-for="mod in store.modules" :key="mod.id" 
            @click="activeSubTab = mod.id"
            class="px-3 py-2 rounded-md text-[11px] font-bold transition-all border flex items-center gap-1"
            :class="activeSubTab === mod.id ? 'bg-white text-blue-600 border-blue-200 shadow-sm' : 'text-gray-500 border-transparent hover:bg-gray-100'">
            <span v-if="!mod.visible" class="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
            <span class="icon text-xs">{{ mod.icon }}</span> {{ mod.title }}
          </button>
        </div>

        <div class="p-6 flex-1 pb-32">
          <div v-if="activeSubTab === 'info'" class="space-y-6 animate-fadeIn">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">个人资料卡片</h3>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="(label, key) in infoFieldMap" :key="key">
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{{ label }}</label>
                <input v-model="store.info[key]" class="w-full border p-2 rounded text-sm focus:outline-blue-500 transition-all shadow-sm">
              </div>
              <div class="col-span-2 border border-dashed border-gray-300 rounded p-4 bg-gray-50 flex flex-col gap-2 mt-2">
                <label class="text-xs text-gray-500 font-bold flex items-center gap-2">📷 证件照上传 <span class="font-normal text-[10px] text-gray-400">(建议一寸蓝底/白底)</span></label>
                <div class="flex items-center justify-between bg-white p-2 rounded border border-gray-100">
                   <input type="file" accept="image/*" @change="handlePhotoUpload" class="text-xs text-gray-500 cursor-pointer">
                   <button v-if="store.info.photo" @click="store.info.photo = ''" class="text-xs text-red-500 font-bold">移除</button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="animate-fadeIn">
            <div v-for="mod in currentModule ? [currentModule] : []" :key="mod.id" class="space-y-6">
              <div class="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div>
                  <h3 class="text-sm font-bold text-blue-800 flex items-center gap-2">
                    <span class="icon text-lg">{{ mod.icon }}</span> {{ mod.title }}
                  </h3>
                  <p class="text-[10px] text-blue-400 mt-0.5">该模块目前状态为：{{ mod.visible ? '✅ 已在简历展示' : '❌ 已在简历隐藏' }}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer scale-110">
                  <input type="checkbox" v-model="mod.visible" class="sr-only peer">
                  <div class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div v-for="(item, iIdx) in mod.items" :key="iIdx" class="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 relative group shadow-sm">
                <button v-if="!mod.isSingle" @click="mod.items.splice(iIdx, 1)" class="absolute -top-2 -right-2 bg-white border border-red-200 text-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold text-lg hover:bg-red-50">×</button>
                
                <div v-if="!mod.isSingle" class="grid grid-cols-3 gap-3 mb-4">
                  <input v-model="item.p1" class="border p-2 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white" placeholder="主标题 (学校/公司)">
                  <input v-model="item.p2" class="border p-2 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white" placeholder="副标题 (专业/职位)">
                  <input v-model="item.p3" class="border p-2 rounded text-xs focus:ring-1 focus:ring-blue-500 outline-none bg-white" placeholder="时间周期">
                </div>

                <div class="flex items-center gap-1 mb-2 bg-gray-200 p-1.5 rounded-lg border border-gray-300">
                  <button @click="handleUndo('txt-'+mod.id+'-'+iIdx)" title="撤回" :class="btnClass">↶</button>
                  <button @click="handleRedo('txt-'+mod.id+'-'+iIdx)" title="重做" :class="btnClass">↷</button>
                  <div class="w-[1px] h-3 bg-gray-400 mx-1"></div>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '**', '**')" :class="[btnClass, 'font-bold']">B</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '*', '*')" :class="[btnClass, 'italic font-serif']">I</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '【', '】')" :class="btnClass">【标签】</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '- ', '')" :class="btnClass">• 列表</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '\n| 表头 | 表头 |\n|---|---|\n| 内容 | 内容 |\n', '')" :class="[btnClass, 'text-blue-600 font-bold']">⊞ 表格</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '1. ', '')" :class="btnClass">1. 缂栧彿</button>
                </div>

                <p class="mb-2 text-[10px] text-gray-400 font-mono">
                  Tab / Shift+Tab 璋冩暣鍒楄〃灞傜骇锛孍nter 缁х画褰撳墠鍒楄〃
                </p>

                <textarea 
                  :id="'txt-'+mod.id+'-'+iIdx"
                  v-model="item.content" 
                  @keydown.tab.prevent="handleTabKey($event, 'txt-'+mod.id+'-'+iIdx, item)"
                  @keydown.ctrl.b.prevent="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '**', '**')"
                  @keydown.ctrl.i.prevent="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '*', '*')"
                  @keydown.enter="enhancedHandleEnterKey($event, 'txt-'+mod.id+'-'+iIdx, item)"
                  class="w-full border p-3 rounded-lg text-xs h-48 focus:ring-2 focus:ring-blue-100 outline-none font-mono leading-relaxed bg-white shadow-inner" 
                  placeholder="支持完整 Markdown 语法..."
                ></textarea>
              </div>
              
              <button v-if="!mod.isSingle" @click="mod.items.push({ p1:'', p2:'', p3:'', content:'' })" class="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl text-xs hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all font-bold">
                + 添加一项新的 {{ mod.title }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'global'" class="p-6 space-y-8 animate-fadeIn pb-32">
        <section class="space-y-6">
          <div>
            <label class="text-xs font-bold text-gray-500 block mb-3">🎨 主题色系统</label>
            <div class="flex gap-3 items-center">
              <button v-for="color in store.themeOptions" :key="color.value" @click="store.config.themeColor = color.value" :style="{ backgroundColor: color.value }" class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shadow-sm" :class="store.config.themeColor === color.value ? 'border-gray-600 scale-110' : 'border-transparent'"></button>
              <input type="color" v-model="store.config.themeColor" class="w-8 h-8 p-0 border-0 rounded cursor-pointer">
            </div>
          </div>
          
          <div v-for="(val, key) in configRangeMap" :key="key">
            <div class="flex justify-between mb-2">
              <label class="text-xs font-bold text-gray-500">{{ val.label }}</label>
              <span class="text-xs font-mono text-blue-600 font-bold">{{ store.config[key] }}{{ val.unit }}</span>
            </div>
            <input type="range" v-model.number="store.config[key]" :min="val.min" :max="val.max" :step="val.step" class="w-full accent-blue-600">
          </div>

          <div>
            <label class="text-xs font-bold text-gray-500 block mb-4 font-mono uppercase tracking-tighter">📋 页面边距调节 (mm)</label>
            <div class="grid grid-cols-4 gap-3">
              <div v-for="dir in marginDirections" :key="dir">
                <span class="block text-[10px] text-gray-400 mb-1 text-center font-bold">{{ dir.toUpperCase() }}</span>
                <input type="number" v-model.number="store.config.margin[dir]" class="w-full border rounded p-2 text-center text-xs focus:ring-1 focus:ring-blue-500 outline-none">
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-show="activeTab === 'module'" class="p-6 space-y-4 animate-fadeIn pb-32">
        <div v-for="(mod, index) in store.modules" :key="mod.id" 
          class="border rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3 transition-all duration-200"
          :class="dragIndex === index ? 'opacity-40 border-dashed border-blue-400 scale-[0.98]' : 'hover:border-blue-200'"
          draggable="true" @dragstart="handleDragStart(index)" @dragover.prevent @drop="handleDrop(index)" @dragend="handleDragEnd">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <span class="cursor-move text-gray-300 hover:text-blue-500 text-lg">☰</span>
              <span class="font-bold text-sm text-gray-700 flex items-center gap-2">
                <span class="text-lg icon">{{ mod.icon }}</span> {{ mod.title }}
              </span>
            </div>
            <input type="checkbox" v-model="mod.visible" class="accent-blue-600 w-5 h-5 cursor-pointer">
          </div>
          <div v-if="mod.visible && !mod.isSingle" class="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
            <span class="text-[10px] font-bold text-gray-400 uppercase">项目间分割虚线</span>
            <input type="checkbox" v-model="mod.showDivider" class="cursor-pointer accent-blue-600">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// ✨ 引入了刚编写的导出和导入方法
import { ref, computed, nextTick } from 'vue'
import { store, resetDraft, exportDraftToJSON, importDraftFromJSON } from '../store'

if (!store.ui) {
  store.ui = { activeTab: 'content', activeModuleId: 'info' }
}

const activeTab = computed({
  get: () => store.ui?.activeTab || 'content',
  set: (value) => {
    store.ui.activeTab = value
  }
})

const activeSubTab = computed({
  get: () => {
    const currentTab = store.ui?.activeModuleId || 'info'
    return currentTab === 'info' || store.modules.some(mod => mod.id === currentTab) ? currentTab : 'info'
  },
  set: (value) => {
    store.ui.activeModuleId = value
  }
})
const dragIndex = ref(null)

const btnClass = "px-2 py-1 hover:bg-gray-300 rounded text-[10px] font-medium shrink-0 transition-colors text-gray-600 bg-white border border-gray-100 shadow-sm"

const currentModule = computed(() => store.modules.find(m => m.id === activeSubTab.value) ?? store.modules[0] ?? null)
const infoFieldMap = { name: '姓名', intent: '求职意向', phone: '手机', email: '邮箱', github: '社交/博客', degree: '最高学历', location: '城市' }
const marginDirections = ['top', 'bottom', 'left', 'right']

const configRangeMap = {
  nameSize: { label: '姓名文字大小', min: 20, max: 50, step: 1, unit: 'px' },
  avatarScale: { label: '头像缩放倍率', min: 0.5, max: 2.0, step: 0.1, unit: 'x' },
  titleSize: { label: '模块栏标题大小', min: 12, max: 24, step: 1, unit: 'px' },
  titleFontSize: { label: '经历标题字号 (P1/P2/P3)', min: 10, max: 16, step: 0.5, unit: 'px' },
  bodyFontSize: { label: '描述正文字号', min: 9, max: 14, step: 0.5, unit: 'px' },
  lineHeight: { label: '正文行高调节', min: 1.0, max: 2.5, step: 0.1, unit: '' },
  moduleSpacing: { label: '模块间距宽度', min: 0, max: 50, step: 1, unit: 'px' }
}

// ✨ 处理文件导入事件
const getTextareaElement = (id) => document.getElementById(id)

const readFile = (file, mode = 'text') => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = (event) => resolve(event.target?.result ?? '')
  reader.onerror = () => reject(reader.error)

  if (mode === 'dataUrl') {
    reader.readAsDataURL(file)
    return
  }

  reader.readAsText(file)
})

const runHistoryCommand = (textareaId, command) => {
  const el = getTextareaElement(textareaId)
  if (!el) return
  el.focus()
  document.execCommand(command)
}

const handleImportJSON = async (event) => {
  const e = event
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const content = await readFile(file)
    const success = importDraftFromJSON(content)
    if (success) {
      alert('✅ 简历配置与草稿已成功导入！');
    }
    e.target.value = ''; // 清空 input，允许后续重复导入同一文件
  } finally {
    event.target.value = ''
  }
}

const handleUndo = (id) => { runHistoryCommand(id, 'undo') }
const handleRedo = (id) => { runHistoryCommand(id, 'redo') }

const TAB_CHARACTER = '\t'
const orderedListRegex = /^(\s*)((?:\d+\.)*\d+)\.\s+(.*)$/
const bulletListRegex = /^(\s*)([-*+])\s+(.*)$/

const setTextareaValue = (el, item, nextValue, selectionStart, selectionEnd = selectionStart) => {
  item.content = nextValue
  nextTick(() => {
    el.focus()
    el.setSelectionRange(selectionStart, selectionEnd)
  })
}

const getLineRange = (text, start, end = start) => {
  const lineStart = text.lastIndexOf('\n', Math.max(start - 1, 0)) + 1
  const nextNewline = text.indexOf('\n', end)
  const lineEnd = nextNewline === -1 ? text.length : nextNewline
  return { lineStart, lineEnd, lineText: text.slice(lineStart, lineEnd) }
}

const getSelectedLineRange = (text, start, end) => {
  const lineStart = text.lastIndexOf('\n', Math.max(start - 1, 0)) + 1
  const lineEndAnchor = end > start && text[end - 1] === '\n' ? end - 1 : end
  const nextNewline = text.indexOf('\n', lineEndAnchor)
  const lineEnd = nextNewline === -1 ? text.length : nextNewline
  return { lineStart, lineEnd, blockText: text.slice(lineStart, lineEnd) }
}

const replaceSelection = (el, item, replacement, start, end, cursorOffset = replacement.length) => {
  const nextValue = el.value.slice(0, start) + replacement + el.value.slice(end)
  setTextareaValue(el, item, nextValue, start + cursorOffset)
}

const incrementHierarchicalMarker = (marker) => {
  const segments = marker.split('.').map(num => parseInt(num, 10))
  if (!segments.length || segments.some(num => Number.isNaN(num))) return `${marker}.1`
  segments[segments.length - 1] += 1
  return segments.join('.')
}

const handleEnterKey = (event, textareaId, item) => {
  const el = getTextareaElement(textareaId);
  if (!el) return;
  
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value;
  
  // 获取当前行的文本
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = text.indexOf('\n', start) !== -1 ? text.indexOf('\n', start) : text.length;
  const lineText = text.substring(lineStart, lineEnd);
  
  // 检查是否是编号列表（如 "1. "、"2. " 等）
  const numberedListRegex = /^(\s*)(\d+)\.\s+/;
  const match = lineText.match(numberedListRegex);
  
  if (match) {
    // 阻止默认行为
    event.preventDefault();
    
    // 提取缩进、编号并递增
    const indentation = match[1];
    const currentNumber = parseInt(match[2], 10);
    const nextNumber = currentNumber + 1;
    
    // 构建新行内容
    const replacement = '\n' + indentation + nextNumber + '. ';
    
    // 插入新行和新编号
    item.content = text.substring(0, start) + replacement + text.substring(end);
    
    // 设置光标位置到新编号后
    nextTick(() => {
      el.focus();
      const newPosition = start + replacement.length;
      el.setSelectionRange(newPosition, newPosition);
    });
  }
  // 如果不是编号列表，允许默认行为
};

const handleTabKey = (event, textareaId, item) => {
  const el = getTextareaElement(textareaId)
  if (!el) return

  const start = el.selectionStart
  const end = el.selectionEnd
  const text = el.value
  const hasMultiLineSelection = start !== end && text.slice(start, end).includes('\n')
  const { lineStart, lineEnd, blockText } = getSelectedLineRange(text, start, end)
  const { lineText } = getLineRange(text, start, end)
  const shouldIndentLines = hasMultiLineSelection || orderedListRegex.test(lineText) || bulletListRegex.test(lineText)

  if (!shouldIndentLines && !event.shiftKey) {
    replaceSelection(el, item, TAB_CHARACTER, start, end)
    return
  }

  const lines = blockText.split('\n')
  let removedBeforeStart = 0
  const updatedLines = lines.map((line, index) => {
    if (!event.shiftKey) return `${TAB_CHARACTER}${line}`
    if (line.startsWith(TAB_CHARACTER)) {
      if (index === 0) removedBeforeStart = 1
      return line.slice(1)
    }
    if (line.startsWith('  ')) {
      if (index === 0) removedBeforeStart = 2
      return line.slice(2)
    }
    return line
  })

  const replacement = updatedLines.join('\n')
  const nextValue = text.slice(0, lineStart) + replacement + text.slice(lineEnd)
  const selectionDelta = replacement.length - blockText.length
  const nextStart = event.shiftKey ? Math.max(lineStart, start - removedBeforeStart) : start + 1
  const nextEnd = hasMultiLineSelection ? end + selectionDelta : nextStart
  setTextareaValue(el, item, nextValue, nextStart, nextEnd)
}

const enhancedHandleEnterKey = (event, textareaId, item) => {
  const el = getTextareaElement(textareaId)
  if (!el) return

  const start = el.selectionStart
  const end = el.selectionEnd
  const text = el.value
  const { lineText } = getLineRange(text, start, end)

  const orderedMatch = lineText.match(orderedListRegex)
  if (orderedMatch) {
    const [, indentation, marker, content] = orderedMatch
    if (!content.trim()) return
    event.preventDefault()
    replaceSelection(el, item, `\n${indentation}${incrementHierarchicalMarker(marker)}. `, start, end)
    return
  }

  const bulletMatch = lineText.match(bulletListRegex)
  if (bulletMatch) {
    const [, indentation, bullet, content] = bulletMatch
    if (!content.trim()) return
    event.preventDefault()
    replaceSelection(el, item, `\n${indentation}${bullet} `, start, end)
  }
}

const insertMarkdown = (textareaId, item, prefix, suffix) => {
  const el = getTextareaElement(textareaId)
  if (!el) return

  const start = el.selectionStart
  const end = el.selectionEnd
  const replacement = `${prefix}${el.value.slice(start, end)}${suffix}`
  const nextValue = `${el.value.slice(0, start)}${replacement}${el.value.slice(end)}`

  setTextareaValue(el, item, nextValue, start + prefix.length, end + prefix.length)
}

const handleDragStart = (i) => { dragIndex.value = i }
const handleDrop = (i) => {
  if (dragIndex.value === null || dragIndex.value === i) return
  const item = store.modules.splice(dragIndex.value, 1)[0]
  store.modules.splice(i, 0, item)
  dragIndex.value = null
}
const handleDragEnd = () => { dragIndex.value = null }

const handlePhotoUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  store.info.photo = await readFile(file, 'dataUrl')
  event.target.value = ''
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.animate-fadeIn { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
