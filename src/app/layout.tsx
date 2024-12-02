import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "./ThemeProvider";
import {Inter} from "next/font/google";

const inter = Inter({ subsets: ["latin"]});


export const metadata: Metadata = {
  title: "StudentGuide",
  description: "The Intelligent Student-guiding app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en">
        <body
          className={inter.className}
        >
          <ThemeProvider attribute="class">
          {children}
          </ThemeProvider>
          
        </body>
      </html>
    </ClerkProvider>
  );
}
