import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Voice Of Valour Season 4",
  description: "Official Registration Platform for Voice Of Valour Season 4 at FGCK Christ Centre Kasarani Clay City.",
  keywords: "Voice of Valour, Season 4, FGCK, Christ Centre, Kasarani, Clay City, Worship, Revival",
  openGraph: {
    title: "Voice Of Valour Season 4",
    description: "Official Registration Platform for Voice Of Valour Season 4. Theme: O Come To Jesus, The Messiah. July 3, 2026 | FGCK Christ Centre, Kasarani.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice Of Valour Season 4",
    description: "Official Registration Platform for Voice Of Valour Season 4.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
