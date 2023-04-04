import React, { useState, useEffect, ReactNode } from 'react'

type ShowDomType = {
  show: boolean
  children: ReactNode
}
// 第一次不渲染，后续不卸载
const ShowDom: React.FC<ShowDomType> = ({ show, children }) => {
  const [one, setOne] = useState(show)
  useEffect(() => {
    if (!one && show) setOne(true)
  }, [show])
  return one ? <div style={{ display: show ? 'block' : 'none' }}>{children}</div> : null
}
export default ShowDom
