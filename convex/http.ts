import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/import-leads",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Configurar CORS
    const origin = request.headers.get("origin");
    // Permitir todas las solicitudes temporalmente para la migración
    // if (origin && !origin.includes("convex.site")) {
    //   return new Response("CORS not allowed", { status: 403 });
    // }

    const data = await request.json();

    await ctx.runMutation(api.leadMutations.create, {
      email: data.email,
      name: data.name,
      source: data.source || "email",
      category: data.category || "lead",
      status: data.status || "new",
      score: data.score,
      metadata: data.metadata || {}
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST"
      }
    });
  })
});

export default http;
