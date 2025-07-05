import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { oauth2Client } from "../../utils/oauth2.ts";

export const handler: Handlers = {
  async GET(req) {
    const { response } = await oauth2Client.code.getToken(req.url);
    const headers = new Headers(response.headers);
    setCookie(headers, {
      name: "spotify_token",
      value: response.access_token,
      maxAge: response.expires_in,
      path: "/",
    });

    headers.set("location", "/");
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};