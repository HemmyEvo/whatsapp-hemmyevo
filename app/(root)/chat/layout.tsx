"use client";

import React, { useState } from "react";
import ItemsList from "@/components/shared/ItemsList";
import ChatAction from "./_components/chatAction";
import Conversation from "./_components/Conversation";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ItemListSkeleton } from "@/components/shared/Skeleton";

type Props = React.PropsWithChildren<{}>;

const Layout = ({ children }: Props) => {
  const { isAuthenticated } = useConvexAuth();
  const chats = useQuery(api.conversation.getChat, isAuthenticated ? undefined : "skip");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [unread, setUnread] = useState(false);
  const [groups, setGroups] = useState(false);
  const [username, setUsername] = useState(false);

  const sortedChats = chats
    ? [...chats].sort((a, b) => {
        const aTime = a.lastMessage?._creationTime || 0;
        const bTime = b.lastMessage?._creationTime || 0;
        return bTime - aTime; // Newer messages appear first
      })
    : [];


  return (
    <div className="w-full flex rounded-tl-2xl bg-[#292929]">
      <ItemsList
        title="Chats"
        action={<ChatAction setActiveFilter={setActiveFilter} />}
        placeholder="Search or start a new chat"
        search
      >
        <div className="my-3 flex flex-col gap-0 space-y-2 max-h-[80%] overflow-auto scrollbar-light-mode dark:scrollbar-dark-mode">
          {!isAuthenticated && <ItemListSkeleton />}
          {sortedChats.map((chat, i) => (
            <Conversation key={i} conversation={chat} activeFilter={activeFilter} setGroups={setGroups} setUnread={setUnread} setUsername={setUsername}  />
          ))}
          {activeFilter === null && chats?.length === 0 && (
            <>
              <p className="text-center text-gray-500 text-sm mt-3">No conversations yet</p>
              <p className="text-center text-gray-500 text-sm mt-3">
                We understand {"you're"} an introvert, but {"you've"} got to start somewhere 😊
              </p>
            </>
          )}
          {activeFilter === "Unread"  && unread && (
            <>
              <p className="text-center text-gray-500 text-sm mt-3">You have no unread messages</p>
            </>
          )}
          {activeFilter === "Groups" && groups && (
            <>
              <p className="text-center text-gray-500 text-sm mt-3">You have no group messages</p>
            </>
          )}
          {activeFilter === "Username" && username && (
            <>
              <p className="text-center text-gray-500 text-sm mt-3">You have no username messages</p>
            </>
          )}
        </div>
      </ItemsList>
      {children}
    </div>
  );
};

export default Layout;
