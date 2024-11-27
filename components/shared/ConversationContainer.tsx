import React from 'react'

type Props = React.PropsWithChildren<{}>

const ConversationContainer = ({children}: Props) => {
  return (
    <div className='lg:w-[70%] bg-[#dddddd] dark:bg-[#303030] relative h-[100vh] hidden lg:grid '>{children}</div>
  )
}

export default ConversationContainer