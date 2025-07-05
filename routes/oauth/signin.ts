import { Handlers } from "$fresh/server.ts";
import { oauth2Client } from "../../utils/oauth2.ts";

export const handler: Handlers = {
  async GET(_req) {
    return Response.redirect(await oauth2Client.code.getAuthorizationUri());
  },
};