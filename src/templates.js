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
  }
]

/**
 * 根据模板 ID 获取默认主题色
 */
export const getDefaultColor = (templateId) => {
  const colors = {
    classic: '#005A9E',
    sidebar: '#2D3748',
    minimal: '#333333',
    elegant: '#8B6B4A'
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
  }
  return palettes[templateId] || palettes.classic
}
