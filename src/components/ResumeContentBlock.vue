<template>
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
      <div class="h-full min-h-0 bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col justify-center">
        <img
          v-if="store.info.photo"
          :src="store.info.photo"
          class="w-full h-full object-cover block origin-center"
          :style="{ transform: `scale(${store.config.avatarScale})` }"
        />
        <div v-else class="h-full flex flex-col items-center justify-center text-gray-300 px-1">
          <span class="icon text-sm mb-1" :style="{ color: `${store.config.themeColor}55` }">&#xf030;</span>
          <span class="text-[8px] text-center">证件照</span>
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

<script setup>
defineProps({
  block: { type: Object, required: true },
  blockId: { type: String, default: '' },
  renderRichText: { type: Function, required: true },
  store: { type: Object, required: true }
})
</script>
