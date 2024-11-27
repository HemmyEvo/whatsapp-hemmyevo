"use client"
import ItemsList from '@/components/shared/ItemsList'
import React from 'react'
type Props = React.PropsWithChildren<{}>

const layout = ({children}: Props) => {
  return (
    <div className='w-full flex rounded-tl-2xl  bg-[#292929]'>
      <ItemsList title='Calls' placeholder='Search or start a new call' search={true}>
      		{/* Chat List */}
			<div className='my-3 flex flex-col gap-0 space-y-2 max-h-[80%] scrollbar-light-mode dark:scrollbar-dark-mode overflow-auto'>
			</div>
      </ItemsList>
    {children}
    </div>
  )
}

export default layout