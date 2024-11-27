'use client';

import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatContainer';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';



const Body = ({ Detail }: { Detail: any }) => {
  const params = useParams();
  const { isAuthenticated } = useConvexAuth();

  // Fetch chats
  const chats = useQuery(api.conversation.getChat, isAuthenticated ? undefined : 'skip');
  const ChatDetails = chats?.find((chat) => params.chatId === chat._id) || null;

  // Fetch messages for the current chat
  const messages = useQuery(
    api.message.getMessages,
    ChatDetails ? { conversation: ChatDetails._id } : 'skip'
  );

  // Fetch current user info
  const me = useQuery(api.user.getMe, isAuthenticated ? undefined : 'skip');

  // Mutation for updating message status
  const messageStatus = useMutation(api.message.messageStatus);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Scroll to the last message and update message status
  useEffect(() => {
    if (messages?.length && me && ChatDetails) {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });

      const { lastMessage } = Detail;

      // Check if the current user is not the sender of the last message
      if (me._id !== lastMessage.sender && Detail.isOnline) {
        messageStatus({ conversation: ChatDetails._id, status: true });
      }
    }
  }, [messages, me, Detail, messageStatus, ChatDetails]);

  if (!ChatDetails) {
    console.error('Chat not found');
    return null;
  }

  return (
    <div
      className={`flex-1 scrollbar-light-mode dark:scrollbar-dark-mode overflow-y-auto overflow-hidden relative bg-center py-1 bg-repeat bg-contain bg-[url('/Light-bkg.png')] dark:bg-[url('/Dark-bkg.jpg')]`}
    >
      <div className="mx-5 flex flex-col gap-5">
        {messages?.map((msg, idx) => (
          <div key={msg._id} className="text-wrap" ref={idx === messages.length - 1 ? lastMessageRef : null}>
            <ChatBubble
              ChatDetails={ChatDetails}
              message={msg}
              me={me}
              previousMessage={idx > 0 ? messages[idx - 1] : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Body;
