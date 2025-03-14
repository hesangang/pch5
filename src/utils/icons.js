import {
  Monitor,
  Document,
  Setting,
  Tools,
  Connection,
  CloudServer,
  CPU,
  DataAnalysis,
  Edit,
  Finished,
  Management,
  Operation,
  Promotion,
  Service,
  Share,
  Success,
  Switch,
  TrendCharts,
  Upload,
  User,
  Warning
} from '@element-plus/icons-vue'

// 图标映射表
export const iconMap = {
  // 研发工具图标
  'coding': Document,
  'jenkins': Operation,
  'artifact': Upload,
  'scan': Warning,
  'api': Connection,
  'test': Finished,
  'monitor': Monitor,
  'log': DataAnalysis,
  
  // 混合云服务图标
  'container': CloudServer,
  'storage': Share,
  'database': CPU,
  'mq': Switch,
  'lb': TrendCharts,
  'gateway': Connection,
  
  // AI工具图标
  'ai': CPU,
  'code-gen': Edit,
  'translate': Document,
  'analysis': DataAnalysis,
  
  // 工单图标
  'review': Document,
  'change': Edit,
  'check': Success,
  'project': Management,
  'track': TrendCharts,
  'resource': Tools,
  'accept': Finished,
  'env': Setting,
  'config': Tools,
  'auth': User,
  'deploy': Upload,
  'issue': Warning,
  'performance': Monitor,
  
  // 指引图标
  'code': Document,
  'api': Connection,
  'security': Warning,
  'dev': Tools,
  'test': Finished,
  'release': Upload,
  'arch': CPU,
  'perf': Monitor,
  'secure': Warning,
  'git': Share,
  'docker': CloudServer,
  'k8s': Service
}

// 获取图标组件
export const getIcon = (name) => {
  return iconMap[name] || Document
} 