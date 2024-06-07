"use client";

import { Table, Card, Subtitle, Text, Title, TableHead, TableRow, TableCell  } from "@tremor/react";
import useSWR from "swr";
import { getEndpointUrl } from "@/utils";
import { useFetcher } from "@/hooks/useFetch";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

const REFRESH_INTERVAL_IN_MILLISECONDS = 5000; // milliseconds

export default function Dashboard() {
  const leaderboardUrl = getEndpointUrl("leaderboard"); // Leaderboard endpoint
  const statsUrl = getEndpointUrl("get_stats"); // Stats endpoint
  const fetcher = useFetcher(); // This fetcher handles the token revalidation

  // Initializes variables for storing data
  let leaderboard, stats, latency, errorMessage;

  // Using SWR hook to handle state for leaderboard
  const { data: leaderboardData } = useSWR(leaderboardUrl, fetcher, {
    refreshInterval: REFRESH_INTERVAL_IN_MILLISECONDS,
    onError: (error) => (errorMessage = error),
  });

 // Using SWR hook to handle state for stats
 const { data: statsData } = useSWR(statsUrl, fetcher, {
  refreshInterval: REFRESH_INTERVAL_IN_MILLISECONDS,
  onError: (error) => (errorMessage = error),
});

if (!leaderboardData && !statsData) return;

if (leaderboardData?.error || statsData?.error) {
  errorMessage = leaderboardData?.error || statsData?.error;
  return;
}
leaderboard = leaderboardData.data;
latency = leaderboardData.statistics?.elapsed; // Assuming latency is in leaderboard response

stats = statsData.data; // Assuming the first element in "data" contains stats
// stats latency?

return (
    <div className="grid grid-cols-1 gap-4">
      {/* Card for Leaderboard */}
      {leaderboard && (
        <Card>
          <Title>Real-time leaderboard</Title>
          <Subtitle>Updating in real-time with Tiny Flappybird events</Subtitle>
          <Table className="mt-4" >
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
              <TableRow key={player.rank}>
                <TableCell>{player.player_id}</TableCell>
                <TableCell>{player.total_score}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        </Card>
      )}
      {/* Card for Stats */}
      {stats && (
        <Card>
          <Title>Real-time stats</Title>
          <Subtitle>Fetched from Tinybird API</Subtitle>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card>
              <Title>Players</Title>
              <Text className="text-xl font-bold">{stats?.players}</Text>
            </Card>
            <Card>
              <Title>Games Played</Title>
              <Text className="text-xl font-bold">{stats?.games}</Text>
            </Card>
          </div>
        </Card>
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
    </div>
  );
}
