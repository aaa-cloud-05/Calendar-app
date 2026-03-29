import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Quick Plan",
    template: "%s | Quick Plan",
  },
  description: "日程調整をリンク共有でシンプルに。イベントの候補日に対する回答を集められます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <div className="flex-1">{children}</div>
        <Toaster richColors position="top-center" />
        <footer className="border-t border-zinc-200 bg-white py-5">
          <nav
            className="mx-auto max-w-3xl px-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-500"
            aria-label="法的情報"
          >
            <Link
              href="/legal/terms"
              className="underline underline-offset-2 hover:text-zinc-800"
            >
              利用規約
            </Link>
            <Link
              href="/legal/privacy"
              className="underline underline-offset-2 hover:text-zinc-800"
            >
              プライバシーポリシー
            </Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
