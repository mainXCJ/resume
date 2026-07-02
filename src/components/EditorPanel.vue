<template>
  <div class="w-1/2 bg-white shadow-sm flex flex-col h-screen no-print">

    <div class="flex border-b bg-white sticky top-0 z-30 shrink-0">
      <button @click="activeTab = 'content'" class="flex-1 py-3.5 text-center text-xs font-bold transition-all relative"
        :class="activeTab === 'content' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'">
        <span class="flex items-center justify-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          编辑内容
        </span>
        <div v-if="activeTab === 'content'" class="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
          :style="{ background: store.config.themeColor }"></div>
      </button>
      <button @click="activeTab = 'template'" class="flex-1 py-3.5 text-center text-xs font-bold transition-all relative"
        :class="activeTab === 'template' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'">
        <span class="flex items-center justify-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
          模板
        </span>
        <div v-if="activeTab === 'template'" class="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
          :style="{ background: store.config.themeColor }"></div>
      </button>
      <button @click="activeTab = 'global'" class="flex-1 py-3.5 text-center text-xs font-bold transition-all relative"
        :class="activeTab === 'global' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'">
        <span class="flex items-center justify-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          样式
        </span>
        <div v-if="activeTab === 'global'" class="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
          :style="{ background: store.config.themeColor }"></div>
      </button>
      <button @click="activeTab = 'module'" class="flex-1 py-3.5 text-center text-xs font-bold transition-all relative"
        :class="activeTab === 'module' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'">
        <span class="flex items-center justify-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          模块
        </span>
        <div v-if="activeTab === 'module'" class="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
          :style="{ background: store.config.themeColor }"></div>
      </button>

      <div class="flex items-center gap-1.5 px-3 border-l bg-gray-50 shrink-0">
        <button @click="exportDraftToJSON" class="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1"
          :style="{ color: store.config.themeColor, background: store.config.themeColor + '12' }">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          导出
        </button>
        <label class="cursor-pointer text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1"
          :style="{ color: store.config.themeColor, background: store.config.themeColor + '12' }">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          导入
          <input type="file" accept=".json" class="hidden" @change="handleImportJSON" />
        </label>
        <button @click="resetDraft" class="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto overflow-x-hidden block">

      <div v-show="activeTab === 'content'" class="min-h-full flex flex-col">
        <div class="flex flex-wrap border-b bg-white sticky top-0 z-20 px-3 py-2 gap-1 shrink-0">
          <button @click="activeSubTab = 'info'"
            class="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5"
            :class="activeSubTab === 'info' ? 'shadow-sm border' : 'text-gray-400 hover:text-gray-600'"
            :style="activeSubTab === 'info' ? { color: store.config.themeColor, borderColor: store.config.themeColor + '33', background: store.config.themeColor + '08' } : {}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            基本信息
          </button>

          <button v-for="mod in store.modules" :key="mod.id"
            @click="activeSubTab = mod.id"
            class="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5"
            :class="activeSubTab === mod.id ? 'shadow-sm border' : 'text-gray-400 hover:text-gray-600'"
            :style="activeSubTab === mod.id ? { color: store.config.themeColor, borderColor: store.config.themeColor + '33', background: store.config.themeColor + '08' } : {}">
            <span v-if="!mod.visible" class="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span class="icon text-xs">{{ mod.icon }}</span>
            {{ mod.title }}
          </button>
        </div>

        <div class="p-5 flex-1 pb-32">
          <div v-if="activeSubTab === 'info'" class="space-y-5 animate-fadeIn">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              个人资料
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="(label, key) in infoFieldMap" :key="key">
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">{{ label }}</label>
                <input v-model="store.info[key]"
                  class="w-full border border-gray-200 bg-white px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all shadow-sm"
                  @focus="e => e.target.style.borderColor = store.config.themeColor"
                  @blur="e => e.target.style.borderColor = ''">
              </div>
              <div class="col-span-2 border border-dashed border-gray-200 rounded-xl p-4 bg-white flex flex-col gap-3 mt-1">
                <label class="text-xs text-gray-500 font-bold flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  证件照 <span class="font-normal text-[10px] text-gray-400">(建议一寸蓝底/白底)</span>
                </label>
                <div class="flex items-center justify-between bg-white px-3 py-2.5 rounded-lg border border-gray-100">
                  <input type="file" accept="image/*" @change="handlePhotoUpload" class="text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:cursor-pointer"
                    :style="{ '--file-color': store.config.themeColor }">
                  <button v-if="store.info.photo" @click="store.info.photo = ''" class="text-xs font-bold px-2.5 py-1 rounded-lg transition-colors text-red-500 hover:bg-red-50">移除</button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="animate-fadeIn">
            <div v-for="mod in currentModule ? [currentModule] : []" :key="mod.id" class="space-y-5">
              <div class="flex justify-between items-center p-4 rounded-xl border"
                :style="{ background: store.config.themeColor + '06', borderColor: store.config.themeColor + '18' }">
                <div>
                  <h3 class="text-sm font-bold flex items-center gap-2" :style="{ color: store.config.themeColor }">
                    <span class="icon text-lg">{{ mod.icon }}</span> {{ mod.title }}
                  </h3>
                  <p class="text-[10px] mt-0.5" :style="{ color: store.config.themeColor + '88' }">
                    {{ mod.visible ? '✅ 已在简历展示' : '❌ 在简历中隐藏' }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="mod.visible" class="sr-only peer">
                  <div class="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"
                    :class="`peer-checked:bg-[${store.config.themeColor}]`"></div>
                </label>
              </div>

              <div v-for="(item, iIdx) in mod.items" :key="iIdx" class="bg-white p-4 rounded-xl border border-gray-100 mb-4 relative group shadow-sm hover:shadow-md transition-shadow">
                <button v-if="!mod.isSingle" @click="mod.items.splice(iIdx, 1)" class="absolute -top-2 -right-2 bg-white border border-red-200 text-red-500 rounded-full w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10 font-bold text-lg hover:bg-red-50">×</button>

                <div v-if="!mod.isSingle" class="grid grid-cols-3 gap-2.5 mb-3">
                  <input v-model="item.p1" class="border border-gray-200 bg-white px-2.5 py-2 rounded-lg text-xs focus:outline-none transition-all shadow-sm" placeholder="主标题 (学校/公司)">
                  <input v-model="item.p2" class="border border-gray-200 bg-white px-2.5 py-2 rounded-lg text-xs focus:outline-none transition-all shadow-sm" placeholder="副标题 (专业/职位)">
                  <input v-model="item.p3" class="border border-gray-200 bg-white px-2.5 py-2 rounded-lg text-xs focus:outline-none transition-all shadow-sm" placeholder="时间周期">
                </div>

                <div class="flex items-center gap-0.5 mb-2 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                  <button @click="handleUndo('txt-'+mod.id+'-'+iIdx)" title="撤回" class="px-2 py-1 hover:bg-white rounded text-[10px] font-medium transition-colors text-gray-500">↶</button>
                  <button @click="handleRedo('txt-'+mod.id+'-'+iIdx)" title="重做" class="px-2 py-1 hover:bg-white rounded text-[10px] font-medium transition-colors text-gray-500">↷</button>
                  <div class="w-px h-4 bg-gray-300 mx-0.5"></div>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '**', '**')" class="px-2 py-1 hover:bg-white rounded text-[10px] font-bold transition-colors text-gray-600">B</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '*', '*')" class="px-2 py-1 hover:bg-white rounded text-[10px] italic font-serif transition-colors text-gray-600">I</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '【', '】')" class="px-2 py-1 hover:bg-white rounded text-[10px] transition-colors text-gray-500">【】</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '- ', '')" class="px-2 py-1 hover:bg-white rounded text-[10px] transition-colors text-gray-500">•</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '\n| 表头 | 表头 |\n|---|---|\n| 内容 | 内容 |\n', '')" class="px-2 py-1 hover:bg-white rounded text-[10px] font-bold transition-colors text-gray-500">⊞</button>
                  <button @click="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '1. ', '')" class="px-2 py-1 hover:bg-white rounded text-[10px] transition-colors text-gray-500">1.</button>
                </div>

                <p class="mb-2 text-[9px] text-gray-300 font-mono">Tab 缩进 · Shift+Tab 减少缩进 · Enter 继续列表 · Ctrl+B 加粗 · Ctrl+I 斜体</p>

                <textarea
                  :id="'txt-'+mod.id+'-'+iIdx"
                  v-model="item.content"
                  @keydown.tab.prevent="handleTabKey($event, 'txt-'+mod.id+'-'+iIdx, item)"
                  @keydown.ctrl.b.prevent="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '**', '**')"
                  @keydown.ctrl.i.prevent="insertMarkdown('txt-'+mod.id+'-'+iIdx, item, '*', '*')"
                  @keydown.enter="enhancedHandleEnterKey($event, 'txt-'+mod.id+'-'+iIdx, item)"
                  class="w-full border border-gray-200 bg-white p-3 rounded-lg text-xs h-44 focus:outline-none transition-all shadow-sm font-mono leading-relaxed resize-vertical"
                  placeholder="支持 Markdown 语法...&#10;&#10;例:&#10;- 负责某某系统的设计与开发&#10;- 使用 **技术栈** 实现了某某功能&#10;1. 第一步&#10;2. 第二步"
                ></textarea>
              </div>

              <button v-if="!mod.isSingle" @click="mod.items.push({ p1:'', p2:'', p3:'', content:'' })"
                class="w-full py-3 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl text-xs font-bold hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                添加一项
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ 模板选择标签 ============ -->
      <div v-show="activeTab === 'template'" class="p-5 animate-fadeIn pb-32">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
          选择模板
        </h3>
        <p class="text-[11px] text-gray-400 mb-4 ml-6">切换模板会自动调整配色和排版参数，简历内容不受影响。</p>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="tpl in TEMPLATES"
            :key="tpl.id"
            @click="switchTemplate(tpl.id)"
            class="border-2 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md"
            :class="store.template === tpl.id ? 'shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'"
            :style="store.template === tpl.id ? { borderColor: store.config.themeColor + '66', background: store.config.themeColor + '06' } : {}"
          >
            <div class="flex items-start justify-between mb-2">
              <span class="text-3xl">{{ tpl.preview }}</span>
              <span v-if="store.template === tpl.id"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                :style="{ background: store.config.themeColor }">使用中</span>
            </div>
            <div class="font-bold text-sm text-gray-800">{{ tpl.name }}</div>
            <div class="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{{ tpl.desc }}</div>
          </button>
        </div>
      </div>

      <div v-show="activeTab === 'global'" class="p-5 animate-fadeIn pb-32">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          全局样式
        </h3>

        <section class="space-y-6">
          <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <label class="text-xs font-bold text-gray-500 block mb-3">🎨 主题色</label>
            <div class="flex gap-3 items-center">
              <button v-for="color in store.themeOptions" :key="color.value" @click="store.config.themeColor = color.value"
                :style="{ backgroundColor: color.value }"
                class="w-7 h-7 rounded-full border-2 transition-all hover:scale-110 shadow-sm"
                :class="store.config.themeColor === color.value ? 'border-gray-800 scale-110 ring-2 ring-offset-2' : 'border-transparent'">
              </button>
              <input type="color" v-model="store.config.themeColor" class="w-7 h-7 p-0 border-0 rounded cursor-pointer">
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-4">
            <label class="text-xs font-bold text-gray-500 block">📏 排版调节</label>
            <div v-for="(val, key) in configRangeMap" :key="key">
              <div class="flex justify-between mb-1.5">
                <label class="text-[11px] text-gray-500">{{ val.label }}</label>
                <span class="text-[11px] font-mono font-bold" :style="{ color: store.config.themeColor }">{{ store.config[key] }}{{ val.unit }}</span>
              </div>
              <input type="range" v-model.number="store.config[key]" :min="val.min" :max="val.max" :step="val.step" class="w-full accent-blue-600 h-1.5 rounded-full appearance-none bg-gray-200 cursor-pointer"
                :style="{ accentColor: store.config.themeColor }">
            </div>
          </div>

          <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <label class="text-xs font-bold text-gray-500 block mb-3">📋 页面边距 (mm)</label>
            <div class="grid grid-cols-4 gap-2">
              <div v-for="dir in marginDirections" :key="dir">
                <span class="block text-[9px] text-gray-400 mb-1 text-center font-bold uppercase">{{ dir }}</span>
                <input type="number" v-model.number="store.config.margin[dir]"
                  class="w-full border border-gray-200 rounded-lg p-2 text-center text-xs focus:outline-none bg-white"
                  @focus="e => e.target.style.borderColor = store.config.themeColor"
                  @blur="e => e.target.style.borderColor = ''">
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-show="activeTab === 'module'" class="p-5 animate-fadeIn pb-32">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          模块排版
        </h3>
        <p class="text-[11px] text-gray-400 mb-4 ml-6">拖拽排序 · 切换显示/隐藏</p>
        <div class="space-y-2">
          <div v-for="(mod, index) in store.modules" :key="mod.id"
            class="border rounded-xl px-4 py-3 bg-white shadow-sm flex items-center justify-between transition-all duration-200"
            :class="dragIndex === index ? 'opacity-40 border-dashed border-blue-400 scale-[0.98]' : 'hover:border-gray-200 hover:shadow-md'"
            draggable="true" @dragstart="handleDragStart(index)" @dragover.prevent @drop="handleDrop(index)" @dragend="handleDragEnd">
            <div class="flex items-center gap-3">
              <span class="cursor-grab text-gray-300 hover:text-gray-500 text-base select-none">⠿</span>
              <span class="icon text-base" :style="{ color: mod.visible ? store.config.themeColor : '#ccc' }">{{ mod.icon }}</span>
              <span class="font-bold text-sm" :class="mod.visible ? 'text-gray-700' : 'text-gray-300'">{{ mod.title }}</span>
            </div>
            <div class="flex items-center gap-3">
              <div v-if="mod.visible && !mod.isSingle" class="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span>分割线</span>
                <input type="checkbox" v-model="mod.showDivider" class="cursor-pointer accent-blue-600 w-3.5 h-3.5">
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="mod.visible" class="sr-only peer">
                <div class="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all"
                  :class="mod.visible ? `after:bg-[${store.config.themeColor}]` : ''"></div>
              </label>
            </div>
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
import { TEMPLATES } from '../templates.js'

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
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const content = await readFile(file)
    const success = importDraftFromJSON(content)
    // 导入成功后刷新页面让所有状态同步
    if (success) {
      event.target.value = ''
      window.location.reload()
    }
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

const switchTemplate = (templateId) => {
  store.template = templateId
  const tpl = TEMPLATES.find(t => t.id === templateId)
  if (tpl) {
    Object.assign(store.config, {
      nameSize: tpl.config.nameSize,
      titleSize: tpl.config.titleSize,
      titleFontSize: tpl.config.titleFontSize,
      bodyFontSize: tpl.config.bodyFontSize,
      lineHeight: tpl.config.lineHeight,
      moduleSpacing: tpl.config.moduleSpacing,
    })
    store.config.margin = { ...tpl.config.margin }
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.animate-fadeIn { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
