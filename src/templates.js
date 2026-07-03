/**
 * 简历模板定义
 * 每个模板包含独特的样式变量和布局配置
 */

export const TEMPLATES = [
  {
    id: 'classic',
    name: '经典商务蓝',
    desc: '标准单栏布局，稳重专业，适合传统行业',
    preview: '📋',
    config: {
      // 主题色系统将使用 store.config.themeColor
      nameSize: 32,
      titleSize: 15,
      titleFontSize: 12,
      bodyFontSize: 11.5,
      lineHeight: 1.15,
      moduleSpacing: 6,
      margin: { top: 14, bottom: 14, left: 13, right: 13 },
    },
    // CSS 变量覆盖
    cssVars: {
      '--section-border-style': 'solid',
      '--section-border-width': '1.5px',
      '--section-border-color': '#e5e7eb',
      '--header-layout': 'row',
      '--header-align': 'stretch',
      '--contact-style': 'badge',
      '--module-title-style': 'underline',
      '--item-heading-style': 'row',
      '--avatar-border-radius': '12px',
      '--body-text-align': 'justify',
      '--divider-style': 'dashed',
      '--name-font-weight': '700',
      '--page-bg': '#ffffff',
      '--module-title-bg': 'transparent',
      '--module-title-padding': '0',
      '--module-title-radius': '0',
    }
  },
  {
    id: 'sidebar',
    name: '现代侧栏',
    desc: '双栏布局，左侧彩色信息栏，右侧详细内容',
    preview: '📐',
    config: {
      nameSize: 24,
      titleSize: 14,
      titleFontSize: 11,
      bodyFontSize: 11,
      lineHeight: 1.2,
      moduleSpacing: 5,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    },
    cssVars: {
      '--sidebar-width': '35%',
      '--sidebar-bg': 'var(--print-theme-color)',
      '--sidebar-text': '#ffffff',
      '--content-bg': '#ffffff',
      '--section-border-style': 'none',
      '--section-border-color': 'transparent',
      '--header-layout': 'sidebar',
      '--contact-style': 'icon-list',
      '--module-title-style': 'accent-left',
      '--item-heading-style': 'row',
      '--avatar-border-radius': '50%',
      '--body-text-align': 'left',
      '--divider-style': 'solid',
      '--name-font-weight': '700',
      '--page-bg': '#ffffff',
      '--module-title-bg': 'transparent',
      '--module-title-padding': '0 0 4px 0',
      '--module-title-radius': '0',
    }
  },
  {
    id: 'minimal',
    name: '极简灰',
    desc: '极简设计，克制留白，适合设计/互联网岗位',
    preview: '◻️',
    config: {
      nameSize: 28,
      titleSize: 13,
      titleFontSize: 11,
      bodyFontSize: 11,
      lineHeight: 1.3,
      moduleSpacing: 4,
      margin: { top: 16, bottom: 16, left: 16, right: 16 },
    },
    cssVars: {
      '--section-border-style': 'none',
      '--section-border-width': '0',
      '--section-border-color': 'transparent',
      '--header-layout': 'centered',
      '--header-align': 'center',
      '--contact-style': 'inline-dots',
      '--module-title-style': 'overline',
      '--item-heading-style': 'stack',
      '--avatar-border-radius': '50%',
      '--body-text-align': 'left',
      '--divider-style': 'solid',
      '--name-font-weight': '300',
      '--page-bg': '#ffffff',
      '--module-title-bg': 'transparent',
      '--module-title-padding': '0',
      '--module-title-radius': '0',
    }
  },
  {
    id: 'elegant',
    name: '优雅暖棕',
    desc: '圆角卡片，温暖色系，现代精致',
    preview: '📄',
    config: {
      nameSize: 30,
      titleSize: 14,
      titleFontSize: 11.5,
      bodyFontSize: 11,
      lineHeight: 1.15,
      moduleSpacing: 8,
      margin: { top: 12, bottom: 12, left: 12, right: 12 },
    },
    cssVars: {
      '--section-border-style': 'solid',
      '--section-border-width': '1px',
      '--section-border-color': '#f0e6d3',
      '--header-layout': 'row',
      '--header-align': 'stretch',
      '--contact-style': 'badge',
      '--module-title-style': 'pill',
      '--item-heading-style': 'row',
      '--avatar-border-radius': '16px',
      '--body-text-align': 'justify',
      '--divider-style': 'dotted',
      '--name-font-weight': '600',
      '--page-bg': '#fefbf7',
      '--module-title-bg': 'transparent',
      '--module-title-padding': '0',
      '--module-title-radius': '0',
    }
  },
  {
    id: 'timeline',
    name: '时间线式',
    desc: '左侧时间轴线，经历按时间流畅展示',
    preview: '⏳',
    config: {
      nameSize: 30,
      titleSize: 14,
      titleFontSize: 11.5,
      bodyFontSize: 11,
      lineHeight: 1.2,
      moduleSpacing: 6,
      margin: { top: 14, bottom: 14, left: 16, right: 13 },
    },
    cssVars: {
      '--section-border-style': 'none',
      '--section-border-width': '0',
      '--section-border-color': 'transparent',
      '--header-layout': 'row',
      '--header-align': 'stretch',
      '--contact-style': 'badge',
      '--module-title-style': 'timeline',
      '--item-heading-style': 'timeline',
      '--avatar-border-radius': '12px',
      '--body-text-align': 'left',
      '--divider-style': 'none',
      '--name-font-weight': '700',
      '--page-bg': '#ffffff',
      '--module-title-bg': 'transparent',
      '--module-title-padding': '0',
      '--module-title-radius': '0',
    }
  },
  {
    id: 'compact',
    name: '紧凑资讯',
    desc: '信息密度高，双列技能栏，适合资深人士',
    preview: '📊',
    config: {
      nameSize: 28,
      titleSize: 13,
      titleFontSize: 11,
      bodyFontSize: 10.5,
      lineHeight: 1.1,
      moduleSpacing: 4,
      margin: { top: 12, bottom: 12, left: 12, right: 12 },
    },
    cssVars: {
      '--section-border-style': 'solid',
      '--section-border-width': '0.5px',
      '--section-border-color': '#ccc',
      '--header-layout': 'row',
      '--header-align': 'stretch',
      '--contact-style': 'inline',
      '--module-title-style': 'compact-bar',
      '--item-heading-style': 'inline',
      '--avatar-border-radius': '4px',
      '--body-text-align': 'left',
      '--divider-style': 'none',
      '--name-font-weight': '700',
      '--page-bg': '#ffffff',
      '--module-title-bg': '#f5f5f5',
      '--module-title-padding': '3px 8px',
      '--module-title-radius': '2px',
    }
  }
]

// ============================================================
// 以下为新增模板定义
// ============================================================
// 注意：新增模板需要在 ResumeContentBlock.vue 中添加对应的渲染逻辑

// 新模板定义（在最后追加到 TEMPLATES 数组末尾）
const NEW_TEMPLATES = [
  {
    id: 'fresh',
    name: '清新绿意',
    desc: '柔和绿色调，圆角卡片，亲和自然',
    preview: '🌿',
    config: {
      nameSize: 30,
      titleSize: 14,
      titleFontSize: 11.5,
      bodyFontSize: 11,
      lineHeight: 1.2,
      moduleSpacing: 8,
      margin: { top: 15, bottom: 15, left: 14, right: 14 },
    },
    cssVars: {
      '--section-border-style': 'none',
      '--section-border-width': '0',
      '--header-layout': 'row',
      '--header-align': 'stretch',
      '--contact-style': 'badge',
      '--module-title-style': 'accent-bar',
      '--item-heading-style': 'row',
      '--avatar-border-radius': '20px',
      '--body-text-align': 'left',
      '--divider-style': 'none',
      '--name-font-weight': '600',
      '--page-bg': '#f9fdf9',
      '--module-title-bg': 'transparent',
      '--module-title-padding': '0',
      '--module-title-radius': '0',
    }
  },
  {
    id: 'dark',
    name: '暗色高端',
    desc: '深色头部和模块标签，白字高对比，适合高管/外企',
    preview: '🌙',
    config: {
      nameSize: 28,
      titleSize: 14,
      titleFontSize: 11,
      bodyFontSize: 10.5,
      lineHeight: 1.15,
      moduleSpacing: 5,
      margin: { top: 12, bottom: 12, left: 12, right: 12 },
    },
    cssVars: {
      '--section-border-style': 'solid',
      '--section-border-width': '0.5px',
      '--section-border-color': '#333',
      '--header-layout': 'dark-header',
      '--header-align': 'stretch',
      '--contact-style': 'icon-row',
      '--module-title-style': 'dark-bar',
      '--item-heading-style': 'row',
      '--avatar-border-radius': '50%',
      '--body-text-align': 'left',
      '--divider-style': 'solid',
      '--name-font-weight': '700',
      '--page-bg': '#1a1a2e',
      '--module-title-bg': 'var(--print-theme-color)',
      '--module-title-padding': '6px 12px',
      '--module-title-radius': '4px',
    }
  },
  {
    id: 'modern',
    name: '现代简约',
    desc: '超薄分割线，无边框内容区，极致清爽',
    preview: '◇',
    config: {
      nameSize: 34,
      titleSize: 13,
      titleFontSize: 11,
      bodyFontSize: 10.5,
      lineHeight: 1.3,
      moduleSpacing: 6,
      margin: { top: 16, bottom: 14, left: 16, right: 16 },
    },
    cssVars: {
      '--section-border-style': 'none',
      '--section-border-width': '0',
      '--header-layout': 'centered-left',
      '--header-align': 'stretch',
      '--contact-style': 'inline',
      '--module-title-style': 'thin-underline',
      '--item-heading-style': 'row-compact',
      '--avatar-border-radius': '8px',
      '--body-text-align': 'left',
      '--divider-style': 'none',
      '--name-font-weight': '400',
      '--page-bg': '#ffffff',
      '--module-title-bg': 'transparent',
      '--module-title-padding': '0',
      '--module-title-radius': '0',
    }
  },
  {
    id: 'vibrant',
    name: '活力橙红',
    desc: '暖橙色系，饱满色块标题，年轻有活力',
    preview: '🔥',
    config: {
      nameSize: 32,
      titleSize: 15,
      titleFontSize: 12,
      bodyFontSize: 11,
      lineHeight: 1.15,
      moduleSpacing: 7,
      margin: { top: 13, bottom: 13, left: 13, right: 13 },
    },
    cssVars: {
      '--section-border-style': 'none',
      '--section-border-width': '0',
      '--header-layout': 'row',
      '--header-align': 'stretch',
      '--contact-style': 'badge',
      '--module-title-style': 'filled',
      '--item-heading-style': 'row',
      '--avatar-border-radius': '12px',
      '--body-text-align': 'justify',
      '--divider-style': 'dotted',
      '--name-font-weight': '800',
      '--page-bg': '#fffcf9',
      '--module-title-bg': 'transparent',
      '--module-title-padding': '8px 14px',
      '--module-title-radius': '6px',
    }
  }
]

// 追加到 TEMPLATES
TEMPLATES.push(...NEW_TEMPLATES)

/**
 * 根据模板 ID 获取默认主题色
 */
export const getDefaultColor = (templateId) => {
  const colors = {
    classic: '#005A9E',
    sidebar: '#2D3748',
    minimal: '#333333',
    elegant: '#8B6B4A',
    timeline: '#2563EB',
    compact: '#4A5568',
    fresh: '#2D8A4E',
    dark: '#6C5CE7',
    modern: '#1E293B',
    vibrant: '#E8632E'
  }
  return colors[templateId] || '#005A9E'
}

/**
 * 根据模板 ID 获取主题色板
 */
export const getThemeOptions = (templateId) => {
  const palettes = {
    classic: [
      { name: '经典商务蓝', value: '#005A9E' },
      { name: '沉稳藏青色', value: '#1A4F85' },
      { name: '典雅绛红色', value: '#8A1538' },
      { name: '曜石纯黑色', value: '#222222' },
    ],
    sidebar: [
      { name: '深邃灰蓝', value: '#2D3748' },
      { name: '墨绿色', value: '#276749' },
      { name: '暗紫色', value: '#553C9A' },
      { name: '碳黑色', value: '#1A202C' },
    ],
    minimal: [
      { name: '墨灰色', value: '#333333' },
      { name: '暖灰色', value: '#5D5D5D' },
      { name: '深海蓝', value: '#2C5282' },
      { name: '炭黑色', value: '#1A1A1A' },
    ],
    elegant: [
      { name: '暖棕色', value: '#8B6B4A' },
      { name: '陶土红', value: '#C17A5A' },
      { name: '橄榄绿', value: '#6B8E5A' },
      { name: '雾霾蓝', value: '#6B8E9E' },
    ],
    timeline: [
      { name: '明亮蓝', value: '#2563EB' },
      { name: '翠绿色', value: '#059669' },
      { name: '珊瑚红', value: '#DC2626' },
      { name: '深紫色', value: '#7C3AED' },
    ],
    compact: [
      { name: '石板灰', value: '#4A5568' },
      { name: '深海蓝', value: '#2B6CB0' },
      { name: '石墨黑', value: '#2D3748' },
      { name: '灰褐色', value: '#6B7280' },
    ],
    fresh: [
      { name: '翠微绿', value: '#2D8A4E' },
      { name: '森林绿', value: '#1E6B3F' },
      { name: '薄荷绿', value: '#0E9F6E' },
      { name: '海松绿', value: '#3B7A57' },
    ],
    dark: [
      { name: '紫罗兰', value: '#6C5CE7' },
      { name: '皇室蓝', value: '#3B4C9B' },
      { name: '暗红色', value: '#8B2252' },
      { name: '暗金色', value: '#B8860B' },
    ],
    modern: [
      { name: '石板色', value: '#1E293B' },
      { name: '钢蓝色', value: '#475569' },
      { name: '炭灰色', value: '#334155' },
      { name: '深靛蓝', value: '#312E81' },
    ],
    vibrant: [
      { name: '活力橙', value: '#E8632E' },
      { name: '珊瑚红', value: '#E84646' },
      { name: '琥珀色', value: '#D97706' },
      { name: '朱红色', value: '#C0392B' },
    ],
  }
  return palettes[templateId] || palettes.classic
}
