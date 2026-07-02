import { reactive, watch } from 'vue'
import { TEMPLATES, getDefaultColor, getThemeOptions } from './templates.js'

const LOCAL_KEY = 'resume_draft_data'

// 将默认状态提取为工厂函数，方便随时对比和重置
const getDefaultState = () => ({
    // 0. 模板选择
    template: 'classic',

    // 1. 全局排版配置
    config: {
        themeColor: getDefaultColor('classic'),
        fontFamily: 'PingFang',
        nameSize: 32,
        avatarScale: 1.0,
        titleSize: 15,
        titleFontSize: 12,
        bodyFontSize: 11.5,
        lineHeight: 1.15,
        moduleSpacing: 6,
        margin: { top: 14, bottom: 14, left: 13, right: 13 },
    },
    // 2. 预设主题色选板（按模板动态）
    themeOptions: getThemeOptions('classic'),
    // 3. 界面状态控制
    ui: {
        activeTab: 'content', 
        activeModuleId: 'base' 
    },
    // 4. 基础个人信息
    info: {
        name: '某某',
        intent: '求职意向',
        phone: 'XXX-XXXX-XXXX',
        email: 'email@example.com',
        github: '',
        location: '某城市',
        degree: '某专业 学历',
        photo: ''
    },
    // 5. 简历核心模块
    modules: [
        {
            id: 'edu', 
            title: '教育背景', 
            icon: '\uf19d', 
            isSingle: false, 
            visible: true, 
            showDivider: false,
            items: [
                { p1: '某大学', p2: '某专业 硕士', p3: '202X.09 - 202X.06', content: '主修某专业，成绩优良' },
                { p1: '某大学', p2: '某专业 本科', p3: '202X.09 - 202X.06', content: '' }
            ]
        },
        {
            id: 'campus', 
            title: '校园经历', 
            icon: '\uf501', 
            isSingle: false,
            visible: false, 
            showDivider: true,
            items: [
                { p1: '某学生组织', p2: '某职务', p3: '202X.10 - 202X.06', content: '- 负责相关活动的策划与执行' }
            ]
        },
        {
            id: 'exam', 
            title: '考研成绩', 
            icon: '\uf02d', 
            isSingle: false,
            visible: true, 
            showDivider: false,
            items: [
                {
                  p1: '某大学 某专业', p2: '初试总分: XXX', p3: '202X.02',
                  content: '| 考试科目 | 成绩 | 排名/备注 |\n|---|---|---|\n| 科目一 | XX | 前 XX% |\n| 科目二(XXX) | XX | 前 XX% |'
                }
            ]
        },
        {
            id: 'skills', 
            title: '专业技能', 
            icon: '\uf013', 
            isSingle: true, 
            visible: true, 
            showDivider: false,
            items: [
                { p1: '', p2: '', p3: '', content: '- 核心栈：【某技术栈】\n  - 精通 某领域开发。' }
            ]
        },
        {
            id: 'intern', 
            title: '实习经历', 
            icon: '\uf0b1', 
            isSingle: false,
            visible: false, 
            showDivider: true,
            items: [
                { p1: '某科技公司', p2: '实习生', p3: '202X.07', content: '- 参与某项目的硬件开发工作。' }
            ]
        },
        {
            id: 'work', 
            title: '工作经历', 
            icon: '\uf201', 
            isSingle: false,
            visible: false, 
            showDivider: true,
            items: [
                { p1: '某研究所', p2: '助理工程师', p3: '202X.07', content: '- 负责某系统的相关设计工作。' }
            ]
        },
        {
            id: 'project', 
            title: '项目经历', 
            icon: '\uf0e8', 
            isSingle: false,
            visible: true, 
            showDivider: true, 
            items: [
                { p1: '某项目', p2: '某角色', p3: '202X.05 - 202X.10', content: '1. 独立完成相关工作。' },
                { p1: '某项目', p2: '某角色', p3: '202X.11 - 202X.03', content: '- 负责相关设计工作。' }
            ]
        },
        {
            id: 'award', 
            title: '获奖经历', 
            icon: '\uf091', 
            isSingle: false,
            visible: false, 
            showDivider: false,
            items: [
                { p1: '某竞赛', p2: '某等奖', p3: '202X.08', content: '- 相关工作。' }
            ]
        },
        {
            id: 'cert', 
            title: '证书信息', 
            icon: '\uf21b', 
            isSingle: true, 
            visible: false, 
            showDivider: false,
            items: [
                { p1: '', p2: '', p3: '', content: '- 某语言等级证书' }
            ]
        },
        {
            id: 'eval', 
            title: '个人评价', 
            icon: '\uf303', 
            isSingle: true, 
            visible: false, 
            showDivider: false,
            items: [
                { p1: '', p2: '', p3: '', content: '- 具备良好的学习能力。' }
            ]
        },
        {
            id: 'research', 
            title: '科研成果', 
            icon: '\uf0c3', 
            isSingle: false,
            visible: false, 
            showDivider: true,
            items: [
                { p1: '某专利', p2: '第某发明人', p3: '202X.12', content: '- 专利号：CNXXXXXXX' }
            ]
        }
    ]
});

const getInitialState = () => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // 确保新版本字段存在（兼容旧数据迁移）
            const defaults = getDefaultState();
            if (!parsed.template) parsed.template = defaults.template;
            if (!parsed.themeOptions) parsed.themeOptions = defaults.themeOptions;
            return parsed;
        } catch (e) {
            console.error('解析草稿失败，加载默认模板', e);
        }
    }
    return getDefaultState();
};

export const store = reactive(getInitialState());

// 实时保存到本地防止崩溃丢失
watch(store, (newVal) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newVal));
}, { deep: true });

// 一键恢复默认模板
export const resetDraft = () => {
    if(confirm('确定要清空草稿并恢复初始模板吗？此操作不可逆！')) {
        localStorage.removeItem(LOCAL_KEY);
        Object.assign(store, getDefaultState());
    }
};

// ✨ 新增：导出草稿为 JSON 文件
export const exportDraftToJSON = () => {
    const exportData = { ...store, template: store.template };
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // 默认文件名为 resume_draft_加上当前日期.json
    a.download = `resume_draft_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

// ✨ 新增：从 JSON 文件导入草稿（支持智能合并新模块）
export const importDraftFromJSON = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString);
        if (parsed && parsed.config && parsed.info && parsed.modules) {
            // 1. 覆盖基础配置和信息
            Object.assign(store.config, parsed.config);
            Object.assign(store.info, parsed.info);
            if (parsed.ui) Object.assign(store.ui, parsed.ui);
            if (parsed.template) store.template = parsed.template;

            // 2. 智能合并模块策略：
            // 优先应用 JSON 中的自定义模块和顺序，同时兼容“未来代码中可能加入的全新模块”
            const defaultModules = getDefaultState().modules;
            const resultModules = [...parsed.modules];
            
            defaultModules.forEach(defMod => {
                // 如果系统默认模板里有某个模块，但是导入的 JSON 里没有（说明是代码升级新加的模块）
                if (!resultModules.find(m => m.id === defMod.id)) {
                    resultModules.push(defMod); // 则智能追加到底部
                }
            });

            // 整体替换当前的模块数组
            store.modules.splice(0, store.modules.length, ...resultModules);
            return true;
        } else {
            alert('JSON 格式不正确，缺少必要的简历数据节点！');
            return false;
        }
    } catch (e) {
        console.error(e);
        alert('读取失败，请确保文件是有效的 JSON 格式！');
        return false;
    }
};