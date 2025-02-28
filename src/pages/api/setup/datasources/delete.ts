import type { APIRoute } from "astro";
import { removeDataSources } from "@lib/storyblokApi";

export const prerender = false;

export const POST: APIRoute = async (/* { request, url } */) => {
  try {
    const res = await removeDataSources();
    return new Response(JSON.stringify(res), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Storyblok Error:", error);
  }

  return new Response(null, { status: 400 });
};
