import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "TODO List",
  description: "Todo list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <Nav/>
          {children}
        </main>
        </body>
    </html>
  );
}
