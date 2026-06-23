import type { Metadata } from "next";
import { Montserrat, League_Gothic } from "next/font/google";
import "./globals.css";

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  variable: "--font-league-gothic",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Crime Lab",
  description: "Crime Lab Investigation Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${leagueGothic.variable} ${montserrat.variable}`}
      >
        {children}
      </body>
    </html>
  );
}