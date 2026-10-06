import type { Metadata, Viewport } from "next";
import { TopBar } from "@/platform/components/TopBar";
import { PLATFORM } from "@/platform/strings";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: PLATFORM.name, template: `%s · ${PLATFORM.name}` },
  description: PLATFORM.tagline,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#151412" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-surface focus:px-3 focus:py-2">
          Bỏ qua, đến nội dung
        </a>
        <TopBar />
        <div id="main" className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
