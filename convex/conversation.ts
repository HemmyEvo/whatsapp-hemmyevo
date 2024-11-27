import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createChat = mutation({
    args:{
        participants: v.array(v.id("users")),
		isGroup: v.boolean(),
		groupName: v.optional(v.string()),
		groupImage: v.optional(v.id("_storage")),
		admin: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) throw new ConvexError("Unauthorized");
        const existingChat = await ctx.db
        .query("conversations")
        .filter(q => 
            q.or(
                q.eq(q.field("participants"), args.participants),
                q.eq(q.field("participants"), args.participants.reverse())
            )
        )
        .first()

        if(existingChat){
            return existingChat._id
        }
        let groupImage
        if(args.groupImage){
            groupImage = (await ctx.storage.getUrl(args.groupImage)) as string
        }

        const chatsId = await ctx.db.insert("conversations",{
            participants: args.participants,
            isGroup: args.isGroup,
            groupName: args.groupName,
            groupImage:groupImage,
            admin: args.admin,
            isTyping: []
        })

        return chatsId
    },
})

export const getChat = query({
    args:{},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) throw new ConvexError("Unauthorized");
        const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique()
        if(!user) throw new ConvexError("User not found")
        const chats = await ctx.db.query("conversations").collect()
        const myChat = chats.filter((chat) => {
            return chat.participants.includes(user._id)
        });
        const chatWithDetails = await Promise.all(
            myChat.map(async (chat) => {
                let userDetails = {}
                if(!chat.isGroup){
                    const otherUserId = chat.participants.find(id => id !== user._id)
                    const userProfile = await ctx.db
                    .query("users")
                    .filter(q => q.eq(q.field("_id"), otherUserId))
                    .take(1)
                userDetails = userProfile[0]
                }
                const lastMessage = await ctx.db
                .query("messages")
                .filter((q) => q.eq(q.field("conversation"), chat._id))
                .order("desc")
                .take(1)

                return{
                    ...userDetails,
                    ...chat,
                    lastMessage: lastMessage[0] || null,
                }
            })
        )
        return chatWithDetails
    }
})
export const isTyping = mutation({
    args: {
      conversation: v.id("conversations"),
      userId: v.id("users"),
      isTyping: v.boolean(),
    },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError("Not authenticated");
      }
  
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .unique();
  
      if (!user) {
        throw new ConvexError("User not found");
      }
  
      const conversationId = await ctx.db
        .query("conversations")
        .filter((q) => q.eq(q.field("_id"), args.conversation))
        .first();
  
      if (!conversationId) {
        throw new ConvexError("Conversation not found");
      }
  
      if (args.isTyping) {
        // Add userId to the isTyping array if not already present
        const existingIsTyping = conversationId.isTyping?.includes(args.userId);
        if (existingIsTyping) return;
  
        const updatedIsTyping = [...(conversationId.isTyping || []), args.userId];
        await ctx.db.patch(args.conversation, { isTyping: updatedIsTyping });
      } else {
        // Remove userId from the isTyping array
        const updatedIsTyping = conversationId.isTyping?.filter(
          (id) => id !== args.userId
        );
  
        await ctx.db.patch(args.conversation, { isTyping: updatedIsTyping });
      }
    },
  });
  

 
export const kickUser = mutation({
	args: {
		conversationId: v.id("conversations"),
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		const conversation = await ctx.db
			.query("conversations")
			.filter((q) => q.eq(q.field("_id"), args.conversationId))
			.unique();

		if (!conversation) throw new ConvexError("Conversation not found");

        const updatedParticipants = conversation.participants.filter(
            (id) => id !== args.userId
          );
            
        if (updatedParticipants.length === 2) {
            await ctx.db.patch(args.conversationId, {
            participants: updatedParticipants,
        
        });
        } else if (updatedParticipants.length === 1) {
            await ctx.db.delete(args.conversationId);
        } else {
            await ctx.db.patch(args.conversationId, {
            participants: updatedParticipants,
        });
        }
	},
});

 
export const generateUploadUrl = mutation(async (ctx)=>{
    return await ctx.storage.generateUploadUrl()
})