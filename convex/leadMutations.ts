import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    source: v.string(),
    category: v.string(),
    status: v.string(),
    score: v.optional(v.number()),
    // Align metadata argument with the schema definition
    metadata: v.optional(v.object({
      date: v.optional(v.string()),
      body: v.optional(v.string()),
      subject: v.optional(v.string()),
      interest: v.optional(v.string()),
      dialog: v.optional(v.any()),
      comment_id: v.optional(v.number()),
      post_id: v.optional(v.number()),
      notes: v.optional(v.string()),
    }))
  },
  handler: async (ctx, args) => {
    // Add a check for existing lead by email before inserting
    const existingLead = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingLead) {
      // Optionally update the existing lead instead of inserting a duplicate
      // For now, we'll just skip insertion if email exists to avoid duplicates
      console.log(`Lead with email ${args.email} already exists. Skipping insertion.`);
      return; // Or throw an error, or update logic
    }

    await ctx.db.insert("leads", {
      email: args.email,
      name: args.name,
      source: args.source,
      category: args.category,
      status: args.status,
      score: args.score || 0,
      metadata: args.metadata || {}
    });
  }
});
