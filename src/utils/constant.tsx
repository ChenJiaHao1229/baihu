import { CrownFilled, SmileFilled } from '@ant-design/icons'
type ConstantFileInfoType = { [key: string]: { icon: JSX.Element; language: string } }
export default {
  siteName: '白虎控制台',
  apiPrefix: process.env.NODE_ENV === 'development' ? '/api' : '',
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
      // {
      //   key: 'configs',
      //   path: '/configs',
      //   name: '配置文件',
      //   icon: <CrownFilled />
      // },
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
      icon: 'https://avatars.githubusercontent.com/u/86949839?s=40&v=4',
      title: 'GitHub',
      desc: '项目地址',
      url: 'https://github.com/ChenJiaHao1229'
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
