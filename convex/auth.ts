import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Autenticación simplificada usando la tabla leads
export const emailSignIn = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const lead = await ctx.db
      .query("leads")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!lead) {
      throw new Error("Lead no encontrado");
    }
    
    return { 
      userId: lead._id,
      email: lead.email,
      status: lead.status
    };
  },
});

export const getCurrentLead = query({
  args: { userId: v.optional(v.id("leads")) },
  handler: async (ctx, args) => {
    if (!args.userId) return null;
    return await ctx.db.get(args.userId);
  },
});
