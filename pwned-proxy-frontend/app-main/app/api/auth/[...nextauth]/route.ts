import NextAuth, { AuthOptions } from "next-auth";
import { authOptions } from "../../../../lib/auth";

/**
 * Example scope:
 *   "api://ccd5ce0d-5f7a-43cf-bbb8-82c9cb822f12/access_as_user"
 * Replace the above with YOUR "App Registration" for the Django API.
 *
 * The idea is to have something like:
 *   scope: "openid profile email offline_access api://<YOUR_API_CLIENT_ID>/access_as_user"
 */


const handler = NextAuth(authOptions as AuthOptions);
export { handler as GET, handler as POST };
