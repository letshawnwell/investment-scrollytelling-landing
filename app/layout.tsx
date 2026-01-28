import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "../components/LenisProvider";

export const metadata: Metadata = {
  title: "Apex Capital Dynamics",
  description: "Immersive scrollytelling experience for an investment firm."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-white antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

