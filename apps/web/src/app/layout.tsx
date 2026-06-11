import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Assets Integrity Management Platform | SUCOFINDO",
    template: "%s | SUCOFINDO",
  },
  description:
    "Website-based Asset Integrity Management Platform for Asset Registry, Risk-Based Inspection, Inspection Management, Compliance, Certification, Documents, Reports, Helpdesk, and Administration.",
  applicationName: "Assets Integrity Management Platform",
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