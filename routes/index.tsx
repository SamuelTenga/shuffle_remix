import { Handlers, PageProps } from "$fresh/server.ts";
import { addTrackIfNotAlreadyQueuedAsFirst, getSavedTracks } from "../utils/spotify.ts";
import { User } from "https://raw.githubusercontent.com/RoeHH/fresh_oauth2/21c31455a31691a837ebe09fb91ac5f96d2de38d/oauth2Plugin.d.ts";

interface Props {
  count: number;
  tracks: any;
}

interface State {
  user: User | undefined;
}

export const handler: Handlers<Props, State> = {
  async GET(_req, ctx) {

    const tracks = await getSavedTracks(ctx.state.user ? ctx.state.user.accessToken || "" : "");

    
    //addTrackIfNotAlreadyQueuedAsFirst(ctx.state.user.accessToken || "", tracks[0].track.uri);
    

    return ctx.render({count: tracks.length, tracks: tracks});
  },
};



export default function Home({data}: PageProps<Props>) {
  return (
    <>
    <div class="flex">
        <div id="grid" class="grid" data-track-count={data.count}>
          {data.tracks.map((track: any) => (<img id={track.track.uri} class="track-cover" src={track.track.album.images[1].url} alt={track.track.name} /> ))}
        </div>
    </div>
    <svg id="mask-svg" width="10000" height="10000">
      <defs>
        <mask id="mask">
          <rect id="mask-rect" width="10000" height="10000" fill="white" />
          <circle id="mask-circle" cx="5000" cy="5000" r="100" fill="black" />
        </mask>
      </defs>
    </svg>
    <script src="/script.js">
    </script>
    </>
  );
}

