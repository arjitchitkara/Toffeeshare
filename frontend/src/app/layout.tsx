import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Share Files Privately, Fast, and Without Worrying About the File Size",
  description:
    "Share files directly from your device without ever storing anything online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.42a58a0d.png" type="image/png" />
        <title>
          Share Files Privately, Fast, and Without Worrying About the File Size
        </title>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
