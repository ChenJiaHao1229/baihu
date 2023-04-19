import React, { useState } from 'react'
import { Tabs } from 'antd'
import ShowDom from '@/components/ShowDom'
import PasswordManage from './PasswordManage'

// 标签列表
const TabList = [{ key: 'password', label: '修改密码' }]

const Setting: React.FC = () => {
  const [active, setAcitve] = useState<string>('password')
  return (
    <>
      <Tabs
        onChange={setAcitve}
        type="card"
        items={TabList.map((_) => {
          return {
            label: _.label,
            key: _.key
          }
        })}
      />

      <ShowDom show={active === 'password'}>
        <PasswordManage />
      </ShowDom>
    </>
  )
}

export default Setting
