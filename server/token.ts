"use server";

import jwt from "jsonwebtoken";

const TINYBIRD_SIGNING_TOKEN = process.env.TINYBIRD_SIGNING_TOKEN ?? "";
const WORKSPACE_ID = process.env.TINYBIRD_WORKSPACE ?? ""; // Get this ID by running `tb workspace current`

type Endpoint = "leaderboard" | "get_stats"; // Define a type for possible endpoints

// Server function that generates a JWT
// All the Tinybird related data won't be visible in the browser
export async function generateJWT(endpoint: Endpoint) {
  const next10minutes = new Date();
  next10minutes.setTime(next10minutes.getTime() + 1000 * 60 * 10);

  const payload = {
    workspace_id: WORKSPACE_ID,
    name: endpoint,
    exp: next10minutes.getTime() / 1000, // Token only valid for the next 10 minutes
    scopes: [
      {
        type: "PIPES:READ",
        resource: endpoint === "leaderboard" ? "leaderboard" : "get_stats", // Set resource dynamically based on endpoint

      },
    ],
  };

  return jwt.sign(payload, TINYBIRD_SIGNING_TOKEN);
}
