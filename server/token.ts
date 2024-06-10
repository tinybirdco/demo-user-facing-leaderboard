"use server";

import jwt from "jsonwebtoken";

const TINYBIRD_SIGNING_TOKEN = process.env.TINYBIRD_SIGNING_TOKEN ?? "";
const WORKSPACE_ID = process.env.TINYBIRD_WORKSPACE ?? ""; // Get this ID by running `tb workspace current`

// Server function that generates a JWT
// All the Tinybird related data won't be visible in the browser
export async function generateJWT(
  pipe: string,
  params: Record<string, any> = {}
) {
  const next10minutes = new Date();
  next10minutes.setTime(next10minutes.getTime() + 1000 * 60 * 10);

  const payload = {
    workspace_id: WORKSPACE_ID,
    name: "leaderboard",
    exp: next10minutes.getTime() / 1000, // Token only valid for the next 10 minutes
    scopes: [
      {
        type: "PIPES:READ",
        resource: pipe,
        fixed_params: params,
      },
    ],
  };

  return jwt.sign(payload, TINYBIRD_SIGNING_TOKEN);
}
