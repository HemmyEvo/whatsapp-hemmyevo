import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendTextMessage = mutation({
	args: {
		sender: v.string(),
		content: v.string(),
		conversation: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Not authenticated");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		const conversation = await ctx.db
			.query("conversations")
			.filter((q) => q.eq(q.field("_id"), args.conversation))
			.first();

		if (!conversation) {
			throw new ConvexError("Conversation not found");
		}

		if (!conversation.participants.includes(user._id)) {
			throw new ConvexError("You are not part of this conversation");
		}

		await ctx.db.insert("messages", {
			sender: args.sender,
			content: args.content,
			conversation: args.conversation,
			messageType: "text",
			status: false

		});

	},
});
export const sendVoiceMsg = mutation({
	args: { audioId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
	handler: async (ctx, args) => {
	  const identity = await ctx.auth.getUserIdentity();
	  if (!identity) {
		throw new ConvexError("Unauthorized");
	  }
  
	  // Get the audio content URL using the storage ID
	  const content = (await ctx.storage.getUrl(args.audioId)) as string;
  
	  // Insert the message into the database with the audio content
	  await ctx.db.insert("messages", {
		content: content,
		sender: args.sender,
		messageType: "audio", // Changed from "image" to "audio"
		conversation: args.conversation,
		status: false, // Assuming `status` is for message status, adjust as necessary
	  });
	},
  });
  
  
export const messageStatus = mutation({
	args: {
	  conversation: v.id("conversations"),
	  status: v.boolean(),
	},
	handler: async (ctx, args) => {
	  // Get the user identity to ensure authentication
	  const identity = await ctx.auth.getUserIdentity();
	  if (!identity) {
		throw new ConvexError("Not authenticated");
	  }
  
	  // Fetch the user based on the identity's token identifier
	  const user = await ctx.db
		.query("users")
		.withIndex("by_tokenIdentifier", (q) =>
		  q.eq("tokenIdentifier", identity.tokenIdentifier)
		)
		.unique();
  
	  if (!user) {
		throw new ConvexError("User not found");
	  }
  
	  // Get the latest message in the conversation
	  const lastMessage = await ctx.db
		.query("messages")
		.filter((q) => q.eq(q.field("conversation"), args.conversation))
		.order("desc")
		.first();
  
	  if (lastMessage?.status === false) {
		// Fetch all messages in the conversation
		const messages = await ctx.db
		  .query("messages")
		  .filter((q) => q.eq(q.field("conversation"), args.conversation))
		  .collect();
  
		// Filter messages with `status: true`
		const trueMessages = messages.filter((message) => message.status === false);
  
		// Update all filtered messages to the new status
		for (const message of trueMessages) {
		  await ctx.db.patch(message._id, { status: args.status });
		}
	  }
	},
  });
  
  // Query to count all unread messages
export const countUnreadMessages = query({
	args: {
	  conversation: v.id("conversations"),
	},
	handler: async (ctx, args) => {
	  // Get the user identity to ensure authentication
	  const identity = await ctx.auth.getUserIdentity();
	  if (!identity) {
		throw new ConvexError("Not authenticated");
	  }
  
	  
	  const unreadCount = await ctx.db
		.query("messages")
		.filter((q) =>
		  q.and(
			q.eq(q.field("conversation"), args.conversation),
			q.eq(q.field("status"), false)
		  )
		)
		.collect();
  
	  return unreadCount.length;
	},
  });



export const sendChatGPTMessage = mutation({
	args: {
		content: v.string(),
		conversation: v.id("conversations"),
		messageType: v.union(v.literal("text"), v.literal("image")),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("messages", {
			content: args.content,
			sender: "ChatGPT",
			messageType: args.messageType,
			conversation: args.conversation,
			status: false
		});
	},
});

// Optimized
export const getMessages = query({
	args: {
		conversation: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthorized");
		}

		const messages = await ctx.db
			.query("messages")
			.withIndex("by_conversation", (q) => q.eq("conversation", args.conversation))
			.collect();

		const userProfileCache = new Map();

		const messagesWithSender = await Promise.all(
			messages.map(async (message) => {
				if (message.sender === "ChatGPT") {
					const image = message.messageType === "text" ? "/gpt.png" : "dall-e.png";
					return { ...message, sender: { name: "ChatGPT", image } };
				}
				let sender;
				// Check if sender profile is in cache
				if (userProfileCache.has(message.sender)) {
					sender = userProfileCache.get(message.sender);
				} else {
					// Fetch sender profile from the database
					sender = await ctx.db
						.query("users")
						.filter((q) => q.eq(q.field("_id"), message.sender))
						.first();
					// Cache the sender profile
					userProfileCache.set(message.sender, sender);
				}

				return { ...message, sender };
			})
		);

		return messagesWithSender;
	},
});

export const sendImage = mutation({
	args: { imgId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const content = (await ctx.storage.getUrl(args.imgId)) as string;

		await ctx.db.insert("messages", {
			content: content,
			sender: args.sender,
			messageType: "image",
			conversation: args.conversation,
			status: false

		});
	},
});

export const sendVideo = mutation({
	args: { videoId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const content = (await ctx.storage.getUrl(args.videoId)) as string;

		await ctx.db.insert("messages", {
			content: content,
			sender: args.sender,
			messageType: "video",
			conversation: args.conversation,
			status: false
	
		});
	},
});


