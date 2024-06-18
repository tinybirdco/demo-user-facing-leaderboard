const TINYBIRD_HOST = process.env.NEXT_PUBLIC_TINYBIRD_HOST ?? "https://api.tinybird.co";

export function getEndpointUrl(pipe: string) {

  // Constructing the URL for fetching data, including host, token, and date range
  const endpointUrl = new URL(
    `/v0/pipes/${pipe}.json`,
    TINYBIRD_HOST
  );

  return endpointUrl.toString();
}
