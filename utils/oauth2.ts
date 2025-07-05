import { OAuth2Client } from "https://deno.land/x/oauth2_client@v1.0.2/mod.ts";

export const oauth2Client = new OAuth2Client({
  clientId: Deno.env.get("oauthClientId") || "",
  clientSecret: Deno.env.get("oauthClientSecret") || "",
  authorizationEndpointUri: "https://accounts.spotify.com/authorize",
  tokenUri: "https://accounts.spotify.com/api/token",
  redirectUri: Deno.env.get("callbackURL") || "http://localhost:8000/oauth/callback",
  defaults: {
    scope: [
      "user-library-read",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-modify-playback-state",
    ].join(" "),
  },
});