import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CryptoChart from "@/components/CryptoChart";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#3b0931] min-h-screen pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-screen-2xl mx-auto px-4 md:px-6 py-12 md:py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
            #1 Miner <br />
            <span className="text-[#a855f7]">Platform</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
            Aberra is a special online platform that allows you to save cryptocurrencies and achieve growth within a specific period of time without any hidden fees. This platform allows you to save and invest any type and amount of cryptocurrency and choose a time period in which you'll achieve growth.
          </p>
          <div className="pt-4">
            <Link href="/about" className="px-8 py-4 rounded-full border border-[#a855f7] text-[#a855f7] font-bold hover:bg-[#a855f7] hover:text-white transition-all text-lg">
              Read More
            </Link>
          </div>
        </div>

        {/* Subscribe Form Card */}
        <div className="bg-[#1c0417]/80 backdrop-blur-md border border-purple-500/20 p-8 rounded-3xl shadow-2xl lg:max-w-md w-full justify-self-center lg:justify-self-end">
          <h2 className="text-2xl font-bold text-white mb-6">Subscribe!</h2>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a855f7] transition"
              />
            </div>
            <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#c084fc] text-white font-bold hover:opacity-90 transition mt-4">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Crypto Chart Section */}
      <section className="bg-[#1c0417] py-16 border-y border-purple-500/20">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-10">Cryptocurrency Chart</h2>
          <div className="rounded-2xl overflow-hidden border border-purple-500/20 bg-black">
            <CryptoChart />
          </div>
        </div>
      </section>

      {/* Mining Plans Section */}
      <section className="py-20">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Mining Plans</h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-16">
            These are our well-designed mining plans to meet your various mining budgets, varying from our Silver plan with a minimum investment of 30 days to our Diamond plan with a minimum of 90 days. We're sure you'll find a plan that is well-suited for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Silver */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col">
              <div className="bg-gray-200 py-6">
                <h3 className="text-2xl font-bold text-gray-800">Silver Plan</h3>
              </div>
              <div className="p-8 flex flex-col items-center flex-grow">
                <h4 className="text-gray-500 font-bold text-xl mb-4">$100 - $20,000</h4>
                <p className="text-gray-900 font-black text-3xl mb-2">30 Days</p>
                <p className="text-gray-600 mb-8">Plus no bonus</p>
                <Link href="/register" className="mt-auto w-full py-3 rounded-full bg-[#3b0931] text-white font-bold hover:bg-[#1c0417] transition">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Gold */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col border-4 border-[#facc15] relative scale-100 md:scale-105 z-10">
              <div className="absolute top-0 right-0 bg-[#facc15] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <div className="bg-[#facc15]/20 py-6">
                <h3 className="text-2xl font-bold text-gray-800">Gold Plan</h3>
              </div>
              <div className="p-8 flex flex-col items-center flex-grow">
                <h4 className="text-gray-500 font-bold text-xl mb-4">$100 - $20,000</h4>
                <p className="text-gray-900 font-black text-3xl mb-2">60 Days</p>
                <p className="text-gray-600 mb-8">Plus monthly bonus</p>
                <Link href="/register" className="mt-auto w-full py-3 rounded-full bg-[#facc15] text-black font-bold hover:bg-yellow-500 transition">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Diamond */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col">
              <div className="bg-purple-200 py-6">
                <h3 className="text-2xl font-bold text-gray-800">Diamond Plan</h3>
              </div>
              <div className="p-8 flex flex-col items-center flex-grow">
                <h4 className="text-gray-500 font-bold text-xl mb-4">$100 - $20,000</h4>
                <p className="text-gray-900 font-black text-3xl mb-2">90 Days</p>
                <p className="text-gray-600 mb-8">Plus weekly bonus</p>
                <Link href="/register" className="mt-auto w-full py-3 rounded-full bg-[#a855f7] text-white font-bold hover:bg-purple-600 transition">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Cryptos */}
      <section className="bg-[#1c0417] py-16 border-t border-purple-500/20">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-10">Supported Cryptocurrencies</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { name: "Bitcoin", icon: "/img2/btcic .png" },
              { name: "Ethereum", icon: "/img2/ethic.png" },
              { name: "Litecoin", icon: "/img2/ltcic.png" },
              { name: "BNB", icon: "/img2/bnbic.png" },
              { name: "Dogecoin", icon: "/img2/dogeic.png" },
              { name: "Tether (USDT)", icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029", isExternal: true },
              { name: "Solana (SOL)", icon: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=029", isExternal: true },
            ].map((coin) => (
              <Link href="/dashboard/deposit" key={coin.name} className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition group">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center p-4 border border-white/20 group-hover:border-[#a855f7] transition">
                  {coin.isExternal ? (
                    <img src={coin.icon} alt={coin.name} className="w-[60px] h-[60px] object-contain" />
                  ) : (
                    <Image src={coin.icon} alt={coin.name} width={60} height={60} className="object-contain" />
                  )}
                </div>
                <h4 className="text-white font-medium">{coin.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
