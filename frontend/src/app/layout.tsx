// src/app/layout.tsx
import RefineApp from "./RefineApp";
import { cookies } from "next/headers";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Newspaper",
  description: "Newspaper layout editor and management system",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📰</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = cookies().get("theme")?.value;
  const defaultMode = theme === "dark" ? "dark" : "light";

  return (
    <html lang="en">
    <body>
    {/* pass the default theme-mode into the client component */}
    <RefineApp defaultMode={defaultMode}>{children}</RefineApp>
    </body>
    </html>
  );
}
