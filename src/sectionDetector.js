const SECTION_HEADERS = [
  { id: 'edu', keywords: ['教育背景', '教育经历', '教育', '学历', 'Education'] },
  { id: 'work', keywords: ['工作经历', '工作经验', 'Employment', 'Experience'] },
  { id: 'project', keywords: ['项目经历', '项目经验', '项目', 'Projects'] },
  { id: 'intern', keywords: ['实习经历', '实习', 'Internship'] },
  { id: 'skills', keywords: ['专业技能', '技能', 'Skills', '技术栈', '个人技能', '职业能力'] },
  { id: 'award', keywords: ['获奖', '荣誉', '奖项', '获奖经历', 'Awards'] },
  { id: 'cert', keywords: ['证书', '资格', '证书信息', 'Certifications'] },
  { id: 'eval', keywords: ['自我评价', '个人评价', '关于我', 'Summary'] },
  { id: 'research', keywords: ['科研', '论文', '专利', '科研成果', 'Publications'] },
  { id: 'campus', keywords: ['校园经历', '社团', '学生工作', '校园'] }
]

const KEYWORD_MAP = Object.fromEntries(
  SECTION_HEADERS.flatMap(section =>
    section.keywords.map(keyword => [keyword.toLowerCase(), section.id])
  )
)

export const normalizeSectionTitle = (line = '') => String(line)
  .replace(/^[\s#>*\-•·▪●◆◇]+/, '')
  .replace(/^(?:第?[一二三四五六七八九十]+[章节、.．:：)）]|[0-9]+[、.．:：)）])\s*/, '')
  .replace(/[：:]\s*$/, '')
  .trim()
  .toLowerCase()

export const detectResumeSection = (line) => {
  if (!line || String(line).length > 40) return null
  const sectionId = KEYWORD_MAP[normalizeSectionTitle(line)]
  return sectionId ? SECTION_HEADERS.find(section => section.id === sectionId) : null
}
