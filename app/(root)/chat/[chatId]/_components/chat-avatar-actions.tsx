import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Ban, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";


const ChatAvatarActions = ({ me, message, ChatDetails }: any) => {
	const isMember = ChatDetails?.participants.includes(message.sender._id);
	const kickUser = useMutation(api.conversation.kickUser);
	const createConversation = useMutation(api.conversation.createChat);
	const fromAI = message.sender?.name === "ChatGPT";
	const isGroup = ChatDetails?.isGroup;

	const handleKickUser = async (e: React.MouseEvent) => {
		if (fromAI) return;
		e.stopPropagation();
		if (!ChatDetails) return;
		try {
			await kickUser({
				conversationId: ChatDetails._id,
				userId: message.sender._id,
			});
			
		} catch (error) {
			toast.error("Failed to kick user");
		}
	};

	const handleCreateConversation = async () => {
		if (fromAI) return;

		try {
			await createConversation({
				isGroup: false,
				participants: [me._id, message.sender._id],
			});


		} catch (error) {
			toast.error("Failed to create conversation");
		}
	};

	return (
		<div
			className='text-[11px] flex gap-4 justify-between font-bold cursor-pointer group'
			onClick={handleCreateConversation}
		>
			<p className="capitalize">{isGroup && message.sender.username}</p>

			{!isMember && !fromAI && isGroup && <Ban size={16} className='text-red-500' />}
			{isGroup && isMember && ChatDetails?.admin === me._id && (
				<LogOut size={16} className='text-red-500 opacity-0 group-hover:opacity-100' onClick={handleKickUser} />
			)}
		</div>
	);
};
export default ChatAvatarActions;