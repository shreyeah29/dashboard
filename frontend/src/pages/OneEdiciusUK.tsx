import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Globe2 } from 'lucide-react';

const OneEdiciusUK = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Ambient background accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-edicius-red/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-0 w-[28rem] h-[28rem] bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-slate-800/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 mb-5">
              <Globe2 className="w-4 h-4 text-edicius-red" />
              <span className="text-xs uppercase tracking-[0.25em] text-gray-300">
                One Edicius UK
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Expanding to the
              </span>
              <span className="block bg-gradient-to-r from-edicius-red via-red-500 to-edicius-red bg-clip-text text-transparent">
                United Kingdom
              </span>
            </h1>

            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              One Edicius UK will bring our diversified group&apos;s consulting, infrastructure,
              healthcare, and trade capabilities to partners across the United Kingdom.
              A dedicated UK platform designed for investors, institutions, and strategic alliances.
            </p>
          </motion.div>

          {/* Content layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Visual card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col"
            >
              <div className="relative h-64 md:h-72 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1473951574080-01fe45ec8643?auto=format&fit=crop&w=1600&q=80"
                  alt="London city skyline at dusk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-300">
                      Launch location
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="w-4 h-4 text-edicius-red" />
                      London, United Kingdom
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">
                    A dedicated UK gateway for Edicius Group
                  </h2>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    This page will soon host detailed information on One Edicius UK — including
                    sector focus, partnership models, and dedicated contact channels for UK-based
                    stakeholders.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm md:text-base text-gray-200">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-edicius-red" />
                      <span>Single window for Edicius Group opportunities in the UK</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-edicius-red" />
                      <span>Investor and institutional partnership interface</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-edicius-red" />
                      <span>Access to group companies across consulting, trade & infrastructure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Info / CTA column */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="space-y-8"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-7 shadow-lg backdrop-blur-sm">
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  Designed for investors & strategic partners
                </h3>
                <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                  While the full UK experience is being crafted, our core teams in India and London
                  are already engaging with partners. Use the main contact channels to begin a
                  conversation today.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-200">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                      Primary email
                    </p>
                    <p className="font-medium">biz.uk@1edicius.com</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                      Global office
                    </p>
                    <p className="font-medium">Edicius Group · Hyderabad & Cochin, India</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-edicius-red/90 to-red-700 rounded-2xl p-6 md:p-7 shadow-xl border border-red-500/40">
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">
                  Be the first to know
                </h3>
                <p className="text-sm md:text-base text-red-50 mb-4 leading-relaxed">
                  If you&apos;d like to explore collaboration with Edicius Group in the UK,
                  reach out via our global contact page and mention One Edicius UK in your note.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Go to Contact page
                  </Link>
                  <p className="text-xs text-red-100">
                    This UK microsite is currently in design & development.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OneEdiciusUK;

