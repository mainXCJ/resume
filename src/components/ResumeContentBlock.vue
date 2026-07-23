<template>
  <div class="resume-content-block" :data-block-type="block.type">
  <!-- ==================== 侧栏模板 (sidebar) ==================== -->
  <template v-if="store.template === 'sidebar'">
    <!-- 侧栏 - 个人信息 -->
    <div v-if="block.type === 'sidebar-info'" :data-block-id="blockId"
      class="sidebar-section"
      :style="{ padding: '20px 16px' }"
    >
      <!-- 头像 -->
      <div class="flex justify-center mb-5">
        <div class="w-[90px] h-[90px] rounded-full border-2 overflow-hidden flex items-center justify-center"
          :style="{ borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }"
        >
          <img v-if="store.info.photo" :src="store.info.photo"
            class="w-full h-full object-cover"
            :style="{ transform: `scale(${store.config.avatarScale})` }"
          />
          <span v-else class="text-3xl opacity-40">👤</span>
        </div>
      </div>

      <!-- 姓名 -->
      <h1 class="text-center font-bold text-white mb-1"
        :style="{ fontSize: store.config.nameSize + 'px' }">
        {{ store.info.name }}
      </h1>
      <p class="text-center text-white/80 text-sm font-medium mb-4">
        {{ store.info.intent }}
      </p>

      <!-- 联系方式 -->
      <div class="space-y-3 text-white/85 text-xs">
        <div v-if="store.info.phone" class="flex items-center gap-2">
          <span class="w-5 text-center text-white/60">📞</span>
          <span>{{ store.info.phone }}</span>
        </div>
        <div v-if="store.info.email" class="flex items-center gap-2">
          <span class="w-5 text-center text-white/60">✉️</span>
          <span class="break-all">{{ store.info.email }}</span>
        </div>
        <div v-if="store.info.degree" class="flex items-center gap-2">
          <span class="w-5 text-center text-white/60">🎓</span>
          <span>{{ store.info.degree }}</span>
        </div>
        <div v-if="store.info.location" class="flex items-center gap-2">
          <span class="w-5 text-center text-white/60">📍</span>
          <span>{{ store.info.location }}</span>
        </div>
        <div v-if="store.info.github" class="flex items-center gap-2">
          <span class="w-5 text-center text-white/60">🔗</span>
          <span class="truncate">{{ store.info.github }}</span>
        </div>
      </div>
    </div>

    <!-- 侧栏中的模块 -->
    <div v-else-if="block.type === 'sidebar-module-title'"
      :data-block-id="blockId">
      <h3 class="text-white/90 font-bold text-xs uppercase tracking-wider px-4"
        :style="{ paddingTop: block.isFirst ? '4px' : '20px', paddingBottom: '8px' }">
        {{ block.mod.title }}
      </h3>
    </div>

    <div v-else-if="block.type === 'sidebar-item'"
      :data-block-id="blockId"
      class="px-4 text-white/80 text-[10px] leading-relaxed mb-1">
      <div v-html="renderRichText(block.item.content)"></div>
      <div v-if="block.showDivider" class="border-t my-2"
        :style="{ borderColor: 'rgba(255,255,255,0.15)' }"></div>
    </div>

    <!-- 主内容区 - 模块标题 -->
    <div v-else-if="block.type === 'main-module-title'"
      :data-block-id="blockId"
      class="flex items-center gap-2 mb-2 mt-1"
    >
      <div class="w-1 h-4 rounded-full"
        :style="{ background: store.config.themeColor }"></div>
      <h3 class="font-bold tracking-wider"
        :style="{
          color: store.config.themeColor,
          fontSize: store.config.titleSize + 'px'
        }">
        {{ block.mod.title }}
      </h3>
    </div>

    <!-- 主内容区 - 项目标题 -->
    <div v-else-if="block.type === 'main-item-heading'"
      :data-block-id="blockId"
      class="flex justify-between items-baseline mb-1 mt-1"
      :style="{ fontSize: store.config.titleFontSize + 'px' }"
    >
      <span class="font-bold text-gray-800">{{ block.item.p1 }}</span>
      <span class="text-gray-600 text-right">{{ block.item.p2 }}</span>
      <span class="text-gray-400 text-xs ml-2 whitespace-nowrap">{{ block.item.p3 }}</span>
    </div>

    <!-- 主内容区 - 项目内容 -->
    <div v-else-if="block.type === 'main-item-content'"
      :data-block-id="blockId"
      class="text-gray-700"
      :style="{ fontSize: store.config.bodyFontSize + 'px' }"
      v-html="renderRichText(block.content)"
    ></div>

    <div v-else-if="block.type === 'main-spacing'"
      :data-block-id="blockId"
      :style="{ height: block.height + 'px' }"
    ></div>
  </template>

  <!-- ==================== 极简模板 (minimal) ==================== -->
  <template v-else-if="store.template === 'minimal'">
    <header v-if="block.type === 'header'"
      :data-block-id="blockId"
      class="flex flex-col items-center text-center pb-4 mb-4"
      :style="{ borderBottom: '1px solid #ddd' }"
    >
      <!-- 头像 -->
      <div class="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 mx-auto flex items-center justify-center"
        :style="{ borderColor: store.config.themeColor + '33' }"
      >
        <img v-if="store.info.photo" :src="store.info.photo" class="w-full h-full object-cover"
          :style="{ transform: `scale(${store.config.avatarScale})` }"
        />
        <div v-else class="flex flex-col items-center justify-center text-gray-300 w-full h-full"
          :style="{ backgroundColor: `${store.config.themeColor}08` }">
          <span class="icon text-lg leading-none" :style="{ color: `${store.config.themeColor}44` }">&#xf030;</span>
        </div>
      </div>

      <h1 class="font-light tracking-widest text-gray-800"
        :style="{ fontSize: store.config.nameSize + 'px' }">
        {{ store.info.name }}
      </h1>
      <p class="text-gray-500 mt-1 mb-2 font-medium"
        :style="{ fontSize: (store.config.titleFontSize + 2) + 'px' }">
        {{ store.info.intent }}
      </p>

      <!-- 联系方式 - 内联圆点分隔 -->
      <div class="flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-400"
        :style="{ fontSize: (store.config.bodyFontSize - 0.5) + 'px' }"
      >
        <span v-if="store.info.phone">📞 {{ store.info.phone }}</span>
        <span v-if="store.info.email">✉️ {{ store.info.email }}</span>
        <span v-if="store.info.location">📍 {{ store.info.location }}</span>
        <span v-if="store.info.degree">🎓 {{ store.info.degree }}</span>
        <span v-if="store.info.github">🔗 {{ store.info.github }}</span>
      </div>
    </header>

    <div v-else-if="block.type === 'module-title'"
      :data-block-id="blockId"
      class="mb-1 mt-2 pt-2"
      :style="{ borderTop: '2px solid #eee' }"
    >
      <h2 class="font-bold text-gray-700 tracking-widest uppercase text-xs"
        :style="{ color: store.config.themeColor }">
        {{ block.mod.title }}
      </h2>
    </div>

    <div v-else-if="block.type === 'item-heading'"
      :data-block-id="blockId"
      class="flex flex-col mb-0.5 mt-1"
    >
      <div class="flex justify-between items-baseline">
        <span class="font-bold text-gray-700 text-sm">{{ block.item.p1 }}</span>
        <span class="text-gray-400 text-xs">{{ block.item.p3 }}</span>
      </div>
      <span class="text-gray-500 text-xs">{{ block.item.p2 }}</span>
    </div>

    <div v-else-if="block.type === 'item-content'"
      :data-block-id="blockId"
      class="text-gray-600 leading-relaxed"
      :style="{ fontSize: store.config.bodyFontSize + 'px' }"
      v-html="renderRichText(block.content)"
    ></div>

    <hr v-else-if="block.type === 'divider'"
      :data-block-id="blockId"
      class="border-t my-1"
      :style="{ borderColor: '#eeeeee' }"
    />

    <div v-else-if="block.type === 'spacing'"
      :data-block-id="blockId"
      :style="{ height: block.height + 'px' }"
    ></div>

    <div v-else :data-block-id="blockId">
      <div class="text-gray-600 leading-relaxed"
        :style="{ fontSize: store.config.bodyFontSize + 'px' }"
        v-html="renderRichText(block.item.content)"
      ></div>
    </div>
  </template>

  <!-- ==================== 优雅暖棕模板 (elegant) ==================== -->
  <template v-else-if="store.template === 'elegant'">
    <header v-if="block.type === 'header'"
      :data-block-id="blockId"
      class="flex items-stretch gap-4 pb-4 mb-3"
      :style="{ borderBottom: '2px solid ' + store.config.themeColor }"
    >
      <div class="flex-1">
        <div class="flex items-start gap-4">
          <div>
            <h1 class="font-semibold tracking-wide text-gray-800"
              :style="{ fontSize: store.config.nameSize + 'px', color: store.config.themeColor }">
              {{ store.info.name }}
            </h1>
            <p class="text-gray-600 mt-1 font-medium"
              :style="{ fontSize: (store.config.titleFontSize + 2) + 'px' }">
              {{ store.info.intent }}
            </p>
          </div>

          <div class="shrink-0">
            <div class="w-20 h-20 rounded-2xl overflow-hidden border-2 flex items-center justify-center"
              :style="{ borderColor: store.config.themeColor + '33' }">
              <img v-if="store.info.photo" :src="store.info.photo" class="w-full h-full object-cover"
                :style="{ transform: `scale(${store.config.avatarScale})` }"
              />
              <div v-else class="flex flex-col items-center justify-center text-gray-300 w-full h-full"
                :style="{ backgroundColor: `${store.config.themeColor}08` }">
                <span class="icon text-2xl leading-none" :style="{ color: `${store.config.themeColor}44` }">&#xf030;</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
          <span v-if="store.info.phone" class="flex items-center gap-1">📞 {{ store.info.phone }}</span>
          <span v-if="store.info.email" class="flex items-center gap-1">✉️ {{ store.info.email }}</span>
          <span v-if="store.info.degree" class="flex items-center gap-1">🎓 {{ store.info.degree }}</span>
          <span v-if="store.info.location" class="flex items-center gap-1">📍 {{ store.info.location }}</span>
          <span v-if="store.info.github" class="flex items-center gap-1">🔗 {{ store.info.github }}</span>
        </div>
      </div>
    </header>

    <div v-else-if="block.type === 'module-title'"
      :data-block-id="blockId"
      class="mb-2 mt-1"
    >
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-bold"
        :style="{ background: store.config.themeColor }">
        <span>{{ block.mod.icon }}</span>
        <span>{{ block.mod.title }}</span>
      </div>
    </div>

    <div v-else-if="block.type === 'item-heading'"
      :data-block-id="blockId"
      class="flex justify-between items-baseline mb-1 mt-2 px-1"
      :style="{ fontSize: store.config.titleFontSize + 'px' }"
    >
      <span class="font-bold text-gray-800">{{ block.item.p1 }}</span>
      <span class="text-gray-500">{{ block.item.p2 }}</span>
      <span class="text-gray-400 text-xs">{{ block.item.p3 }}</span>
    </div>

    <div v-else-if="block.type === 'item-content'"
      :data-block-id="blockId"
      class="text-gray-700 leading-relaxed px-1 py-2 rounded-lg"
      :style="{
        fontSize: store.config.bodyFontSize + 'px',
        background: store.config.themeColor + '06',
      }"
      v-html="renderRichText(block.content)"
    ></div>

    <hr v-else-if="block.type === 'divider'"
      :data-block-id="blockId"
      class="border-t my-2"
      :style="{ borderColor: store.config.themeColor + '22', borderStyle: 'dotted' }"
    />

    <div v-else-if="block.type === 'spacing'"
      :data-block-id="blockId"
      :style="{ height: block.height + 'px' }"
    ></div>

    <div v-else :data-block-id="blockId"
      class="px-1 py-2 rounded-lg"
      :style="{ background: store.config.themeColor + '06' }"
    >
      <div v-if="!block.mod.isSingle && (block.item.p1 || block.item.p2 || block.item.p3)"
        class="flex justify-between font-bold text-gray-800 mb-1"
        :style="{ fontSize: store.config.titleFontSize + 'px' }"
      >
        <span>{{ block.item.p1 }}</span>
        <span class="text-gray-500 font-normal">{{ block.item.p2 }}</span>
        <span class="text-gray-400 text-xs font-normal">{{ block.item.p3 }}</span>
      </div>
      <div class="text-gray-700" :style="{ fontSize: store.config.bodyFontSize + 'px' }"
        v-html="renderRichText(block.item.content)">
      </div>
    </div>
  </template>

  <!-- ==================== 时间线式模板 (timeline) ==================== -->
  <template v-else-if="store.template === 'timeline'">
    <header v-if="block.type === 'header'"
      :data-block-id="blockId"
      class="flex items-stretch gap-4 pb-3 mb-2"
      :style="{ borderBottom: '2px solid ' + store.config.themeColor }"
    >
      <div class="flex-[1.15] flex flex-col justify-between min-w-0">
        <h1 class="font-bold tracking-wide leading-none"
          :style="{ color: store.config.themeColor, fontSize: store.config.nameSize + 'px' }">
          {{ store.info.name }}
        </h1>
        <p class="text-gray-700 font-medium mt-1"
          :style="{ fontSize: (store.config.titleFontSize + 1.5) + 'px' }">
          {{ store.info.intent }}
        </p>
      </div>
      <div class="min-w-0 text-right text-gray-500 text-xs leading-relaxed"
        :style="{ fontSize: store.config.titleFontSize + 'px' }">
        <div v-if="store.info.phone">{{ store.info.phone }}</div>
        <div v-if="store.info.email">{{ store.info.email }}</div>
        <div v-if="store.info.degree">{{ store.info.degree }}</div>
        <div v-if="store.info.location">{{ store.info.location }}</div>
      </div>
      <div class="w-16 h-16 shrink-0 rounded overflow-hidden flex items-center justify-center border"
        :style="{ borderColor: store.config.themeColor + '33' }">
        <img v-if="store.info.photo" :src="store.info.photo" class="w-full h-full object-cover"
          :style="{ transform: `scale(${store.config.avatarScale})` }"
        />
        <div v-else class="flex flex-col items-center justify-center w-full h-full"
          :style="{ backgroundColor: `${store.config.themeColor}08` }">
          <span class="icon text-lg leading-none" :style="{ color: `${store.config.themeColor}44` }">&#xf030;</span>
        </div>
      </div>
    </header>

    <!-- 模块标题 - 时间线风格 -->
    <div v-else-if="block.type === 'module-title'"
      :data-block-id="blockId"
      class="flex items-center gap-3 mb-2 mt-1"
    >
      <div class="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
        :style="{ background: store.config.themeColor }">
        <span class="text-white text-[10px]">{{ block.mod.icon }}</span>
      </div>
      <h2 class="font-bold tracking-wider"
        :style="{ color: store.config.themeColor, fontSize: store.config.titleSize + 'px' }">
        {{ block.mod.title }}
      </h2>
    </div>

    <!-- 项目标题 - 时间线风格 -->
    <div v-else-if="block.type === 'item-heading'"
      :data-block-id="blockId"
      class="flex items-baseline gap-2 mb-0.5 mt-1 ml-7"
      :style="{ fontSize: store.config.titleFontSize + 'px' }"
    >
      <div class="w-2 h-2 rounded-full shrink-0"
        :style="{ background: store.config.themeColor }"></div>
      <span class="font-bold text-gray-800">{{ block.item.p1 }}</span>
      <span class="text-gray-500">{{ block.item.p2 }}</span>
      <span class="text-gray-400 ml-auto text-xs">{{ block.item.p3 }}</span>
    </div>

    <div v-else-if="block.type === 'item-content'"
      :data-block-id="blockId"
      class="text-gray-700 ml-7 pl-4"
      :style="{
        fontSize: store.config.bodyFontSize + 'px',
        borderLeft: '1.5px solid ' + store.config.themeColor + '33',
      }"
      v-html="renderRichText(block.content)"
    ></div>

    <div v-else-if="block.type === 'spacing'"
      :data-block-id="blockId"
      :style="{ height: block.height + 'px' }"
    ></div>

    <div v-else :data-block-id="blockId" class="last:mb-0" :style="{ marginBottom: block.marginBottom + 'px' }">
      <div v-if="!block.mod.isSingle && (block.item.p1 || block.item.p2 || block.item.p3)"
        class="flex items-baseline gap-2 mb-0.5 ml-7"
        :style="{ fontSize: store.config.titleFontSize + 'px' }">
        <div class="w-2 h-2 rounded-full shrink-0"
          :style="{ background: store.config.themeColor }"></div>
        <span class="font-bold text-gray-800">{{ block.item.p1 }}</span>
        <span class="text-gray-500">{{ block.item.p2 }}</span>
        <span class="text-gray-400 ml-auto text-xs">{{ block.item.p3 }}</span>
      </div>
      <div class="text-gray-700 ml-7 pl-4"
        :style="{
          fontSize: store.config.bodyFontSize + 'px',
          borderLeft: '1.5px solid ' + store.config.themeColor + '33',
        }"
        v-html="renderRichText(block.item.content)"></div>
    </div>
  </template>

  <!-- ==================== 紧凑资讯模板 (compact) ==================== -->
  <template v-else-if="store.template === 'compact'">
    <header v-if="block.type === 'header'"
      :data-block-id="blockId"
      class="pb-2 mb-2"
      :style="{ borderBottom: '1px solid ' + store.config.themeColor }"
    >
      <div class="flex items-end justify-between">
        <div class="flex-1">
          <h1 class="font-bold tracking-tight"
            :style="{ color: store.config.themeColor, fontSize: store.config.nameSize + 'px' }">
            {{ store.info.name }}
          </h1>
          <p class="text-gray-600 font-medium"
            :style="{ fontSize: (store.config.titleFontSize + 1) + 'px' }">
            {{ store.info.intent }}
          </p>
        </div>
        <div class="w-14 h-14 shrink-0 rounded overflow-hidden flex items-center justify-center border ml-3"
          :style="{ borderColor: store.config.themeColor + '33' }">
          <img v-if="store.info.photo" :src="store.info.photo" class="w-full h-full object-cover"
            :style="{ transform: `scale(${store.config.avatarScale})` }"
          />
          <div v-else class="flex flex-col items-center justify-center w-full h-full"
            :style="{ backgroundColor: `${store.config.themeColor}08` }">
            <span class="icon text-base leading-none" :style="{ color: `${store.config.themeColor}44` }">&#xf030;</span>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-gray-500 text-[10px]">
        <span v-if="store.info.phone">📞 {{ store.info.phone }}</span>
        <span v-if="store.info.email">✉️ {{ store.info.email }}</span>
        <span v-if="store.info.degree">🎓 {{ store.info.degree }}</span>
        <span v-if="store.info.location">📍 {{ store.info.location }}</span>
        <span v-if="store.info.github">🔗 {{ store.info.github }}</span>
      </div>
    </header>

    <div v-else-if="block.type === 'module-title'"
      :data-block-id="blockId"
      class="font-bold text-xs tracking-wider mb-1 mt-1"
      :style="{
        color: '#fff',
        background: store.config.themeColor,
        padding: '3px 8px',
        borderRadius: '2px',
      }">
      {{ block.mod.title }}
    </div>

    <div v-else-if="block.type === 'item-heading'"
      :data-block-id="blockId"
      class="flex items-baseline gap-2 text-gray-800"
      :style="{ fontSize: store.config.titleFontSize + 'px' }"
    >
      <span class="font-bold">{{ block.item.p1 }}</span>
      <span class="text-gray-500 text-xs">{{ block.item.p2 }}</span>
      <span class="text-gray-400 text-[10px] ml-auto">{{ block.item.p3 }}</span>
    </div>

    <div v-else-if="block.type === 'item-content'"
      :data-block-id="blockId"
      class="text-gray-700"
      :style="{ fontSize: store.config.bodyFontSize + 'px' }"
      v-html="renderRichText(block.content)"
    ></div>

    <div v-else-if="block.type === 'spacing'"
      :data-block-id="blockId"
      :style="{ height: block.height + 'px' }"
    ></div>

    <div v-else :data-block-id="blockId" class="last:mb-0" :style="{ marginBottom: block.marginBottom + 'px' }">
      <div v-if="!block.mod.isSingle && (block.item.p1 || block.item.p2 || block.item.p3)"
        class="flex items-baseline gap-2"
        :style="{ fontSize: store.config.titleFontSize + 'px' }">
        <span class="font-bold text-gray-800">{{ block.item.p1 }}</span>
        <span class="text-gray-500 text-xs">{{ block.item.p2 }}</span>
        <span class="text-gray-400 text-[10px] ml-auto">{{ block.item.p3 }}</span>
      </div>
      <div class="text-gray-700" :style="{ fontSize: store.config.bodyFontSize + 'px' }"
        v-html="renderRichText(block.item.content)"></div>
    </div>
  </template>

  <!-- ==================== 清新绿意模板 (fresh) ==================== -->
  <template v-else-if="store.template === 'fresh'">
    <header v-if="block.type === 'header'"
      :data-block-id="blockId"
      class="flex items-stretch gap-4 pb-3 mb-3 rounded-2xl"
      :style="{ background: `linear-gradient(135deg, ${store.config.themeColor}12 0%, #f0faf4 100%)`, borderBottom: '2px solid ' + store.config.themeColor + '44' }"
    >
      <div class="flex-1 min-w-0 p-3">
        <h1 class="font-bold leading-tight" :style="{ color: store.config.themeColor, fontSize: store.config.nameSize + 'px' }">
          {{ store.info.name }}
        </h1>
        <p class="text-gray-600 font-medium mt-1" :style="{ fontSize: (store.config.titleFontSize + 2) + 'px' }">
          {{ store.info.intent }}
        </p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span v-if="store.info.phone" class="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full text-white" :style="{ background: store.config.themeColor }">📞 {{ store.info.phone }}</span>
          <span v-if="store.info.email" class="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full text-white" :style="{ background: store.config.themeColor + 'dd' }">✉️ {{ store.info.email }}</span>
          <span v-if="store.info.degree" class="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">🎓 {{ store.info.degree }}</span>
          <span v-if="store.info.location" class="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">📍 {{ store.info.location }}</span>
        </div>
      </div>
      <div class="shrink-0 p-3" v-if="store.info.photo || true">
        <div class="w-20 h-20 rounded-2xl overflow-hidden border-2 flex items-center justify-center" :style="{ borderColor: store.config.themeColor + '44' }">
          <img v-if="store.info.photo" :src="store.info.photo" class="w-full h-full object-cover" :style="{ transform: `scale(${store.config.avatarScale})` }" />
          <div v-else class="flex flex-col items-center justify-center w-full h-full" :style="{ background: store.config.themeColor + '12' }">
            <span class="text-2xl">🌿</span>
          </div>
        </div>
      </div>
    </header>

    <div v-else-if="block.type === 'module-title'"
      :data-block-id="blockId"
      class="flex items-center gap-2 mb-2 mt-2"
    >
      <div class="w-1 h-5 rounded-full shrink-0" :style="{ background: store.config.themeColor }"></div>
      <h2 class="font-bold tracking-wider" :style="{ color: store.config.themeColor, fontSize: store.config.titleSize + 'px' }">
        <span class="icon mr-1.5">{{ block.mod.icon }}</span>{{ block.mod.title }}
      </h2>
    </div>

    <div v-else-if="block.type === 'item-heading'"
      :data-block-id="blockId"
      class="flex justify-between items-baseline mb-0.5 mt-1 px-1"
      :style="{ fontSize: store.config.titleFontSize + 'px' }"
    >
      <span class="font-bold text-gray-800">{{ block.item.p1 }}</span>
      <span class="text-gray-500">{{ block.item.p2 }}</span>
      <span class="text-gray-400 text-xs">{{ block.item.p3 }}</span>
    </div>

    <div v-else-if="block.type === 'item-content'"
      :data-block-id="blockId"
      class="text-gray-700 leading-relaxed px-3 py-2 rounded-xl"
      :style="{
        fontSize: store.config.bodyFontSize + 'px',
        background: store.config.themeColor + '06',
        borderLeft: '3px solid ' + store.config.themeColor + '33'
      }"
      v-html="renderRichText(block.content)"
    ></div>

    <div v-else-if="block.type === 'spacing'"
      :data-block-id="blockId"
      :style="{ height: block.height + 'px' }"
    ></div>

    <div v-else-if="block.type === 'table-row'"
      :data-block-id="blockId"
      class="grid w-full text-gray-700"
      :style="{
        gridTemplateColumns: `repeat(${block.cells.length || 1}, minmax(0, 1fr))`,
        fontSize: store.config.bodyFontSize + 'px'
      }"
    >
      <div v-for="(cell, cellIndex) in block.cells"
        :key="`${blockId}-cell-${cellIndex}`"
        class="border border-gray-300 px-2 py-1"
        v-html="renderRichText(cell)"
      ></div>
    </div>

    <div v-else :data-block-id="blockId" class="last:mb-0" :style="{ marginBottom: block.marginBottom + 'px' }">
      <div v-if="!block.mod.isSingle && (block.item.p1 || block.item.p2 || block.item.p3)"
        class="flex justify-between font-bold text-gray-800 mb-0.5"
        :style="{ fontSize: store.config.titleFontSize + 'px' }">
        <span>{{ block.item.p1 }}</span>
        <span class="text-gray-500 font-normal">{{ block.item.p2 }}</span>
        <span class="text-gray-400 text-xs font-normal">{{ block.item.p3 }}</span>
      </div>
      <div class="text-gray-700 px-3 py-2 rounded-xl" :style="{ fontSize: store.config.bodyFontSize + 'px', background: store.config.themeColor + '06' }"
        v-html="renderRichText(block.item.content)"></div>
    </div>
  </template>

  <!-- ==================== 暗色高端模板 (dark) ==================== -->
  <template v-else-if="store.template === 'dark'">
    <header v-if="block.type === 'header'"
      :data-block-id="blockId"
      class="text-white rounded-xl overflow-hidden mb-4"
      :style="{ background: `linear-gradient(135deg, ${store.config.themeColor} 0%, ${store.config.themeColor}dd 100%)` }"
    >
      <div class="p-5 flex items-center gap-5">
        <div class="shrink-0">
          <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 flex items-center justify-center" :style="{ background: 'rgba(255,255,255,0.1)' }">
            <img v-if="store.info.photo" :src="store.info.photo" class="w-full h-full object-cover" :style="{ transform: `scale(${store.config.avatarScale})` }" />
            <span v-else class="text-3xl opacity-50">👤</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="font-bold leading-tight" :style="{ fontSize: store.config.nameSize + 'px' }">
            {{ store.info.name }}
          </h1>
          <p class="text-white/80 font-medium mt-0.5" :style="{ fontSize: (store.config.titleFontSize + 1) + 'px' }">
            {{ store.info.intent }}
          </p>
          <div class="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-white/70 text-xs">
            <span v-if="store.info.phone">📞 {{ store.info.phone }}</span>
            <span v-if="store.info.email">✉️ {{ store.info.email }}</span>
            <span v-if="store.info.degree">🎓 {{ store.info.degree }}</span>
            <span v-if="store.info.location">📍 {{ store.info.location }}</span>
          </div>
        </div>
      </div>
    </header>

    <div v-else-if="block.type === 'module-title'"
      :data-block-id="blockId"
      class="inline-block text-white font-bold rounded-md mb-2 mt-1"
      :style="{
        background: store.config.themeColor,
        fontSize: store.config.titleSize + 'px',
        padding: '5px 14px'
      }"
    >
      <span class="icon mr-1.5">{{ block.mod.icon }}</span>{{ block.mod.title }}
    </div>

    <div v-else-if="block.type === 'item-heading'"
      :data-block-id="blockId"
      class="flex justify-between items-baseline mb-0.5 mt-1"
      :style="{ fontSize: store.config.titleFontSize + 'px' }"
    >
      <span class="font-bold" :style="{ color: store.config.themeColor }">{{ block.item.p1 }}</span>
      <span class="text-gray-500">{{ block.item.p2 }}</span>
      <span class="text-gray-400 text-xs">{{ block.item.p3 }}</span>
    </div>

    <div v-else-if="block.type === 'item-content'"
      :data-block-id="blockId"
      class="text-gray-700 leading-relaxed"
      :style="{ fontSize: store.config.bodyFontSize + 'px' }"
      v-html="renderRichText(block.content)"
    ></div>

    <hr v-else-if="block.type === 'divider'"
      :data-block-id="blockId"
      class="border-t my-1"
      :style="{ borderColor: store.config.themeColor + '22' }"
    />

    <div v-else-if="block.type === 'spacing'"
      :data-block-id="blockId"
      :style="{ height: block.height + 'px' }"
    ></div>

    <div v-else-if="block.type === 'table-row'"
      :data-block-id="blockId"
      class="grid w-full text-gray-700"
      :style="{
        gridTemplateColumns: `repeat(${block.cells.length || 1}, minmax(0, 1fr))`,
        fontSize: store.config.bodyFontSize + 'px'
      }"
    >
      <div v-for="(cell, cellIndex) in block.cells"
        :key="`${blockId}-cell-${cellIndex}`"
        class="border border-gray-300 px-2 py-1"
        v-html="renderRichText(cell)"
      ></div>
    </div>

    <div v-else :data-block-id="blockId" class="last:mb-0" :style="{ marginBottom: block.marginBottom + 'px' }">
      <div v-if="!block.mod.isSingle && (block.item.p1 || block.item.p2 || block.item.p3)"
        class="flex justify-between font-bold mb-0.5"
        :style="{ color: store.config.themeColor, fontSize: store.config.titleFontSize + 'px' }">
        <span>{{ block.item.p1 }}</span>
        <span class="text-gray-500 font-normal">{{ block.item.p2 }}</span>
        <span class="text-gray-400 text-xs font-normal">{{ block.item.p3 }}</span>
      </div>
      <div class="text-gray-700" :style="{ fontSize: store.config.bodyFontSize + 'px' }" v-html="renderRichText(block.item.content)"></div>
    </div>
  </template>

  <!-- ==================== 现代简约模板 (modern) ==================== -->
  <template v-else-if="store.template === 'modern'">
    <header v-if="block.type === 'header'"
      :data-block-id="blockId"
      class="pb-3 mb-3 flex items-start justify-between gap-3"
      :style="{ borderBottom: '1px solid ' + store.config.themeColor + '33' }"
    >
      <div class="min-w-0">
        <h1 class="font-light tracking-wide text-gray-900" :style="{ fontSize: store.config.nameSize + 'px' }">
          {{ store.info.name }}
        </h1>
        <p class="mt-0.5 text-gray-500 font-medium" :style="{ fontSize: (store.config.titleFontSize + 0.5) + 'px' }">
          {{ store.info.intent }}
        </p>
        <div class="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-gray-400" :style="{ fontSize: (store.config.bodyFontSize - 0.5) + 'px' }">
          <span v-if="store.info.phone">{{ store.info.phone }}</span>
          <span v-if="store.info.email">{{ store.info.email }}</span>
          <span v-if="store.info.degree">{{ store.info.degree }}</span>
          <span v-if="store.info.location">{{ store.info.location }}</span>
        </div>
      </div>
      <div class="w-16 h-16 shrink-0 rounded-lg overflow-hidden flex items-center justify-center" :style="{ border: '1px solid ' + store.config.themeColor + '33' }">
        <img v-if="store.info.photo" :src="store.info.photo" class="w-full h-full object-cover" :style="{ transform: `scale(${store.config.avatarScale})` }" />
        <div v-else class="flex items-center justify-center w-full h-full text-gray-300 text-lg" :style="{ background: store.config.themeColor + '08' }">◻</div>
      </div>
    </header>

    <div v-else-if="block.type === 'module-title'"
      :data-block-id="blockId"
      class="mb-2 mt-1"
    >
      <h2 class="font-medium text-gray-600 tracking-widest uppercase text-xs flex items-center gap-2"
        :style="{ color: store.config.themeColor }">
        <span class="icon">{{ block.mod.icon }}</span>{{ block.mod.title }}
        <span class="flex-1 h-px" :style="{ background: store.config.themeColor + '22' }"></span>
      </h2>
    </div>

    <div v-else-if="block.type === 'item-heading'"
      :data-block-id="blockId"
      class="flex items-baseline gap-2 mb-0.5 mt-1"
      :style="{ fontSize: store.config.titleFontSize + 'px' }"
    >
      <span class="font-semibold text-gray-800">{{ block.item.p1 }}</span>
      <span class="text-gray-500 text-xs">{{ block.item.p2 }}</span>
      <span class="text-gray-400 text-xs ml-auto">{{ block.item.p3 }}</span>
    </div>

    <div v-else-if="block.type === 'item-content'"
      :data-block-id="blockId"
      class="text-gray-600 leading-relaxed"
      :style="{ fontSize: store.config.bodyFontSize + 'px' }"
      v-html="renderRichText(block.content)"
    ></div>

    <div v-else-if="block.type === 'spacing'"
      :data-block-id="blockId"
      :style="{ height: block.height + 'px' }"
    ></div>

    <div v-else-if="block.type === 'table-row'"
      :data-block-id="blockId"
      class="grid w-full text-gray-700"
      :style="{
        gridTemplateColumns: `repeat(${block.cells.length || 1}, minmax(0, 1fr))`,
        fontSize: store.config.bodyFontSize + 'px'
      }"
    >
      <div v-for="(cell, cellIndex) in block.cells"
        :key="`${blockId}-cell-${cellIndex}`"
        class="border border-gray-300 px-2 py-1"
        v-html="renderRichText(cell)"
      ></div>
    </div>

    <div v-else :data-block-id="blockId" class="last:mb-0" :style="{ marginBottom: block.marginBottom + 'px' }">
      <div v-if="!block.mod.isSingle && (block.item.p1 || block.item.p2 || block.item.p3)"
        class="flex items-baseline gap-2 mb-0.5"
        :style="{ fontSize: store.config.titleFontSize + 'px' }">
        <span class="font-semibold text-gray-800">{{ block.item.p1 }}</span>
        <span class="text-gray-500 text-xs">{{ block.item.p2 }}</span>
        <span class="text-gray-400 text-xs ml-auto">{{ block.item.p3 }}</span>
      </div>
      <div class="text-gray-600 leading-relaxed" :style="{ fontSize: store.config.bodyFontSize + 'px' }" v-html="renderRichText(block.item.content)"></div>
    </div>
  </template>

  <!-- ==================== 活力橙红模板 (vibrant) ==================== -->
  <template v-else-if="store.template === 'vibrant'">
    <header v-if="block.type === 'header'"
      :data-block-id="blockId"
      class="pb-3 mb-3 flex items-stretch gap-4"
      :style="{ borderBottom: '3px solid ' + store.config.themeColor }"
    >
      <div class="flex-1 min-w-0">
        <h1 class="font-extrabold tracking-tight" :style="{ color: store.config.themeColor, fontSize: store.config.nameSize + 'px' }">
          {{ store.info.name }}
        </h1>
        <p class="text-gray-700 font-bold mt-0.5" :style="{ fontSize: (store.config.titleFontSize + 1.5) + 'px' }">
          {{ store.info.intent }}
        </p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span v-if="store.info.phone" class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md text-white font-bold" :style="{ background: store.config.themeColor }">📞 {{ store.info.phone }}</span>
          <span v-if="store.info.email" class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md text-white font-bold" :style="{ background: store.config.themeColor + 'cc' }">✉️ {{ store.info.email }}</span>
          <span v-if="store.info.degree" class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-bold" :style="{ background: store.config.themeColor + '15', color: store.config.themeColor }">🎓 {{ store.info.degree }}</span>
          <span v-if="store.info.location" class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md" :style="{ background: store.config.themeColor + '10', color: store.config.themeColor }">📍 {{ store.info.location }}</span>
        </div>
      </div>
      <div class="w-[76px] shrink-0 flex flex-col justify-center">
        <div class="w-[76px] h-[76px] rounded-xl overflow-hidden border-2 flex items-center justify-center" :style="{ borderColor: store.config.themeColor + '44' }">
          <img v-if="store.info.photo" :src="store.info.photo" class="w-full h-full object-cover" :style="{ transform: `scale(${store.config.avatarScale})` }" />
          <div v-else class="flex flex-col items-center justify-center w-full h-full" :style="{ background: store.config.themeColor + '12' }">
            <span class="text-xl" :style="{ color: store.config.themeColor + '66' }">🔥</span>
          </div>
        </div>
      </div>
    </header>

    <div v-else-if="block.type === 'module-title'"
      :data-block-id="blockId"
      class="mb-2 mt-1 overflow-hidden rounded-lg"
    >
      <div class="text-white font-bold px-4 py-2 flex items-center gap-2"
        :style="{ background: `linear-gradient(90deg, ${store.config.themeColor}, ${store.config.themeColor}cc)`, fontSize: store.config.titleSize + 'px' }">
        <span class="icon">{{ block.mod.icon }}</span>{{ block.mod.title }}
      </div>
    </div>

    <div v-else-if="block.type === 'item-heading'"
      :data-block-id="blockId"
      class="flex justify-between items-baseline mb-0.5 mt-1"
      :style="{ fontSize: store.config.titleFontSize + 'px' }"
    >
      <span class="font-extrabold" :style="{ color: store.config.themeColor }">{{ block.item.p1 }}</span>
      <span class="text-gray-600 font-medium">{{ block.item.p2 }}</span>
      <span class="text-gray-400 text-xs">{{ block.item.p3 }}</span>
    </div>

    <div v-else-if="block.type === 'item-content'"
      :data-block-id="blockId"
      class="text-gray-700 leading-relaxed px-3 py-2 rounded-lg"
      :style="{
        fontSize: store.config.bodyFontSize + 'px',
        background: store.config.themeColor + '06'
      }"
      v-html="renderRichText(block.content)"
    ></div>

    <hr v-else-if="block.type === 'divider'"
      :data-block-id="blockId"
      class="border-t my-2"
      :style="{ borderColor: store.config.themeColor + '33', borderStyle: 'dotted' }"
    />

    <div v-else-if="block.type === 'spacing'"
      :data-block-id="blockId"
      :style="{ height: block.height + 'px' }"
    ></div>

    <div v-else-if="block.type === 'table-row'"
      :data-block-id="blockId"
      class="grid w-full text-gray-700"
      :style="{
        gridTemplateColumns: `repeat(${block.cells.length || 1}, minmax(0, 1fr))`,
        fontSize: store.config.bodyFontSize + 'px'
      }"
    >
      <div v-for="(cell, cellIndex) in block.cells"
        :key="`${blockId}-cell-${cellIndex}`"
        class="border border-gray-300 px-2 py-1"
        v-html="renderRichText(cell)"
      ></div>
    </div>

    <div v-else :data-block-id="blockId" class="last:mb-0" :style="{ marginBottom: block.marginBottom + 'px' }">
      <div v-if="!block.mod.isSingle && (block.item.p1 || block.item.p2 || block.item.p3)"
        class="flex justify-between font-extrabold mb-0.5"
        :style="{ color: store.config.themeColor, fontSize: store.config.titleFontSize + 'px' }">
        <span>{{ block.item.p1 }}</span>
        <span class="text-gray-600 font-medium">{{ block.item.p2 }}</span>
        <span class="text-gray-400 text-xs font-normal">{{ block.item.p3 }}</span>
      </div>
      <div class="text-gray-700 leading-relaxed px-3 py-2 rounded-lg" :style="{ fontSize: store.config.bodyFontSize + 'px', background: store.config.themeColor + '06' }"
        v-html="renderRichText(block.item.content)"></div>
    </div>
  </template>

  <!-- ==================== 经典模板 (classic) - 默认 ==================== -->
  <template v-else>
    <header
      v-if="block.type === 'header'"
      :data-block-id="blockId"
      class="flex items-stretch gap-3 border-b-[1.5px] pb-2 min-h-[84px]"
      :style="{
        borderColor: store.config.themeColor,
        marginBottom: store.config.moduleSpacing + 'px'
      }"
    >
      <div class="flex-[1.15] flex flex-col justify-between min-w-0 self-stretch">
        <div class="pt-1">
          <h1 class="font-bold tracking-[0.14em] leading-none" :style="{ color: store.config.themeColor, fontSize: store.config.nameSize + 'px' }">
          {{ store.info.name }}
          </h1>
        </div>

        <div class="flex flex-col items-start gap-2 pb-1">
          <div
            class="inline-flex max-w-full items-center rounded-xl border px-3 py-2"
            :style="{ borderColor: `${store.config.themeColor}24`, background: `linear-gradient(180deg, ${store.config.themeColor}08 0%, rgba(255,255,255,0.96) 100%)` }"
          >
            <p class="text-gray-800 font-bold tracking-wide leading-snug break-all" :style="{ fontSize: (store.config.titleFontSize + 1.5) + 'px' }">
              {{ store.info.intent }}
            </p>
          </div>

          <span
            v-if="store.info.github"
            class="inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide text-gray-600 border-gray-200 bg-gray-50 max-w-[220px]"
          >
            <span class="icon mr-1 text-[10px]" :style="{ color: store.config.themeColor }">&#xf0c1;</span>
            <span class="truncate">{{ store.info.github }}</span>
          </span>
        </div>
      </div>

      <div
        class="w-[320px] max-w-full min-w-0 self-stretch rounded-xl border px-3 py-2 mx-auto flex items-center"
        :style="{ borderColor: `${store.config.themeColor}24`, background: `linear-gradient(180deg, ${store.config.themeColor}08 0%, rgba(255,255,255,0.96) 100%)` }"
      >
        <div class="grid grid-cols-1 gap-1.5 w-full">
          <div v-if="store.info.phone" class="flex items-center gap-2 min-w-0">
            <span class="icon w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px]" :style="{ color: store.config.themeColor, backgroundColor: `${store.config.themeColor}12` }">&#xf095;</span>
            <p class="min-w-0 text-gray-700 font-bold leading-tight break-all" :style="{ fontSize: store.config.titleFontSize + 'px' }">
              {{ store.info.phone }}
            </p>
          </div>

          <div v-if="store.info.email" class="flex items-center gap-2 min-w-0">
            <span class="icon w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px]" :style="{ color: store.config.themeColor, backgroundColor: `${store.config.themeColor}12` }">&#xf0e0;</span>
            <p class="min-w-0 text-gray-700 font-bold leading-tight break-all" :style="{ fontSize: store.config.titleFontSize + 'px' }">
              {{ store.info.email }}
            </p>
          </div>

          <div v-if="store.info.degree" class="flex items-center gap-2 min-w-0">
            <span class="icon w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px]" :style="{ color: store.config.themeColor, backgroundColor: `${store.config.themeColor}12` }">&#xf19d;</span>
            <p class="min-w-0 text-gray-700 font-bold leading-tight break-all" :style="{ fontSize: store.config.titleFontSize + 'px' }">
              {{ store.info.degree }}
            </p>
          </div>

          <div v-if="store.info.location" class="flex items-center gap-2 min-w-0">
            <span class="icon w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px]" :style="{ color: store.config.themeColor, backgroundColor: `${store.config.themeColor}12` }">&#xf3c5;</span>
            <p class="min-w-0 text-gray-700 font-bold leading-tight break-all" :style="{ fontSize: store.config.titleFontSize + 'px' }">
              {{ store.info.location }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="w-[80px] shrink-0 rounded-xl border p-1 flex flex-col ml-auto self-stretch"
        :style="{ borderColor: `${store.config.themeColor}33`, backgroundColor: `${store.config.themeColor}08` }"
      >
        <div class="h-full min-h-0 border border-gray-100 rounded-lg overflow-hidden flex flex-col justify-center"
          :style="{ backgroundColor: `${store.config.themeColor}06` }">
          <img
            v-if="store.info.photo"
            :src="store.info.photo"
            class="w-full h-full object-cover block origin-center"
            :style="{ transform: `scale(${store.config.avatarScale})` }"
          />
          <div v-else class="h-full flex flex-col items-center justify-center px-1"
            :style="{ color: `${store.config.themeColor}55` }">
            <span class="icon text-sm mb-1" :style="{ color: `${store.config.themeColor}44` }">&#xf030;</span>
            <span class="text-[8px] text-center opacity-60">证件照</span>
          </div>
        </div>
      </div>
    </header>

    <h2
      v-else-if="block.type === 'module-title'"
      :data-block-id="blockId"
      class="font-bold mb-2 flex items-center border-b-[1.5px] pb-1 tracking-wider"
      :style="{
        color: store.config.themeColor,
        borderColor: '#eee',
        fontSize: store.config.titleSize + 'px',
        pageBreakAfter: 'avoid',
        breakAfter: 'avoid'
      }"
    >
      <span class="icon mr-2">{{ block.mod.icon }}</span> {{ block.mod.title }}
    </h2>

    <div
      v-else-if="block.type === 'item-heading'"
      :data-block-id="blockId"
      class="flex justify-between font-bold text-gray-800 mb-0.5"
      :style="{ fontSize: store.config.titleFontSize + 'px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }"
    >
      <span class="w-1/3 text-left">{{ block.item.p1 }}</span>
      <span class="w-1/3 text-center">{{ block.item.p2 }}</span>
      <span class="w-1/3 text-right">{{ block.item.p3 }}</span>
    </div>

    <div
      v-else-if="block.type === 'item-content'"
      :data-block-id="blockId"
      class="text-gray-700 text-justify"
      :style="{ fontSize: store.config.bodyFontSize + 'px' }"
      v-html="renderRichText(block.content)"
    ></div>

    <div
      v-else-if="block.type === 'table-row'"
      :data-block-id="blockId"
      class="grid w-full text-gray-700"
      :style="{
        gridTemplateColumns: `repeat(${block.cells.length || 1}, minmax(0, 1fr))`,
        fontSize: store.config.bodyFontSize + 'px'
      }"
    >
      <div
        v-for="(cell, cellIndex) in block.cells"
        :key="`${blockId}-cell-${cellIndex}`"
        class="border border-gray-300 px-2 py-1"
        v-html="renderRichText(cell)"
      ></div>
    </div>

    <hr
      v-else-if="block.type === 'divider'"
      :data-block-id="blockId"
      class="border-t border-dashed border-gray-200 mt-2 mb-2"
    />

    <div
      v-else-if="block.type === 'spacing'"
      :data-block-id="blockId"
      aria-hidden="true"
      :style="{ height: `${block.height || 0}px` }"
    ></div>

    <div
      v-else
      :data-block-id="blockId"
      class="last:mb-0"
      :style="{ marginBottom: block.marginBottom + 'px' }"
    >
      <div
        v-if="!block.mod.isSingle && (block.item.p1 || block.item.p2 || block.item.p3)"
        class="flex justify-between font-bold text-gray-800 mb-0.5"
        :style="{ fontSize: store.config.titleFontSize + 'px', pageBreakAfter: 'avoid', breakAfter: 'avoid' }"
      >
        <span class="w-1/3 text-left">{{ block.item.p1 }}</span>
        <span class="w-1/3 text-center">{{ block.item.p2 }}</span>
        <span class="w-1/3 text-right">{{ block.item.p3 }}</span>
      </div>
      <div class="text-gray-700 text-justify" :style="{ fontSize: store.config.bodyFontSize + 'px' }" v-html="renderRichText(block.item.content)"></div>
      <hr v-if="block.showDivider" class="border-t border-dashed border-gray-200 mt-2 mb-2" />
    </div>
  </template>
  </div>
</template>

<script setup>
defineProps({
  block: { type: Object, required: true },
  blockId: { type: String, default: '' },
  renderRichText: { type: Function, required: true },
  store: { type: Object, required: true }
})
</script>

<style scoped>
.resume-content-block {
  display: contents;
}

.resume-content-block[data-block-type="item-content"] > [data-block-id],
.resume-content-block[data-block-type="main-item-content"] > [data-block-id],
.resume-content-block[data-block-type="sidebar-item"] > [data-block-id],
.resume-content-block[data-block-type="table-row"] > [data-block-id],
.resume-content-block[data-block-type="item"] > [data-block-id] {
  line-height: var(--resume-body-line-height, 1.15) !important;
}
</style>
