import constant from '@/utils/constant'
import { GithubFilled, InfoCircleFilled, QuestionCircleFilled } from '@ant-design/icons'
import type { ProSettings } from '@ant-design/pro-components'
import { ProLayout, SettingDrawer, ProCard } from '@ant-design/pro-components'
import { message, Spin } from 'antd'
import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getTheme, updateTheme } from '@/api/user'

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
        siderWidth={256}
        route={constant.menuRoute}
        appList={constant.otherAppList}
        menu={{ type: 'sub' }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          title: '七妮妮'
        }}
        actionsRender={(props) => {
          if (props.isMobile) return []
          return [
            <InfoCircleFilled key="InfoCircleFilled" />,
            <QuestionCircleFilled key="QuestionCircleFilled" />,
            <GithubFilled key="GithubFilled" />
          ]
        }}
        location={{ pathname }}
        menuItemRender={(item, dom) => (
          <div style={{ width: '100%' }} onClick={() => navigate(item.path || '/')}>
            {dom}
          </div>
        )}
        {...settings}
        contentStyle={{ padding: 24, height: '100vh' }}
      >
        <ProCard bordered style={{ height: '100%', minHeight: 800, overflowY: 'auto' }}>
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
        enableDarkTheme
      />
    </div>
  )
}

export default BHLayout
