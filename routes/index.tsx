import { Handlers, PageProps } from "$fresh/server.ts";
import { addTrackIfNotAlreadyQueuedAsFirst, getSavedTracks } from "../utils/spotify.ts";
import { User } from "../../fresh_oauth2/oauth2Plugin.d.ts";

interface Props {
  count: number;
  tracks: any;
}

interface State {
  user: User;
}

export const handler: Handlers<Props, State> = {
  async GET(_req, ctx) {

    const tracks = await getSavedTracks(ctx.state.user.accessToken || "");

    
    //addTrackIfNotAlreadyQueuedAsFirst(ctx.state.user.accessToken || "", tracks[0].track.uri);
    

    return ctx.render({count: 420, tracks: tracks});
  },
};



export default function Home({data}: PageProps<Props>) {
  return (
    <>
    <div class="flex">
        <div id="grid" class="grid">
          {data.tracks.map((track: any) => (<img class="track-cover" src={track.track.album.images[1].url} alt={track.track.name} /> ))}
        </div>
    </div>
    <script src="/script.js"></script>
    </>
  );
}

