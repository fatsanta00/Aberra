import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function Terms() {
  return (
    <div className="bg-[#3b0931] min-h-screen pt-20 flex flex-col">
      <Navbar />

      <section className="py-12 md:py-20 flex-grow">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-8">
            <Image src="/img2/backic.png" alt="Back" width={20} height={20} className="invert opacity-70" />
            Back to Home
          </Link>

          <div className="bg-[#1c0417]/80 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-purple-500/20 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 pb-6 border-b border-white/10">
              <span className="text-[#facc15]">Terms</span> and Conditions
            </h1>

            <div className="space-y-10">
              {/* Term 1 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a855f7]/20 text-[#a855f7] text-sm">1</span>
                  Introduction
                </h2>
                <div className="text-gray-300 space-y-4 leading-relaxed">
                  <p>
                    These Terms And Conditions (these “Terms” or these “Terms And Conditions”) contained herein on this webpage, shall govern your use of this website, including all pages within this website (collectively referred to herein below as this “Website”). These Terms apply in full force and effect to your use of this Website and by using this Website, you expressly accept all Terms And Conditions contained herein in full. You must not use this Website, if you have any objection to any of these Terms And Conditions.
                  </p>
                  <p>
                    This Website is not for use by any minors (defined as those who are not at least 18 years of age), and you must not use this Website if you are a minor.
                  </p>
                </div>
              </div>

              {/* Term 2 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a855f7]/20 text-[#a855f7] text-sm">2</span>
                  Intellectual Property Rights
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Other than content you own, which you may have opted to include on this Website, under these Terms, Aberra and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved. You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website.
                </p>
              </div>

              {/* Term 3 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a855f7]/20 text-[#a855f7] text-sm">3</span>
                  Restrictions
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">You are expressly and emphatically restricted from all of the following:</p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2 leading-relaxed marker:text-[#facc15]">
                  <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                  <li>Using this Website in any way that is, or may be, damaging to this Website;</li>
                  <li>Using this Website in any way that impacts user access to this Website;</li>
                  <li>Using this Website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the Website, or to any person or business entity;</li>
                  <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website, or while using this Website;</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Certain areas of this Website are restricted from access by you and Aberra may further restrict access by you to any areas of this Website, at any time, in its sole and absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality of such information.
                </p>
              </div>

              {/* Term 4 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a855f7]/20 text-[#a855f7] text-sm">4</span>
                  Your Content
                </h2>
                <div className="text-gray-300 space-y-4 leading-relaxed">
                  <p>
                    In these Terms And Conditions, “Your Content” shall mean any audio, video, text, images or other material you choose to display on this Website. With respect to Your Content, by displaying it, you grant Aberra a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
                  </p>
                  <p>
                    Your Content must be your own and must not be infringing on any third party’s rights. Aberra reserves the right to remove any of Your Content from this Website at any time, and for any reason, without notice.
                  </p>
                </div>
              </div>

              {/* Term 5 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#a855f7]/20 text-[#a855f7] text-sm">5</span>
                  Limitation of Liability
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  In no event shall Aberra, nor any of its officers, directors and employees, be liable to you for anything arising out of or in any way connected with your use of this Website, whether such liability is under contract, tort or otherwise, and Aberra, including its officers, directors and employees shall not be liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
