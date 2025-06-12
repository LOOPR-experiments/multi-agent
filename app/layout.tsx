import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beta: LOOPR multi-agent 1.0.3",
  description: "Multi-agent code audit/optimization",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[var(--background)]">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen relative`}>
        {/* Background Grid */}
        <div className="fixed inset-0 cyberpunk-grid opacity-20" />
        
        {/* Background Glow Effects */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[var(--brand)] opacity-20 blur-[100px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[var(--primary)] opacity-20 blur-[100px] pointer-events-none" />
        
        <header className="relative glass-panel mx-4 mt-4 mb-8">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/loopr-logo.svg"
                alt="LOOPR Logo"
                width={32}
                height={32}
                priority
              />
              <h1 className="text-xl font-semibold brand-gradient">
                Agent by LOOPR
              </h1>
            </div>
            <nav className="flex gap-6">
              <a
                href="https://loopr.fun"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                Website
              </a>
              <a
                href="https://x.com/buildonloopr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                Twitter
              </a>
            </nav>
          </div>
        </header>
        <main className="relative container mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
