import React from 'react'
import ItemsList from '../../../components/shared/ItemsList'
import ConversationFallback from '../../../components/shared/ConversationFallback'
import { FaWhatsapp } from 'react-icons/fa'
const page = () => {
  return (
    <div className='w-full flex rounded-tl-2xl  bg-[#303030]'>
    <ItemsList title='Calls' placeholder='Search or start a new call' search={true}></ItemsList>
    <ConversationFallback main={<FaWhatsapp className='text-[80px] text-[#575757]'/>} footer='Your personal calls are end-to-end encrypted' />    
    </div>
  )
}

export default page