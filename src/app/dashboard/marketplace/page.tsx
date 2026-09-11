import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

interface NFTWithOwner {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  ownerId: string | null;
  owner: { username: string } | null;
}

interface DisplayNft {
  id: string;
  name: string;
  ownerName: string;
  price: number;
  percent: string;
  img: string;
  positive: boolean;
}
export default async function Marketplace() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  // Fetch all NFTs from DB with owner info
  const nfts: NFTWithOwner[] = await prisma.nFT.findMany({
    include: { owner: { select: { username: true } } },
    orderBy: { price: "desc" },
  });

  // Fallback static NFTs if DB is empty
  const staticNfts = [
    { id: "s1", name: "Dread Cat", ownerName: "Rexy", price: 533, percent: "+15%", img: "/nfts/unnamed (2).png", positive: true },
    { id: "s2", name: "Blind Cat", ownerName: "Sheriff", price: 941, percent: "-13%", img: "/nfts/unnamed (3).png", positive: false },
    { id: "s3", name: "LaserBaby Ape #754", ownerName: "Jonas", price: 467, percent: "+17%", img: "/nfts/unnamed (4).png", positive: true },
    { id: "s4", name: "Saint #688", ownerName: "Kristin", price: 2455, percent: "+30%", img: "/nfts/unnamed (5).png", positive: true },
    { id: "s5", name: "RoboticApe #565", ownerName: "Jerry112", price: 1760, percent: "+11%", img: "/nfts/roboticape1.JPG", positive: true },
    { id: "s6", name: "Saint #987", ownerName: "Ismail", price: 1450, percent: "-3%", img: "/nfts/unnamed (6).png", positive: false },
    { id: "s7", name: "VeroKnight #1088", ownerName: "Pedro", price: 750, percent: "+23%", img: "/nfts/unnamed (7).png", positive: true },
    { id: "s8", name: "CoinFerry", ownerName: "Lambert01", price: 7122, percent: "+11%", img: "/nfts/a coin for the ferry man.gif", positive: true },
    { id: "s9", name: "UnrealApe #222", ownerName: "Sara", price: 900, percent: "+5%", img: "/nfts/unnamed (4).jpg", positive: true },
  ];

  const displayNfts: DisplayNft[] = nfts.length > 0
    ? nfts.map((n) => ({
        id: n.id,
        name: n.name,
        ownerName: n.owner?.username ?? "Unowned",
        price: n.price,
        percent: "+0%",
        img: n.imageUrl,
        positive: true,
      }))
    : staticNfts;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">NFT Marketplace</h1>
        <p className="text-gray-400 text-sm mt-1">Discover, collect, and trade unique digital assets</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {displayNfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-[#1c0417]/80 border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-900/30 transition-all group"
          >
            {/* Image */}
            <div className="aspect-square w-full overflow-hidden bg-[#1c0417]">
              <img
                src={nft.img}
                alt={nft.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-bold text-white text-sm truncate mb-1">{nft.name}</h3>
              <p className="text-gray-400 text-xs mb-3">
                Owner: <span className="text-gray-200">{nft.ownerName}</span>
              </p>

              {/* Price row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Price</p>
                  <p className="text-white font-bold">
                    ${nft.price.toLocaleString()}
                    <span
                      className={`ml-2 text-xs font-semibold ${nft.positive ? "text-green-400" : "text-red-400"}`}
                    >
                      {nft.percent}
                    </span>
                  </p>
                </div>
                <button className="p-2 rounded-xl bg-[#a855f7]/20 hover:bg-[#a855f7]/40 transition border border-purple-500/30">
                  <img src="/img2/buycryptoicon.png" alt="Buy" className="w-6 h-6 object-contain" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
