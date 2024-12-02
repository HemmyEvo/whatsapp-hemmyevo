import { formatDate } from "@/lib/utils";
import {  ImageIcon, VideoIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageReceivedSvg, MessageSeenSvg, MessageSentSvg } from "@/lib/svgs";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import { BiMicrophone } from "react-icons/bi";

const Conversation = ({ conversation, activeFilter, setGroups,setUnread, setUsername }: { conversation: any, activeFilter: any,setGroups: any,setUnread:any, setUsername:any }) => {
  const conversationImage = conversation.groupImage || conversation.image;
  const conversationName = conversation.groupName || conversation.username;
  const lastMessage = conversation.lastMessage;
  const lastMessageType = lastMessage?.messageType;
  const me = useQuery(api.user.getMe);
  const users = useQuery(api.user.getUsers);
  const path = usePathname();
  const isActive = path.includes(conversation._id);
  const messages = useQuery(
    api.message.getMessages,
    conversation ? { conversation: conversation._id } : 'skip'
  );
  // Fetch the unread message count for this specific conversation
  const messageCount = useQuery(api.message.countUnreadMessages, {
    conversation: conversation._id,
  });
  const renderTypingStatus = () => {
    if (conversation.isTyping && conversation.isTyping.length > 0) {
      const typingUsers = conversation.isTyping.filter(
        (userId: string) => userId !== me?._id
      );

      const allTypingUsernames = users
        ?.filter((user) => typingUsers.includes(user._id))
        .map((user) => user.username);

      if (allTypingUsernames && allTypingUsernames.length > 0) {
        const displayedTypingUsers =
          allTypingUsernames.length > 2
            ? allTypingUsernames.slice(-2)
            : allTypingUsernames;

        return (
          <span className="text-xs text-green-500">
            {conversation.isGroup
              ? `${displayedTypingUsers.join(", ")}${
                  allTypingUsernames.length > 2
                    ? ", and others are typing..."
                    : " is typing..."
                }`
              : "typing..."}
          </span>
        );
      }
    }
    return null;
  };

  const renderLastMessageContent = () => {
    if (!lastMessage) return <span>Say Hi!</span>;

    if (lastMessageType === "text") {
      return (
        <span className="text-xs">
          {lastMessage.content.length > 30
            ? `${lastMessage.content.slice(0, 30)}...`
            : lastMessage.content}
        </span>
      );
    }

    if (lastMessageType === "image") {
      return (
        <div className="flex items-center space-x-1">
          <ImageIcon size={14} />
          <p>Photo</p>
        </div>
      );
    }
    if (lastMessageType === "audio") {
      return (
        <div className="flex items-center space-x-1">
          <BiMicrophone size={14} />
          <p>Audio</p>
        </div>
      );
    }

    if (lastMessageType === "video") {
      return (
        <div className="flex items-center space-x-1">
          <VideoIcon size={19} />
          <p>Video</p>
        </div>
      );
    }

    return null;
  };
  if (activeFilter === "Groups" && conversation.isGroup) return (
    <Link
      href={`/chat/${conversation._id}`}
      className={`flex gap-3 cursor-default items-center hover:bg-[#c7c7c7] dark:hover:bg-[#3f3f3f] ${
        isActive && "dark:bg-[#3f3f3f] bg-[#c7c7c7]"
      } rounded-[5px] p-3 w-full`}
    >
      <Avatar className="overflow-visible relative">
        {conversation.isOnline && (
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full" />
        )}
        <AvatarImage
          src={conversationImage || "/placeholder.png"}
          className="object-cover rounded-full"
        />
        <AvatarFallback>
          <div className="animate-pulse bg-[#aaaaaa] dark:bg-[#353535] w-full h-full rounded-full"></div>
        </AvatarFallback>
      </Avatar>

      <div className="w-full">
        <div className="flex items-center">
          <h3 className="text-xs lg:text-sm capitalize font-medium">
            {conversationName}
          </h3>
          <span className="text-[10px] lg:text-xs text-gray-500 ml-auto">
            {formatDate(
              lastMessage?._creationTime || conversation._creationTime
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-[12px] mt-1 text-gray-500 flex items-center gap-1">
            {
           lastMessage?.sender === me?._id 
        ? (messages?.[messages.length - 1]?.status 
           ? <MessageReceivedSvg /> 
             : conversation.isOnline 
                ? <MessageSeenSvg /> 
                 : <MessageSentSvg />) 
        : null
          }
    
            <p className="capitalize">
              {!conversation.isTyping.length &&
                conversation.isGroup &&
                lastMessage?.sender &&
                users
                  ?.filter((user) => lastMessage.sender === user._id)
                  .map((user) => `${user.username}:`)}
            </p>

            {!conversation.isTyping.length &&
              conversation.isGroup &&
              lastMessage?.sender === me?._id &&
              "You:"}

            {renderTypingStatus() || renderLastMessageContent()}
          </div>
          {!conversation.isGroup && messageCount && lastMessage?.sender !== me?._id && messageCount > 0 ? (
            <div className="w-6 h-6 p-2 rounded-[100%] bg-[#28be28] dark:bg-[#125712] items-center justify-center flex text-[10px]">
              {messageCount}
            </div>
          ): null}
        </div>
      </div>
    </Link>
  );


  if (activeFilter === "Username" && !conversation.isGroup) {
    return (
    <Link
      href={`/chat/${conversation._id}`}
      className={`flex gap-3 cursor-default items-center hover:bg-[#c7c7c7] dark:hover:bg-[#3f3f3f] ${
        isActive && "dark:bg-[#3f3f3f] bg-[#c7c7c7]"
      } rounded-[5px] p-3 w-full`}
    >
      <Avatar className="overflow-visible relative">
        {conversation.isOnline && (
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full" />
        )}
        <AvatarImage
          src={conversationImage || "/placeholder.png"}
          className="object-cover rounded-full"
        />
        <AvatarFallback>
          <div className="animate-pulse bg-[#aaaaaa] dark:bg-[#353535] w-full h-full rounded-full"></div>
        </AvatarFallback>
      </Avatar>

      <div className="w-full">
        <div className="flex items-center">
          <h3 className="text-xs lg:text-sm capitalize font-medium">
            {conversationName}
          </h3>
          <span className="text-[10px] lg:text-xs text-gray-500 ml-auto">
            {formatDate(
              lastMessage?._creationTime || conversation._creationTime
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-[12px] mt-1 text-gray-500 flex items-center gap-1">
            {
           lastMessage?.sender === me?._id 
        ? (messages?.[messages.length - 1]?.status 
           ? <MessageReceivedSvg /> 
             : conversation.isOnline 
                ? <MessageSeenSvg /> 
                 : <MessageSentSvg />) 
        : null
          }
    
            <p className="capitalize">
              {!conversation.isTyping.length &&
                conversation.isGroup &&
                lastMessage?.sender &&
                users
                  ?.filter((user) => lastMessage.sender === user._id)
                  .map((user) => `${user.username}:`)}
            </p>

            {!conversation.isTyping.length &&
              conversation.isGroup &&
              lastMessage?.sender === me?._id &&
              "You:"}

            {renderTypingStatus() || renderLastMessageContent()}
          </div>
          {!conversation.isGroup && messageCount && lastMessage?.sender !== me?._id && messageCount > 0 ? (
            <div className="w-6 h-6 p-2 rounded-[100%] bg-[#28be28] dark:bg-[#125712] items-center justify-center flex text-[10px]">
              {messageCount}
            </div>
          ): null}
        </div>
      </div>
    </Link>
  )};


  if (activeFilter === "Unread" && messageCount && lastMessage?.sender !== me?._id && messageCount > 0){
    
    return (
    <Link
      href={`/chat/${conversation._id}`}
      className={`flex gap-3 cursor-default items-center hover:bg-[#c7c7c7] dark:hover:bg-[#3f3f3f] ${
        isActive && "dark:bg-[#3f3f3f] bg-[#c7c7c7]"
      } rounded-[5px] p-3 w-full`}
    >
      <Avatar className="overflow-visible relative">
        {conversation.isOnline && (
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full" />
        )}
        <AvatarImage
          src={conversationImage || "/placeholder.png"}
          className="object-cover rounded-full"
        />
        <AvatarFallback>
          <div className="animate-pulse bg-[#aaaaaa] dark:bg-[#353535] w-full h-full rounded-full"></div>
        </AvatarFallback>
      </Avatar>

      <div className="w-full">
        <div className="flex items-center">
          <h3 className="text-xs lg:text-sm capitalize font-medium">
            {conversationName}
          </h3>
          <span className="text-[10px] lg:text-xs text-gray-500 ml-auto">
            {formatDate(
              lastMessage?._creationTime || conversation._creationTime
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-[12px] mt-1 text-gray-500 flex items-center gap-1">
            {
           lastMessage?.sender === me?._id 
        ? (messages?.[messages.length - 1]?.status 
           ? <MessageReceivedSvg /> 
             : conversation.isOnline 
                ? <MessageSeenSvg /> 
                 : <MessageSentSvg />) 
        : null
          }
    
            <p className="capitalize">
              {!conversation.isTyping.length &&
                conversation.isGroup &&
                lastMessage?.sender &&
                users
                  ?.filter((user) => lastMessage.sender === user._id)
                  .map((user) => `${user.username}:`)}
            </p>

            {!conversation.isTyping.length &&
              conversation.isGroup &&
              lastMessage?.sender === me?._id &&
              "You:"}

            {renderTypingStatus() || renderLastMessageContent()}
          </div>
          {!conversation.isGroup && messageCount && lastMessage?.sender !== me?._id && messageCount > 0 ? (
            <div className="w-6 h-6 p-2 rounded-[100%] bg-[#28be28] dark:bg-[#125712] items-center justify-center flex text-[10px]">
              {messageCount}
            </div>
          ): null}
        </div>
      </div>
    </Link>
  );
  }

  if (activeFilter === null) return (
    <Link
      href={`/chat/${conversation._id}`}
      className={`flex gap-3 cursor-default items-center hover:bg-[#c7c7c7] dark:hover:bg-[#3f3f3f] ${
        isActive && "dark:bg-[#3f3f3f] bg-[#c7c7c7]"
      } rounded-[5px] p-3 w-full`}
    >
      <Avatar className="overflow-visible relative">
        {conversation.isOnline && (
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full" />
        )}
        <AvatarImage
          src={conversationImage || "/placeholder.png"}
          className="object-cover rounded-full"
        />
        <AvatarFallback>
          <div className="animate-pulse bg-[#aaaaaa] dark:bg-[#353535] w-full h-full rounded-full"></div>
        </AvatarFallback>
      </Avatar>

      <div className="w-full">
        <div className="flex items-center">
          <h3 className="text-xs lg:text-sm capitalize font-medium">
            {conversationName}
          </h3>
          <span className="text-[10px] lg:text-xs text-gray-500 ml-auto">
            {formatDate(
              lastMessage?._creationTime || conversation._creationTime
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-[12px] mt-1 text-gray-500 flex items-center gap-1">
            {
           lastMessage?.sender === me?._id 
        ? (messages?.[messages.length - 1]?.status 
           ? <MessageReceivedSvg /> 
             : conversation.isOnline 
                ? <MessageSeenSvg /> 
                 : <MessageSentSvg />) 
        : null
          }
    
            <p className="capitalize">
              {!conversation.isTyping.length &&
                conversation.isGroup &&
                lastMessage?.sender &&
                users
                  ?.filter((user) => lastMessage.sender === user._id)
                  .map((user) => `${user.username}:`)}
            </p>

            {!conversation.isTyping.length &&
              conversation.isGroup &&
              lastMessage?.sender === me?._id &&
              "You:"}

            {renderTypingStatus() || renderLastMessageContent()}
          </div>
          {!conversation.isGroup && messageCount && lastMessage?.sender !== me?._id && messageCount > 0 ? (
            <div className="w-6 h-6 p-2 rounded-[100%] bg-[#28be28] dark:bg-[#125712] items-center justify-center flex text-[10px]">
              {messageCount}
            </div>
          ): null}
        </div>
      </div>
    </Link>
  );
};

export default Conversation;
