"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devLink, setDevLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setDevLink("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Failed to submit request");
      } else {
        setMessage(data.message);
        if (data._devOnlyResetLink) {
          setDevLink(data._devOnlyResetLink);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3b0931] px-4">
      <div className="w-full max-w-md bg-[#1c0417]/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-purple-500/20">
        <div className="flex justify-center mb-6">
          <Image src="/img2/logo2.1.png" alt="Aberra" width={60} height={60} className="object-contain" />
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2">Forgot Password</h1>
        <p className="text-gray-400 text-sm text-center mb-8">Enter your email address to receive a password reset link.</p>
        
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm text-center">
            {message}
          </div>
        )}
        {devLink && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-yellow-200 text-xs font-semibold mb-2">DEVELOPMENT MODE ONLY:</p>
            <Link href={devLink} className="text-blue-400 text-xs underline break-all">
              Click here to test the reset flow (Simulates receiving email)
            </Link>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition-all"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading || message !== ""}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#c084fc] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-300">
          Remember your password?{' '}
          <Link href="/login" className="text-[#facc15] hover:underline font-semibold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
