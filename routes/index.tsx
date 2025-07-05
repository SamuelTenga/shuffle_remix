import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookie } from "$std/http/cookie.ts";
import { getSavedTracks } from "../utils/spotify.ts";

interface Props {
  count: number;
  tracks: any;
  isLoggedIn: boolean;
}

export const handler: Handlers<Props> = {
  async GET(req, ctx) {
    const token = getCookie(req.headers, "spotify_token");

    if (!token) {
      return ctx.render({ count: 0, tracks: [], isLoggedIn: false });
    }

    const tracks = await getSavedTracks(token);

    return ctx.render({ count: tracks.length, tracks: tracks, isLoggedIn: true });
  },
};

export default function Home({ data }: PageProps<Props>) {
  if (!data.isLoggedIn) {
    return (
      <div>
        <a href="/oauth/signin">Login with Spotify</a>
      </div>
    );
  }
  return (
    <>
      <div class="flex">
        <div id="grid" class="grid" data-track-count={data.count}>
          {data.tracks.map((track: any) => (
            <img
              id={track.track.uri}
              class="track-cover"
              src={track.track.album.images[1].url}
              alt={track.track.name}
            />
          ))}
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
      <script src="/script.js"></script>
    </>
  );
}