import { CrownFilled, SmileFilled } from '@ant-design/icons'
type ConstantFileInfoType = { [key: string]: { icon: JSX.Element; language: string } }
export default {
  siteName: '白虎控制台',
  apiPrefix: '/api',
  authToken: 'BH_TOKEN',
  // 左侧导航
  menuRoute: {
    path: '/',
    routes: [
      {
        key: 'plan',
        path: '/plan',
        name: '任务计划',
        icon: <SmileFilled />
      },
      {
        key: 'variable',
        path: '/variable',
        name: '变量管理',
        icon: <SmileFilled />
      },
      {
        key: 'configs',
        path: '/configs',
        name: '配置文件',
        icon: <CrownFilled />
      },
      {
        key: 'scripts',
        path: '/scripts',
        name: '脚本管理',
        icon: <CrownFilled />
      },
      {
        key: 'logs',
        path: '/logs',
        name: '查看日志',
        icon: <CrownFilled />
      },
      {
        key: 'setting',
        path: '/setting',
        name: '系统设置',
        icon: <CrownFilled />
      }
    ]
  },
  // 第三方跳转
  otherAppList: [
    {
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'Ant Design',
      desc: '杭州市较知名的 UI 设计语言',
      url: 'https://ant.design'
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
      title: 'AntV',
      desc: '蚂蚁集团全新一代数据可视化解决方案',
      url: 'https://antv.vision/',
      target: '_blank'
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
      title: 'Pro Components',
      desc: '专业级 UI 组件库',
      url: 'https://procomponents.ant.design/'
    },
    {
      icon: 'https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png',
      title: 'umi',
      desc: '插件化的企业级前端应用框架。',
      url: 'https://umijs.org/zh-CN/docs'
    },

    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
      title: 'qiankun',
      desc: '可能是你见过最完善的微前端解决方案🧐',
      url: 'https://qiankun.umijs.org/'
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
      title: '语雀',
      desc: '知识创作与分享工具',
      url: 'https://www.yuque.com/'
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg',
      title: 'Kitchen ',
      desc: 'Sketch 工具集',
      url: 'https://kitchen.alipay.com/'
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png',
      title: 'dumi',
      desc: '为组件开发场景而生的文档工具',
      url: 'https://d.umijs.org/zh-CN'
    }
  ],
  // Monaco主题
  monacoThere: [
    { label: 'Visual Studio', value: 'vs' },
    { label: 'Visual Studio Dark', value: 'vs-dark' },
    { label: 'High Contrast Dark', value: 'hc-black' }
  ],
  // Monaco语言
  monacoLanguage: [
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Java', value: 'java' },
    { label: 'Json', value: 'json' },
    { label: 'Yaml', value: 'yaml' },
    { label: 'SQL', value: 'sql' },
    { label: 'Shell', value: 'shell' },
    { label: 'Python', value: 'python' },
    { label: 'PHP', value: 'php' },
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'Less', value: 'less' }
  ],
  // 正则
  reg: {},
  fileInfo: {
    js: {
      icon: <span className="bhIcon icon-js" style={{ color: '#f7cd45' }} />,
      language: 'javascript'
    },
    ts: {
      icon: <span className="bhIcon icon-ts" style={{ color: '#458ff7' }} />,
      language: 'typescript'
    },
    html: {
      icon: <span className="bhIcon icon-html" style={{ color: '#458ff7' }} />,
      language: 'html'
    },
    css: {
      icon: <span className="bhIcon icon-css" style={{ color: '#f7af45' }} />,
      language: 'css'
    },
    json: {
      icon: <span className="bhIcon icon-json" style={{ color: '#f7af45' }} />,
      language: 'json'
    }
  } as ConstantFileInfoType,
  // 脚本文件
  scriptFileList: ['ts', 'js']
}
