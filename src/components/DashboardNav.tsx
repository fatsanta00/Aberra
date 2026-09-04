"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/dashboard/marketplace", label: "NFT Market", icon: "🖼" },
  { href: "/dashboard/deposit", label: "Deposit", icon: "⬇" },
  { href: "/withdrawal", label: "Withdraw", icon: "⬆" },
  { href: "/transfer", label: "Transfer", icon: "↔" },
  { href: "/stake", label: "Mining Plans", icon: "⛏" },
];

interface DashboardNavProps {
  username?: string;
  isAdmin?: boolean;
}

export default function DashboardNav({ username, isAdmin }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1c0417]/95 backdrop-blur-md border-b border-purple-500/20 h-16 flex items-center px-4 md:px-6">
        <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/img2/logo2.1.png" alt="Aberra" width={36} height={36} className="object-contain" />
            <span className="text-white font-bold text-lg hidden sm:block">Aberra</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#facc15] text-black font-bold"
                      : "text-gray-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: admin + user actions */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin/withdrawals"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/40 transition-all text-xs font-semibold"
              >
                Admin
              </Link>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold">
                {username ? username[0].toUpperCase() : "U"}
              </div>
              <span className="text-white text-sm">{username}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 text-sm transition-all"
            >
              Logout
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10"
            >
              <span className="block w-5 h-0.5 bg-white mb-1"></span>
              <span className="block w-5 h-0.5 bg-white mb-1"></span>
              <span className="block w-5 h-0.5 bg-white"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <nav
            className="absolute top-16 left-0 bottom-0 w-64 bg-[#1c0417] border-r border-purple-500/20 p-4 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-3 py-3 border-b border-white/10 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c3aed] flex items-center justify-center text-white text-sm font-bold">
                {username ? username[0].toUpperCase() : "U"}
              </div>
              <span className="text-white font-medium">{username}</span>
            </div>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#facc15] text-black font-bold"
                      : "text-gray-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin/withdrawals"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-600/20 transition-all"
              >
                🔑 Admin Panel
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-auto px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 text-left"
            >
              🚪 Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
