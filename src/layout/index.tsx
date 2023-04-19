import constant from '@/utils/constant'
import { GithubFilled, InfoCircleFilled, QuestionCircleFilled } from '@ant-design/icons'
import type { ProSettings } from '@ant-design/pro-components'
import { ProLayout, SettingDrawer, ProCard } from '@ant-design/pro-components'
import { message, Spin } from 'antd'
import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getTheme, updateTheme } from '@/api/user'
import logo from '@/assets/logo.png'

const BHLayout = () => {
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>()
  const [isInit, setIsInit] = useState<boolean>(true)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // 获取主题数据
    getTheme().then((res) => {
      if (res.status) {
        setSetting(res.data?.theme)
      }
    })
  }, [])

  return (
    <div id="BH-layout" style={{ height: '100vh' }}>
      <ProLayout
        title="白虎控制台"
        logo={logo}
        siderWidth={256}
        route={constant.menuRoute}
        appList={constant.otherAppList}
        menu={{ type: 'sub' }}
        avatarProps={{
          src: 'https://avatars.githubusercontent.com/u/86949839?s=40&v=4',
          title: '陈先生'
        }}
        actionsRender={(props) => {
          if (props.isMobile) return []
          return [
            <InfoCircleFilled
              key="InfoCircleFilled"
              onClick={() => window.open('https://github.com/ChenJiaHao1229', '_blank')}
            />,
            <QuestionCircleFilled
              key="QuestionCircleFilled"
              onClick={() => window.open('https://github.com/ChenJiaHao1229', '_blank')}
            />,
            <GithubFilled
              key="GithubFilled"
              onClick={() => window.open('https://github.com/ChenJiaHao1229', '_blank')}
            />
          ]
        }}
        location={{ pathname }}
        menuItemRender={(item, dom) => (
          <div style={{ width: '100%' }} onClick={() => navigate(item.path || '/')} key={item.key}>
            {dom}
          </div>
        )}
        {...settings}
        contentStyle={{ padding: 24, height: '100vh', overflowY: 'auto' }}
      >
        <ProCard
          bordered
          style={{ height: '100%', minHeight: 600 }}
          bodyStyle={{ overflowY: 'auto' }}
        >
          {/* 懒加载内容 */}
          <Suspense fallback={<Spin tip="加载中..." size="large" />}>
            <Outlet />
          </Suspense>
        </ProCard>
      </ProLayout>
      <SettingDrawer
        getContainer={() => document.getElementById('BH-layout')}
        settings={settings}
        onSettingChange={(changeSetting) => {
          setSetting(changeSetting)
          // 第一次加载进入不修改
          if (isInit) {
            setIsInit(false)
          } else {
            updateTheme(changeSetting).then((res) => {
              message.success(res.message)
            })
          }
        }}
        hideCopyButton
        hideHintAlert
        disableUrlParams
        // enableDarkTheme
      />
    </div>
  )
}

export default BHLayout
