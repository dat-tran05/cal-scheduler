"use client";

import { motion } from "framer-motion";
import { SignInButton } from "@/components/auth/SignInButton";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#050510] to-[#030303]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.2),transparent_50%)]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to optimize your schedule?
              </h2>
              <p className="text-white/60 text-lg mb-6 max-w-lg">
                Sign in with Google to start finding your perfect time slots in
                seconds.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative">
                <SignInButton size="lg" className="px-8 py-6" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
