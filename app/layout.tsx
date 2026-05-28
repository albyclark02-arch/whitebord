import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workboard",
  description: "Workboard — visual meeting notes that actually make sense.",
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