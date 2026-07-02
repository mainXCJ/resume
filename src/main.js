import { createApp } from 'vue'
import App from './App.vue'

// 引入全局样式（包含核心的 @media print 打印抗转曲规则）
import './style.css' 

const app = createApp(App)

// 挂载到 index.html 的 #app 节点
app.mount('#app')