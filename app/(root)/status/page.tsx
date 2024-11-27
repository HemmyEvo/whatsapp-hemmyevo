import React from 'react'
import ItemsList from '../../../components/shared/ItemsList'
import ConversationFallback from '../../../components/shared/ConversationFallback'
const page = () => {
  return (
    <div className='w-full flex rounded-tl-2xl  bg-[#303030]'>
        <ItemsList title='Status' search={false}></ItemsList>
        <ConversationFallback main='Click on a contact to view their status updates' footer='Status updates are end-to-end encrypted' />    
    </div>
  )
}

export default page