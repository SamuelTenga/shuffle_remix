import { FreshContext } from "$fresh/server.ts";
import { User } from "../../../fresh_oauth2/oauth2Plugin.d.ts";
import { addTrackIfNotAlreadyQueuedAsFirst, getSavedTracks } from "../../utils/spotify.ts";

interface State {
  user: User;
}

export const handler = async (req: Request, ctx: FreshContext<State>): Promise<Response> => {
  const tracks = (await req.json()).tracks

  for (const track of tracks.sort((_a:string, _b: string) => 0.5 - Math.random())) {
    await addTrackIfNotAlreadyQueuedAsFirst(ctx.state.user.accessToken || "", track);
  }
  return new Response(undefined, { status: 200, statusText: "OK" });
};
