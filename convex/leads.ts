import { query } from "./_generated/server";
import { DataModel } from "./customTypes.d";

export const list = query({
  handler: async (ctx): Promise<DataModel["leads"][]> => {
    return await ctx.db.query("leads").order("desc").collect();
  },
});
