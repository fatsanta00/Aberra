import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="w-full bg-[#1c0417]/90 backdrop-blur-md border-b border-purple-500/20 fixed top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/img2/logo2.1.png" alt="Aberra Logo" width={40} height={40} className="object-contain" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide hidden sm:block">Aberra Mining</h1>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/about" className="text-gray-300 hover:text-white transition font-medium text-sm md:text-base">
            About
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-white transition font-medium text-sm md:text-base">
            Log in
          </Link>
          <Link href="/register" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#c084fc] text-white font-semibold hover:opacity-90 transition text-sm md:text-base">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
