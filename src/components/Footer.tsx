import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1c0417] border-t border-purple-500/20 py-12 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Aberra</h1>
          <p className="text-gray-400 text-sm">
            Copyright &copy; {new Date().getFullYear()} Aberra Mining Associates.<br />
            All rights reserved.
          </p>
        </div>
        <nav className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-1">Quick Links</h3>
          <Link href="/" className="text-gray-400 hover:text-[#a855f7] transition text-sm">Home</Link>
          <Link href="/about" className="text-gray-400 hover:text-[#a855f7] transition text-sm">About Us</Link>
          <Link href="/terms" className="text-gray-400 hover:text-[#a855f7] transition text-sm">Terms & Conditions</Link>
        </nav>
        <div>
          <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
          <div className="flex gap-4">
            <a href="mailto:contact@aberra.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#a855f7] hover:text-white text-gray-400 transition">
              <i className="fas fa-envelope"></i>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#a855f7] hover:text-white text-gray-400 transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#a855f7] hover:text-white text-gray-400 transition">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
