'use client'
import ConversationFallback from '@/components/shared/ConversationFallback'
import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'


const page = () => {
  return (
      <ConversationFallback 
      main={
      <div className='flex justify-center flex-col items-center space-y-2'>
        <FaWhatsapp className='text-[80px] text-[#cecece] dark:text-[#575757]'/> 
        <p className='text-black dark:text-white font-light text-lg'>Whatsapp for Windows</p>
        <div className="text max-w-prose text-center text-sm  ">
        <p>Send and receive messages without keeping your phone online.</p>
        <p>Use Whatsapp on up to 4 linked devices and 1 phone at the same time.</p>
        </div>
        </div>
      } 
      footer='End-to-end encrypted' />    
  )
}

export default page