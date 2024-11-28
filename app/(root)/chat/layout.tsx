"use client"
import ItemsList from '@/components/shared/ItemsList'
import React from 'react'
import ChatAction from './_components/chatAction'
import Conversation from './_components/Conversation'
import { useConvexAuth, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ItemListSkeleton } from '@/components/shared/Skeleton'

type Props = React.PropsWithChildren<{}>

const layout = ({children}: Props) => {
	
	const {isAuthenticated} = useConvexAuth()

  const chats = useQuery(api.conversation.getChat, isAuthenticated ? undefined : "skip")
  const sortedChats = chats
  ? [...chats].sort((a, b) => {
	  const aTime = a.lastMessage?._creationTime || 0;
	  const bTime = b.lastMessage?._creationTime || 0;
	  return bTime - aTime; // Newer messages appear first
	})
  : [];
  return (
    <div className='w-full flex rounded-tl-2xl  bg-[#292929]'>
      <ItemsList title='Chats' action={<ChatAction />} placeholder='Search or start a new chat' search={true}>
      		{/* Chat List */}
			<div className='my-3 flex flex-col gap-0 space-y-2 max-h-[80%] scrollbar-light-mode dark:scrollbar-dark-mode overflow-auto'>
				{/* Conversations will go here*/}
				{!isAuthenticated && <ItemListSkeleton />}
				{sortedChats?.map((chat,i) => ( <Conversation key={i} conversation={chat}/>))}
				
				{chats?.length === 0 && (
					<>
						<p className='text-center text-gray-500 text-sm mt-3'>No conversations yet</p>
						<p className='text-center text-gray-500 text-sm mt-3 '>
							We understand {"you're"} an introvert, but {"you've"} got to start somewhere 😊
						</p>
					</>
				)}
			</div>
      </ItemsList>
    {children}
    </div>
  )
}

export default layout