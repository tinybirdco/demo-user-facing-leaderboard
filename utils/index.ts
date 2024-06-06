const TINYBIRD_HOST = process.env.NEXT_PUBLIC_TINYBIRD_HOST ?? "https://api.tinybird.co";

type Endpoint = "leaderboard" | "get_stats"; // Define a type for possible endpoints

export function getEndpointUrl(endpoint: Endpoint): string {
   
  const baseUrl = `${TINYBIRD_HOST}/v0/pipes`;

  // Conditional logic based on endpoint value
  switch (endpoint) {
    case "leaderboard":
      return `${baseUrl}/leaderboard.json`;
    case "get_stats":
      return `${baseUrl}/get_stats.json`;
    default:
      throw new Error(`Invalid endpoint: ${endpoint}`);
  }
}