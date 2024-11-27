import ItemsList from '@/components/shared/ItemsList'
import React from 'react'
const page = () => {
  return (
    <div className='w-full rounded-tl-2xl  bg-[#303030]'><ItemsList title='Status' search={true}></ItemsList></div>
  )
}

export default page