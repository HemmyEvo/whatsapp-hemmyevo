import React from 'react'
import ItemsList from '../../../components/shared/ItemsList'
import ConversationFallback from '../../../components/shared/ConversationFallback'
import { FaWhatsapp } from 'react-icons/fa'
const page = () => {
  return (
    <ConversationFallback main={<FaWhatsapp className='text-[80px] text-[#575757]'/>} footer='Your personal calls are end-to-end encrypted' />    
  )
}

export default page