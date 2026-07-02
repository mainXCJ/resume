import { reactive, watch } from 'vue'

const LOCAL_KEY = 'resume_draft_data'

// 将默认状态提取为工厂函数，方便随时对比和重置
const getDefaultState = () => ({
    // 1. 全局排版配置
    config: {
        themeColor: '#1A4F85',    
        fontFamily: 'PingFang',   
        nameSize: 32,             
        avatarScale: 1.0,         
        titleSize: 15,            
        titleFontSize: 12, 
        bodyFontSize: 11.5,  
        lineHeight: 1.1,          
        moduleSpacing: 5,        
        margin: { top: 14, bottom: 14, left: 12, right: 12 }, 
    },
    // 2. 预设主题色选板
    themeOptions: [
        { name: '经典商务蓝', value: '#005A9E' },
        { name: '沉稳藏青色', value: '#1A4F85' },
        { name: '典雅绛红色', value: '#8A1538' },
        { name: '曜石纯黑色', value: '#222222' }
    ],
    // 3. 界面状态控制
    ui: {
        activeTab: 'content', 
        activeModuleId: 'base' 
    },
    // 4. 基础个人信息
    info: {
        name: '王昕', 
        intent: '电子信息硕士 / 硬件工程师',
        phone: '138-1234-5678', 
        email: 'wangxin@example.com',
        github: '', 
        location: '浙江杭州', 
        degree: '电子信息 硕士',
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
                { p1: '中国计量大学', p2: '电子信息 硕士', p3: '2026.09 - 2029.06', content: '主修硬件工程，专业排名前5%' },
                { p1: '南京理工大学紫金学院', p2: '电子信息 本科', p3: '2022.09 - 2026.06', content: '' }
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
                { p1: '校研究生会', p2: '宣传部部长', p3: '2026.10 - 2027.06', content: '- 负责学院日常活动的策划与宣发' }
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
                  p1: '中国计量大学 电子信息', p2: '初试总分: 385', p3: '2026.02', 
                  content: '| 考试科目 | 成绩 | 排名/备注 |\n|---|---|---|\n| 数学一 | 115 | 院系前 10% |\n| 专业课(801) | 125 | 专业前 5% |' 
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
                { p1: '', p2: '', p3: '', content: '- 核心栈：【Altium Designer】 【C语言】\n  - 精通 单片机底层开发。' }
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
                { p1: '某科技公司', p2: '硬件开发实习生', p3: '2025.07', content: '- 参与某工业网关的硬件改版。' }
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
                { p1: 'XX 电子研究所', p2: '助理工程师', p3: '2029.07', content: '- 负责嵌入式系统的硬件架构设计。' }
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
                { p1: '智能物联网监测系统', p2: '核心硬件研发', p3: '2023.05 - 2023.10', content: '1. 独立完成 PCB 原理图设计。' },
                { p1: '高频信号放大器设计', p2: '硬件工程组长', p3: '2022.11 - 2023.03', content: '- 负责电路拓扑设计。' }
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
                { p1: '电子设计竞赛', p2: '国家级二等奖', p3: '2024.08', content: '- 算法实现。' }
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
                { p1: '', p2: '', p3: '', content: '- 英语六级 (CET-6)' }
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
                { p1: '', p2: '', p3: '', content: '- 具备极强的自学能力。' }
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
                { p1: '传感器节点专利', p2: '第一发明人', p3: '2027.12', content: '- 专利号：CN123456789A' }
            ]
        }
    ]
});

const getInitialState = () => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
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
    const dataStr = JSON.stringify(store, null, 2);
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