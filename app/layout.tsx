import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workboard",
  description: "Workboard — record your group project meeting and get a shared board of who's doing what.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}