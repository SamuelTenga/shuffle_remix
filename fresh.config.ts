import { defineConfig } from "$fresh/server.ts";
import spotifyOauth from "https://raw.githubusercontent.com/RoeHH/fresh_oauth2/a941ece2853f44069a4cb366778acd57/providers/spotify.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

const mock = Deno.env.get("oauthClientId") ? false : true;

export default defineConfig({
  plugins: [
    spotifyOauth(
      Deno.env.get("callbackURL") || "https://shuffle-remix-36.deno.dev/oauth2/callback",
      {
        scopes: [
          "user-library-read",
          "user-read-playback-state",
          "user-read-currently-playing",
          "user-modify-playback-state",
        ],
        mock: mock,
        oauthClientId: Deno.env.get("oauthClientId") || "",
        oauthClientSecret: Deno.env.get("oauthClientSecret") || "",
      },
    ),
  ],
});
