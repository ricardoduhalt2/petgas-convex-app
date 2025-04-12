import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    email: v.string(),
    name: v.string(),
    source: v.string(), // e.g., "user", "email", "wp_comment", "whatsapp_web"
    category: v.string(), // e.g., "wordpress", "email", "whatsapp"
    status: v.string(), // e.g., "new", "contacted", "qualified"
    score: v.optional(v.number()),
    // Define metadata structure more precisely
    metadata: v.optional(v.object({
      // Common fields
      date: v.optional(v.string()), // ISO date string
      body: v.optional(v.string()), // Main message/email body

      // Email specific
      subject: v.optional(v.string()),
      
      // WhatsApp specific
      interest: v.optional(v.string()),
      dialog: v.optional(v.any()), // Store the full Q&A object

      // WordPress comment specific
      comment_id: v.optional(v.number()),
      post_id: v.optional(v.number()),

      // WordPress user import specific (found during validation)
      notes: v.optional(v.string()), 

      // Allow other dynamic fields if needed
      // ... could add more specific fields per source later
    }))
  }).index("by_email", ["email"]) // Add index for faster lookups
});
