import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-[#3b0931] min-h-screen pt-20 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1c0417] to-[#3b0931] py-20 border-b border-purple-500/20">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the story behind Aberra Mining Associates and our vision for the future of digital finance.
          </p>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-16 md:py-24 flex-grow">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="bg-[#1c0417]/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-purple-500/20 shadow-2xl space-y-12">
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <span className="w-12 h-1 bg-[#a855f7] rounded-full"></span>
                Our Vision
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Since the inception of cryptocurrency in 2009, the digital world has seen a marvelous
                innovation in finance and other sectors of the world economy, as it has changed the way we view money and finance forever. We have been
                ushered into a new era, an era of digital finance where you don’t have to feel money to have money and your money doesn’t
                have to be in a centralized database controlled by a specific economy but in a decentralized one for fairness and more
                stability.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg mt-4">
                Cryptocurrency has since its inception evolved into popular coins and tokens, DeFi and NFTs which are all
                means by which you the public can earn money online. <strong>Aberra Mining Associates</strong> is a mining organization that allows you to
                mine cryptocurrency and make use of other benefits of the blockchain. It was established in late July 2020 with
                the intent of helping new and upcoming crypto traders take complete advantage of the blockchains by reducing the cost to
                mine and convert crypto from one blockchain to another by making use of our wonderful site.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg mt-4">
                We have thought of the users when we made the site by omitting certain things or terms that you’ll see on other mining platforms such as hashrate
                and so on, because we want to appeal to those who understand little about cryptocurrency and those who are just
                starting and want to put little or no effort into trading/mining.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <span className="w-12 h-1 bg-[#facc15] rounded-full"></span>
                Our Team
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Aberra has strived to become one of the best mining platforms in the world and we have made marvelous
                progress under the brilliant leadership of our wonderful CEO, <strong>Sir Lawrence Peters</strong> and his partner <strong>Martha Peterson</strong>.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg mt-4">
                Sir Lawrence Peters came up with the brilliant idea to create a site where people can interact with the
                crypto blockchain in a simplified manner without the charts and the terminology and make investing simpler
                and risk-free. He then took the idea to some colleagues who sponsored him and after two years, the capital
                has been doubled with more investors joining every day.
              </p>
            </div>

            {/* Testimonials (Videos were referenced in the old code) */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <span className="w-12 h-1 bg-green-500 rounded-full"></span>
                Testimonials
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-8">
                Hear what our community has to say about their experience with Aberra Mining Associates.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((vid) => (
                  <div key={vid} className="rounded-xl overflow-hidden border border-purple-500/30 bg-black aspect-video relative group">
                    <video className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition duration-300" controls controlsList="nodownload">
                      <source src={`/vids/vid${vid}.mp4`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
