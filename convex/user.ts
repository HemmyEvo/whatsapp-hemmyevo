import { ConvexError, v } from "convex/values";
import { internalMutation,mutation,query } from "./_generated/server";

export const createUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		email: v.string(),
		username: v.string(),
		name: v.string(),
		image: v.string(),
		lastSeen:v.number()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("users", {
			tokenIdentifier: args.tokenIdentifier,
			email: args.email,
			username: args.username,
			name: args.name,
			image: args.image,
			isOnline: true,
			lastSeen:args.lastSeen
		});
	},
});

export const updateUser = internalMutation({
	args: { tokenIdentifier: v.string(),
		email: v.string(),
		username: v.string(),
		name: v.string(),
		image: v.string() },
	async handler(ctx, args) {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		await ctx.db.patch(user._id, {
			image: args.image,
			email: args.email,
			username: args.username,
			name: args.name,
		});
	},
});

export const setUserOnline = internalMutation({
	args: { tokenIdentifier: v.string(),lastSeen: v.number() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}
		if (user.lastSeen !== args.lastSeen) {
		await ctx.db.patch(user._id, { lastSeen: args.lastSeen });
		}
		await ctx.db.patch(user._id, { isOnline: true });
	},
});



export const setUserOffline = internalMutation({
	args: { tokenIdentifier: v.string(),lastSeen: v.number()  },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}
		// Update lastSeen only if it has changed
		if (user.lastSeen !== args.lastSeen) {
		await ctx.db.patch(user._id, { lastSeen: args.lastSeen });
		}

			
		await ctx.db.patch(user._id, { isOnline: false });
	},
});

export const getUsers = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const users = await ctx.db.query("users").collect();
		return users.filter((user) => user.tokenIdentifier !== identity.tokenIdentifier);
	},
});

export const getMe = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		return user;
	},
});

export const getGroupMembers = query({
	args: { conversationId: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const conversation = await ctx.db
			.query("conversations")
			.filter((q) => q.eq(q.field("_id"), args.conversationId))
			.first();
		if (!conversation) {
			throw new ConvexError("Conversation not found");
		}

		const users = await ctx.db.query("users").collect();
		const groupMembers = users.filter((user) => conversation.participants.includes(user._id));

		return groupMembers;
	},
});


export const deleteUserAndRelatedData = internalMutation({
	args: {
	  tokenIdentifier: v.string(),
	},
	handler: async (ctx, args) => {
	  const user = await ctx.db
		.query("users")
		.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
		.unique();
  
	  if (!user) {
		console.log("User not found for deletion:", args.tokenIdentifier);
		return;
	  }
  
	  // Delete all messages sent by the user
	  const messages = await ctx.db
		.query("messages")
		.filter((q) => q.eq(q.field("sender"), user._id))
		.collect();
  
	  for (const message of messages) {
		await ctx.db.delete(message._id);
	  }
  
	  // Fetch all conversations and filter for those the user participated in
	  const conversations = await ctx.db.query("conversations").collect();
	  const userConversations = conversations.filter((conversation) =>
		conversation.participants.includes(user._id)
	  );
  
	  for (const conversation of userConversations) {
		const updatedParticipants = conversation.participants.filter((id) => id !== user._id);
  
		if (updatedParticipants.length === 2) {
            await ctx.db.patch(conversation._id, {
            participants: updatedParticipants,
        
        });
        } else if (updatedParticipants.length === 1) {
            await ctx.db.delete(conversation._id);
        } else {
            await ctx.db.patch(conversation._id, {
            participants: updatedParticipants,
        });
        }
	}
	}
  });
  
  