import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "TCG Hub Portal",
  description: "Discord-gated ACO member portal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="app-header">
            <Link className="brand" href="/">
              <span className="brand-mark">T</span>
              <span>TCG Hub</span>
            </Link>
            <nav className="top-nav" aria-label="Portal navigation">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/aco">ACO Profiles</Link>
              <Link href="/admin">Admin</Link>
            </nav>
            <div className="auth-slot">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="button dark">Login with Discord</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
