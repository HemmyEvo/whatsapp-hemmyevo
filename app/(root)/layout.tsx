import SideNav from '@/components/shared/SideNav'
import React from 'react'

type Props = React.PropsWithChildren<{}>

const layout = ({children}: Props) => {
  return (
    <SideNav>{children}</SideNav>
  )
}

export default layout