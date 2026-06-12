import type { Metadata, Viewport } from "next";
import RevealObserver from "@/components/RevealObserver";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Lee. Sung Yoon - Portfolio",
  description: "Portfolio homepage for Lee. Sung Yoon.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          <RevealObserver />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
