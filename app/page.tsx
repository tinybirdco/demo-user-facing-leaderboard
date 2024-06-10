"use client";

import {
  Table,
  Card,
  Subtitle,
  Text,
  Title,
  TableHead,
  TableRow,
  TableCell,
  NumberInput,
  Button,
  TextInput,
} from "@tremor/react";
import useSWR from "swr";
import { getEndpointUrl } from "@/utils";
import { useFetcher } from "@/hooks/useFetch";
import { useState } from "react";

const REFRESH_INTERVAL_IN_MILLISECONDS = 1000; // one second in milliseconds
const PIPE_LEADERBOARD_ID = "leaderboard"; // The name of the pipe you want to consume
const PIPE_STATS_ID = "get_stats"; // The name of the pipe you want to consume

export default function Dashboard() {
  const [user, setUser] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(
    REFRESH_INTERVAL_IN_MILLISECONDS
  );

  const fetcherLeaderboard = useFetcher(PIPE_LEADERBOARD_ID, {
    player_id: user,
  }); // This fetcher handles the token revalidation
  const fetcherStats = useFetcher(PIPE_STATS_ID); // This fetcher handles the token revalidation

  // Initializes variables for storing data
  let leaderboard, latency, errorMessage;

  // Using SWR hook to handle state and refresh result every second
  // The first call is not executed until the user enters a username
  const { data, mutate } = useSWR(
    user ? getEndpointUrl("leaderboard") : null,
    fetcherLeaderboard,
    {
      refreshInterval: () => {
        return refreshInterval;
      },
      onError: (error) => (errorMessage = error),
    }
  );

  // Using SWR hook to handle state and refresh result every second
  const { data: statsData, mutate: mutateStats } = useSWR(
    getEndpointUrl("get_stats"),
    fetcherStats,
    {
      refreshInterval: () => {
        return refreshInterval;
      },
      onError: (error) => (errorMessage = error),
    }
  );

  if (data?.error) {
    errorMessage = data.error;
  }

  leaderboard = data?.data; // Setting the state with the fetched data
  latency = data?.statistics?.elapsed; // Setting the state with the query latency from Tinybird

  if (statsData?.error) {
    errorMessage = statsData.error;
  }

  const stats = statsData?.data[0];

  return (
    <>
      <Card className="w-full mb-4">
        <Title className="mb-2">First, enter your user</Title>
        <form
          className="flex gap-2 mb-2"
          onSubmit={(e: any) => {
            e.preventDefault();
            setUser((e.target.user as HTMLInputElement).value);
          }}
        >
          <TextInput placeholder="Your user" name="user" />
          <Button>Submit</Button>
        </form>
        {user && (
          <p>
            Current user: <strong>{user}</strong>
          </p>
        )}
      </Card>
      <Card className="w-full">
        <div className="flex justify-between">
          <div>
            <Title>Real-time leaderboard</Title>
            <Subtitle>
              Updating in real-time with Tiny Flappybird events
            </Subtitle>
          </div>
          <div className="flex gap-2 items-center">
            <p className="max-xl:hidden">Refresh interval:</p>
            <NumberInput
              className="mx-auto max-w-40"
              defaultValue={REFRESH_INTERVAL_IN_MILLISECONDS}
              onValueChange={(value) => setRefreshInterval(value)}
              step={1000}
            />
            <Button
              onClick={() => {
                mutate();
                mutateStats();
              }}
            >
              Refresh
            </Button>
          </div>
        </div>

        {stats && (
          <div className="flex justify-around my-8 text-center">
            <div>
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Players
              </p>
              <p className="text-4xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                {stats.players}
              </p>
            </div>
            <div>
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Games
              </p>
              <p className="text-4xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                {stats.games}
              </p>
            </div>
          </div>
        )}
        {leaderboard && (
          <Table className="my-4">
            {/* Table Head */}
            <TableHead>
              <TableRow>
                <TableCell className="border py-1 px-2 font-semibold text-center w-12">
                  Rank
                </TableCell>
                <TableCell className="border py-1 px-2 font-semibold">
                  Player ID
                </TableCell>
                <TableCell className="border py-1 px-2 font-semibold text-end">
                  Total Score
                </TableCell>
              </TableRow>
            </TableHead>
            {/* Table Body */}
            <tbody>
              {leaderboard.map((player: any, i: number) => (
                <TableRow
                  key={player.rank}
                  className={player.player_id === user ? "bg-green-100 font-bold" : ""}
                >
                  <TableCell className="border py-1 px-2 text-center w-12">
                    {player.rank}
                  </TableCell>
                  <TableCell className="border py-1 px-2">
                    {player.player_id}
                  </TableCell>
                  <TableCell className="border py-1 px-2 text-end">
                    {player.total_score}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
        {latency && (
          <Text className="text-xs text-gray-500">
            Latency: {latency * 1000} ms
          </Text>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-600">
            <p>
              Oops, something happens: <strong>{errorMessage}</strong>
            </p>
            <p className="text-sm">Check your console for more information</p>
          </div>
        )}
      </Card>
    </>
  );
}
