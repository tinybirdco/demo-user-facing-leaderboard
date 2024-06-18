import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Demo Leaderboard",
  description: "Simple app that consumes a Tinybird leaderboard endpoint (using JWT tokens).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="w-full md:w-3/4 m-0 mx-4 md:mx-auto">
          <h1 className="text-lg text-black my-4">Tinybird Leaderboard Example</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
