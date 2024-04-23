import { FreshContext } from "$fresh/server.ts";
import { User } from "../../../fresh_oauth2/oauth2Plugin.d.ts";
import { addTrackIfNotAlreadyQueuedAsFirst, getSavedTracks } from "../../utils/spotify.ts";

interface State {
  user: User;
}

export const handler = async (req: Request, ctx: FreshContext<State>): Promise<Response> => {
  const tracks = await getSavedTracks(ctx.state.user.accessToken || "");
  const track = tracks[(await req.json()).track];
  console.log(track);
  
  await addTrackIfNotAlreadyQueuedAsFirst(ctx.state.user.accessToken || "", track.track.uri);
  
  return new Response(undefined, { status: 200, statusText: "OK" });
};
