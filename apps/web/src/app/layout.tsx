import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIM-RBI Platform",
  description:
    "Website-based Asset Integrity Management Platform for Asset Registry, RBI, Inspection Management, Compliance, and Certification.",
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
