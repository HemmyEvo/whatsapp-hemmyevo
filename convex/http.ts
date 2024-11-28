import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payloadString = await req.text();
    const headerPayload = req.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-signature": headerPayload.get("svix-signature")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
        },
      });

      switch (result.type) {
        case "user.created": {
          const lastSeen = result.data.last_sign_in_at
            ? new Date(result.data.last_sign_in_at).getTime()
            : new Date().getTime();
          await ctx.runMutation(internal.user.createUser, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.id}`,
            email: result.data.email_addresses[0]?.email_address,
            username: result.data.username ?? "",
            name: `${result.data.first_name ?? "Guest"} ${result.data.last_name ?? ""}`,
            image: result.data.image_url,
            lastSeen,
          });
          break;
        }
        case "user.updated": 
          await ctx.runMutation(internal.user.updateUser, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.id}`,
            email: result.data.email_addresses[0]?.email_address,
            username: result.data.username ?? "",
            name: `${result.data.first_name ?? "Guest"} ${result.data.last_name ?? ""}`,
            image: result.data.image_url,
          });
          break;

        case "user.deleted": {
          const tokenIdentifier = `${process.env.CLERK_APP_DOMAIN}|${result.data.id}`;
          await ctx.runMutation(internal.user.deleteUserAndRelatedData, {
            tokenIdentifier,
          });
          break;
        }
        
        case "session.created":{
			const lastSeen = result.data.last_active_at
            ? new Date(result.data.last_active_at).getTime()
            : new Date().getTime();
          await ctx.runMutation(internal.user.setUserOnline, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.user_id}`,
			lastSeen
          });
          break;
		}
        case "session.removed":
			const lastSeen = result.data.last_active_at
            ? new Date(result.data.last_active_at).getTime()
            : new Date().getTime();
          await ctx.runMutation(internal.user.setUserOffline, {
            tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.user_id}`,
			lastSeen
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (error) {
      console.log("Webhook Error🔥🔥", error);
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

export default http;
