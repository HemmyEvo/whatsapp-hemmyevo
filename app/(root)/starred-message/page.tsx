import ConversationFallback from '@/components/shared/ConversationFallback'
import ItemsList from '@/components/shared/ItemsList'
import React from 'react'

import { FaWhatsapp } from 'react-icons/fa'
const page = () => {
  return (
    <div className='w-full rounded-tl-2xl flex  bg-[#303030]'>
      <ItemsList title='Starred messages' placeholder='Search starred messages' search={true}></ItemsList>
      <ConversationFallback 
      main={
      <div className='flex justify-center flex-col items-center space-y-2'>
        <FaWhatsapp className='text-[80px] text-[#575757]'/> 
        <p className='text-white font-light text-lg'>Whatsapp for Windows</p>
        <div className="text max-w-prose text-center text-sm  ">
        <p>Send and receive messages without keeping your phone online.</p>
        <p>Use Whatsapp on up to 4 linked devices and 1 phone at the same time.</p>
        </div>
        </div>
      } 
      footer='End-to-end encrypted' />    
    </div>
  )
}

export default page