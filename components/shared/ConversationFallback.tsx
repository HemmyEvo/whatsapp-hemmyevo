import { LockIcon } from 'lucide-react'
import React from 'react'

type Props = React.PropsWithChildren<{
    main?: any,
    footer?: string
}>

const ConversationFallback = ({children, main, footer}: Props) => {
  return (
    <div className='lg:w-[70%] relative bg-[#dddddd] dark:bg-[#303030] h-[100vh] hidden lg:grid justify-center items-center'>
        <main>
            <div className='text-[#5a5a5a] dark:text-[#979797] text-sm'>{main}</div>
        </main>
        <footer className='absolute  bottom-10 left-0 right-0'>
            <p className='text-[#888888] flex justify-center items-center space-x-4 text-sm'>
                <span><LockIcon className='w-4 h-4'/></span>
                <span>{footer}</span>
              </p>
        </footer>
    </div>
  )
}

export default ConversationFallback