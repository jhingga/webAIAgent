import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: " AI-Powered Workspace",
  description: "Collaborative workspace with AI agents for procurement management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
