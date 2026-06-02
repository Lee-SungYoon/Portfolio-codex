import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  title: { default: "SY Creative Archive", template: "%s / SY Archive" },
  description: "Lee Seongyun's technical creative archive.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "SY Archive" },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          <Header />
          <PageTransition />
          <main>{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
