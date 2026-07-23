/**
 * 简历导入器 - 支持 PDF / Word / TXT / JSON
 * 从上传的文件中提取文本并尝试解析到 store
 */

import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { detectResumeSection } from './sectionDetector.js'

/**
 * 从文件中提取纯文本
 */
export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  switch (ext) {
    case 'docx':
      return extractFromDocx(file)
    case 'pdf':
      return extractFromPdf(file)
    case 'txt':
      return extractFromTxt(file)
    case 'json':
      // JSON 在 EditorPanel 中已有导入逻辑
      return null
    default:
      throw new Error(`不支持的文件格式: .${ext}，目前支持 .docx / .pdf / .txt`)
  }
}

/**
 * DOCX → 纯文本
 */
async function extractFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer()
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

/**
 * PDF → 纯文本（使用 pdf.js 渲染全部文字）
 * 适用于非扫描版 PDF，扫描件建议 OCR
 */
async function extractFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer()

  // 使用随应用一起构建的 pdf.js worker，离线环境也能导入 PDF
  try {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise
    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map(item => item.str).join(' ')
      fullText += pageText + '\n'
    }

    const result = fullText.trim()
    if (result.length > 20) return result

    // 文字太少，尝试另一种方式提取
    console.warn('pdf.js 提取文字过少，尝试备选方法')
  } catch (e) {
    console.warn('pdf.js 提取失败，尝试备选方法:', e.message)
  }

  // 回退方案：将 PDF 作为文本读取（可提取明文 PDF）
  try {
    const text = await file.text()

    // 过滤掉 PDF 二进制垃圾，只保留可读文本
    const readable = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // 控制字符
      .replace(/%%[^\n]*/g, '') // PDF 注释
      .replace(/\/[A-Za-z]+[^\]\)\n]*/g, '') // PDF 对象
      .replace(/endobj|endstream|stream|obj\s*\d+/g, '')
      .replace(/\d+\s+\d+\s+obj/g, '')
      .split('\n')
      .filter(line => line.trim().length > 3 && !line.match(/^\d+\s+\d+/) && !line.match(/^\/[A-Z]/))
      .join('\n')
      .trim()

    if (readable.length > 50) return readable
  } catch (e) {
    console.warn('PDF 文本提取失败:', e.message)
  }

  throw new Error('无法从 PDF 中提取文字。请尝试上传 .docx 格式或复制粘贴简历内容。')
}

/**
 * TXT → 纯文本
 */
async function extractFromTxt(file) {
  return await file.text()
}

/**
 * 智能解析简历文本 → store 数据结构
 * 自动识别常见简历 section
 *
 * 改进：不再跳过前 N 行，逐行扫描精确匹配 section 标题
 * 修复：section 标题出现在前几行也能被识别
 * 修复：匹配关键词时要求行长度 < 30 且关键词出现在行首附近或独立成词
 */
export function parseResumeText(text) {
  if (!text || !text.trim()) return null

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const result = {
    info: { name: '', intent: '', phone: '', email: '', location: '', degree: '', github: '' },
    sections: []
  }

  // 1. 识别联系方式（在全文中查找）
  const phoneMatch = text.match(/(1[3-9]\d{9})|(\d{3,4}[-.]?\d{7,8})/)
  if (phoneMatch) result.info.phone = phoneMatch[0]

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  if (emailMatch) result.info.email = emailMatch[0]

  const githubMatch = text.match(/github\.com\/[\w-]+/)
  if (githubMatch) result.info.github = 'https://' + githubMatch[0]

  const locationMatch = text.match(/(?:城市|地点|现居|所在地)[：:]\s*(\S+)/)
  if (locationMatch) result.info.location = locationMatch[1]

  const degreeMatch = text.match(/(?:学历|学位|专业)[：:]\s*(.+)/)
  if (degreeMatch) result.info.degree = degreeMatch[1]

  // 2. 尝试找姓名（通常是第一行有意义的文字，2~6个中文字符且不含特殊标记）
  const nameLine = lines.find(line =>
    line.length >= 2 && line.length <= 6 &&
    /^[一-龥·]+$/.test(line) &&
    !line.match(/[0-9@电话邮github\.com]/)
  )
  if (nameLine) result.info.name = nameLine

  // 3. 求职意向
  const intentMatch = text.match(/(?:求职意向|应聘|目标岗位|意向)[：:]\s*(.+)/)
  if (intentMatch) result.info.intent = intentMatch[1]
  else if (result.info.name) {
    const nameIdx = lines.findIndex(l => l === result.info.name)
    if (nameIdx >= 0 && nameIdx + 1 < lines.length) {
      const nextLine = lines[nameIdx + 1]
      if (nextLine.length > 2 && !nextLine.match(/[0-9@]/) && !nextLine.match(/^[-\d.]+/) && nextLine.length < 30) {
        result.info.intent = nextLine
      }
    }
  }

  // 4. 分段识别简历模块 — 改进版：逐行扫描，不跳过任何行
  // 先检测所有行，标记哪些是 section 标题
  const lineAnnotations = lines.map(line => ({
    line,
    section: detectResumeSection(line)
  }))

  // 将未匹配到 section 的信息行（前几行）提取为个人信息
  // 前几行可能包含 姓名/意向/联系方式，它们不应进入任何 section
  let firstSectionIndex = lineAnnotations.findIndex(la => la.section !== null)
  if (firstSectionIndex === -1) firstSectionIndex = lines.length // 没有 section 标题

  // 从第一个 section 标题开始做内容分组
  let currentSection = null
  let currentLines = []

  for (let i = firstSectionIndex; i < lineAnnotations.length; i++) {
    const { line, section } = lineAnnotations[i]

    if (section) {
      // 保存上一个 section
      if (currentSection && currentLines.length > 0) {
        result.sections.push({ id: currentSection.id, lines: [currentSection.title, ...currentLines] })
      }
      currentSection = { id: section.id, title: line }
      currentLines = []
    } else if (currentSection) {
      currentLines.push(line)
    }
  }

  // 保存最后一个 section
  if (currentSection && currentLines.length > 0) {
    result.sections.push({ id: currentSection.id, lines: [currentSection.title, ...currentLines] })
  }

  return result
}

/**
 * 将解析结果合并到 store（导入模式：替换而非追加）
 *
 * @param {Object} store - 响应式 store 对象
 * @param {Object} parsed - parseResumeText 返回的解析结果
 * @param {boolean} overwrite - 是否覆盖已有数据（默认 true，导入场景应覆盖）
 */
export function applyParsedData(store, parsed, overwrite = true) {
  if (!parsed) return false

  // 合并 info
  Object.keys(parsed.info).forEach(key => {
    if (parsed.info[key]) {
      if (overwrite || !store.info[key]) {
        store.info[key] = parsed.info[key]
      }
    }
  })

  // 合并 sections 到对应模块
  parsed.sections.forEach(section => {
    const mod = store.modules.find(m => m.id === section.id)
    if (!mod) return

    // 跳过 section 标题行
    const contentLines = section.lines.slice(1).filter(l => l.length > 0)
    if (!contentLines.length) return

    // 对于 isSingle 模块，直接设置第一个 item 的内容
    if (mod.isSingle && mod.items.length > 0) {
      mod.items[0].content = contentLines.join('\n')
      return
    }

    // 非 single 模块：清空原有 items（避免重复），重新填充
    if (overwrite) {
      mod.items.splice(0, mod.items.length)
    }

    // 尝试从内容中提取 p1/p2/p3（时间/公司/职位）
    let currentItem = null

    contentLines.forEach(line => {
      // 尝试匹配时间行：2020.09 - 2023.06 或 2020-2023
      const timeMatch = line.match(/(\d{4}[.\d]*\s*[-~—–]\s*\d{4}[.\d]*|\d{4}[.\d]*\s*[-~—–]\s*(?:至今|现在|Present))/)
      // 尝试匹配公司/学校行（通常包含大学/公司/学院）
      const isEntity = line.match(/[大学学院公司厂].{0,10}$|^[A-Z][a-z]+ University/)
      // 尝试匹配职位行（但这些通常是内容的一部分，不一定需要单独提取）
      const isRole = line.match(/实习生|工程师|经理|组长|学生|硕士|本科|博士/)

      if (timeMatch) {
        // 时间行，可能包含实体和职位
        if (currentItem) {
          mod.items.push(currentItem)
        }
        currentItem = { p1: '', p2: '', p3: timeMatch[0], content: '' }

        // 时间前后的文本作为实体和职位
        const before = line.split(timeMatch[0])[0]?.trim() || ''
        const after = line.split(timeMatch[0])[1]?.trim() || ''
        if (before) currentItem.p1 = before
        if (after) {
          // 进一步拆分
          const parts = after.split(/[\s|]\s*/).filter(Boolean)
          if (parts.length >= 2) {
            currentItem.p1 = parts[0]
            currentItem.p2 = parts.slice(1).join(' ')
          } else {
            currentItem.p1 = currentItem.p1 || parts[0]
          }
        }
      } else if (isEntity && !isRole) {
        // 实体行（学校/公司名），创建新 item
        if (currentItem) {
          mod.items.push(currentItem)
        }
        currentItem = { p1: line, p2: '', p3: '', content: '' }
      } else {
        // 内容行
        if (!currentItem) {
          currentItem = { p1: '', p2: '', p3: '', content: '' }
        }
        currentItem.content += (currentItem.content ? '\n' : '') + line
      }
    })

    if (currentItem) {
      mod.items.push(currentItem)
    }

    // 标记为可见
    mod.visible = true
  })

  // 如果没有解析到任何 section，尝试把纯文本填入第一个能用的模块
  if (parsed.sections.length === 0 && parsed.info.name) {
    const firstMod = store.modules.find(m => !m.isSingle)
    if (firstMod && overwrite) {
      firstMod.items.splice(0, firstMod.items.length)
      firstMod.items.push({ p1: '', p2: '', p3: '', content: '（从导入文件未能自动分段，请手动整理以上内容）' })
      firstMod.visible = true
    }
  }

  return true
}
