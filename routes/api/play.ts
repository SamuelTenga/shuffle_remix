import { FreshContext } from "$fresh/server.ts";
import { User } from "https://raw.githubusercontent.com/RoeHH/fresh_oauth2/21c31455a31691a837ebe09fb91ac5f96d2de38d/providers/spotify.ts";
import { addTrackIfNotAlreadyQueuedAsFirst, getSavedTracks } from "../../utils/spotify.ts";

interface State {
  user: User;
}

export const handler = async (req: Request, ctx: FreshContext<State>): Promise<Response> => {
  const tracks = (await req.json()).tracks;
  console.log("API /api/play called. ctx.state.user:", ctx.state.user);

  // Defensive: error if no user
  if (!ctx.state.user) {
    console.error("No user found in ctx.state! Not authenticated.");
    return new Response("Not authenticated", { status: 401 });
  }

  for (const track of tracks.sort((_a:string, _b: string) => 0.5 - Math.random())) {
    await addTrackIfNotAlreadyQueuedAsFirst(ctx.state.user.accessToken || "", track);
  }
  return new Response(undefined, { status: 200, statusText: "OK" });
};
