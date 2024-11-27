import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { BiPhone, BiVideo } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import GroupMembersDialog from "./group-member-dialog";
import Link from "next/link";

const Head = ({ ChatDetails }: { ChatDetails: any }) => {
  const chatImage = ChatDetails?.groupImage || ChatDetails?.image;
  const chatName = ChatDetails?.groupName || ChatDetails?.username;
  return (
    <div className="w-full h-16 bg-[#dcdfdd] dark:bg-[#303030] border-[#a09f9fc7] dark:border-[#181818c7] border-b flex items-center justify-between px-4">
      {/* Profile Section */}
      <div className="profile flex items-center space-x-4">
        <Avatar className="relative">
          <AvatarImage src={chatImage || "/placeholder.png"} className="object-cover rounded-full" />
          <AvatarFallback>
            <Skeleton className="h-12 w-12 rounded-full" />
          </AvatarFallback>
        </Avatar>
        <div className="div">
            {!ChatDetails &&(
            <div className="flex flex-col space-y-1"> 
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[50px]" />
            </div>
            )}
 
        <p className="Name capitalize">{chatName}</p>
        {ChatDetails?.isOnline && (<p className="text-xs text-[#28bd28] dark:text-[#37ee37]">Online</p>)}
        {ChatDetails?.isOnline === false && !ChatDetails?.isGroup && (<p className="text-xs text-[#4b4b4b] dark:text-[#9fa39f]">Last seen: {formatDate(new Date(ChatDetails?.lastSeen).getTime())}</p>)}
        {ChatDetails?.isGroup && <GroupMembersDialog />}
        </div>
       
      </div>

      {/* Action Buttons */}
      <div className="call-search flex items-center space-x-1">
        <div className="call dark:bg-[#464646] bg-[#aaaaaa] overflow-hidden rounded-md flex border border-[#757575] dark:border-[#575757]">
         <Link href={`/calls/${ChatDetails._id}`}>
         <button className="border-r border-[#575757] hover:bg-[#979797] dark:hover:bg-[#575757] text-[#474747] dark:text-[#d1d1d1] h-10 w-12 flex justify-center items-center">
            <BiVideo className="w-6 h-6" />
          </button>
          </Link> 
          <button className="h-10 w-12 flex justify-center hover:bg-[#979797] dark:hover:bg-[#575757] text-[#474747] dark:text-[#d1d1d1] items-center">
            <BiPhone className="w-6 h-6" />
          </button>
        </div>
        <button className="search h-10 w-10 flex rounded-md justify-center hover:bg-[#979797] dark:hover:bg-[#575757] text-[#474747] dark:text-[#d1d1d1] items-center">
          <BsSearch className="w-4" />
        </button>
      </div>
    </div>
  );
};

export default Head;
