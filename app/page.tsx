"use client";

import { Table, Card, Subtitle, Text, Title, TableHead, TableRow, TableCell  } from "@tremor/react";
import useSWR from "swr";
import { getEndpointUrl } from "@/utils";
import { useFetcher } from "@/hooks/useFetch";

const REFRESH_INTERVAL_IN_MILLISECONDS = 1000; // five seconds

export default function Dashboard() {
  const endpointUrl = getEndpointUrl();
  const fetcher = useFetcher(); // This fetcher handles the token revalidation

  // Initializes variables for storing data
  let leaderboard, latency, errorMessage;

  // Using SWR hook to handle state and refresh result every five seconds
  const { data } = useSWR(endpointUrl, fetcher, {
    refreshInterval: REFRESH_INTERVAL_IN_MILLISECONDS,
    onError: (error) => (errorMessage = error),
  });

  if (!data) return;

  if (data?.error) {
    errorMessage = data.error;
    return;
  }

  leaderboard = data.data; // Setting the state with the fetched data
  latency = data.statistics?.elapsed; // Setting the state with the query latency from Tinybird

  return (
    <Card>
      <Title>Real-time leaderboard</Title>
      <Subtitle>Updating in real-time with Tiny Flappybird events</Subtitle>
      {leaderboard && (
        <Table className="mt-4" spacing="compact">
          {/* Table Head */}
          <TableHead>
            <TableRow>
              <TableCell>Player ID</TableCell>
              <TableCell>Total Score</TableCell>
            </TableRow>
          </TableHead>
          {/* Table Body */}
          <tbody>
            {leaderboard.map((player) => (
              <TableRow key={player.player_id}>
                <TableCell>{player.player_id}</TableCell>
                <TableCell>{player.total_score}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
      {latency && <Text>Latency: {latency * 1000} ms</Text>}
      {errorMessage && (
        <div className="mt-4 text-red-600">
          <p>
            Oops, something happens: <strong>{errorMessage}</strong>
          </p>
          <p className="text-sm">Check your console for more information</p>
        </div>
      )}
    </Card>
  );
}
