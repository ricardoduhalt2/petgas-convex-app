import { query } from "./_generated/server";
import { DataModel } from "./customTypes.d";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const result = await ctx.db.query("leads").order("desc").paginate(args.paginationOpts);
    return result;
  },
});
