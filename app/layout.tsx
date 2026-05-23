import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Isla's Maths",
  description: "Year 9 Maths Revision",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`${geist.className} min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900`}
      >
        <main className="pb-24 min-h-screen">{children}</main>
        <Nav />
      </body>
    </html>
  );
}
