import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Sedgwick_Ave_Display,
  Lovers_Quarrel,
} from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display fonts carried over from the original Algomination hero.
const sedgwick = Sedgwick_Ave_Display({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const loversQuarrel = Lovers_Quarrel({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Algomination — Visualize Algorithms",
    template: "%s · Algomination",
  },
  description:
    "Learn algorithms and data structures through smooth, interactive visualizations.",
  keywords: [
    "algorithms",
    "data structures",
    "visualization",
    "sorting",
    "searching",
    "learn to code",
  ],
  authors: [{ name: "Omang Rawat" }, { name: "Rahul Soni" }],
  openGraph: {
    type: "website",
    title: "Algomination — Visualize Algorithms",
    description:
      "Learn algorithms and data structures through smooth, interactive visualizations.",
    siteName: "Algomination",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Algomination — Visualize Algorithms",
    description:
      "Learn algorithms and data structures through smooth, interactive visualizations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sedgwick.variable} ${loversQuarrel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster
            theme="dark"
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
