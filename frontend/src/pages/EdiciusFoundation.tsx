import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartHandshake, Sparkles, Leaf, Users, Globe2 } from 'lucide-react';

const EdiciusFoundation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-20">
        {/* Colorful background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-24 w-72 h-72 rounded-full bg-rose-400/30 blur-3xl" />
          <div className="absolute top-24 right-0 w-72 h-72 rounded-full bg-sky-400/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-400/25 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 shadow-sm border border-white/80 mb-5">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span className="text-xs uppercase tracking-[0.25em] text-slate-700">
                Edicius Foundation
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              <span className="block bg-gradient-to-r from-rose-600 via-orange-500 to-emerald-600 bg-clip-text text-transparent">
                Business with a Heart
              </span>
            </h1>

            <p className="mt-4 text-lg md:text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Edicius Foundation is the community pulse of our group — supporting people,
              neighbourhoods, and futures through education, healthcare, livelihoods, and
              resilience initiatives.
            </p>
          </motion.div>

          {/* Impact summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14"
          >
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-rose-100 shadow-sm p-5 flex items-start gap-3">
              <div className="mt-1 rounded-full bg-rose-100 p-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rose-600 uppercase tracking-wide">
                  Education & Skills
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Scholarships, skill-building and mentoring programs for young minds from
                  underserved communities.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-sky-100 shadow-sm p-5 flex items-start gap-3">
              <div className="mt-1 rounded-full bg-sky-100 p-2">
                <HeartHandshake className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-sky-700 uppercase tracking-wide">
                  Health & Wellbeing
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Medical camps, preventive care awareness and mental health support in
                  partnership with local institutions.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-emerald-100 shadow-sm p-5 flex items-start gap-3">
              <div className="mt-1 rounded-full bg-emerald-100 p-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                  Communities & Planet
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Local development projects, sustainability drives and disaster relief
                  initiatives across our geographies.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Story & initiatives */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-stretch mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="rounded-3xl bg-white/85 backdrop-blur-sm border border-white shadow-lg p-6 md:p-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Our promise to the communities we serve
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">
                Every business outcome we celebrate at Edicius is anchored to a deeper
                responsibility — to create tangible, visible good in the lives of people
                around us. The Foundation channels a part of our group&apos;s energy, time
                and resources into long-term community partnerships.
              </p>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                From helping students take their first step into higher education, to
                supporting frontline workers and vulnerable families during crises, Edicius
                Foundation is where our values move from strategy decks into human stories.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="space-y-5"
            >
              <div className="rounded-3xl bg-gradient-to-br from-rose-500 via-orange-400 to-amber-300 text-white p-6 md:p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6" />
                  <h3 className="text-lg md:text-xl font-semibold">
                    People-first, always
                  </h3>
                </div>
                <p className="text-sm md:text-base text-rose-50 leading-relaxed">
                  We prioritise dignity, access and opportunity — designing initiatives with
                  communities, not just for them. Every program is built around transparent
                  partnerships and measurable impact.
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 text-white p-6 md:p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Globe2 className="w-6 h-6" />
                  <h3 className="text-lg md:text-xl font-semibold">
                    A colorful canvas of initiatives
                  </h3>
                </div>
                <p className="text-sm md:text-base text-sky-50 leading-relaxed">
                  Edicius Foundation connects volunteers, partners and beneficiaries across
                  India, Nepal and the UK — reflecting the diversity of our group and the
                  many cultures we learn from.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-10 md:mb-16"
          >
            <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-slate-100 shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
                  Partner with Edicius Foundation
                </h3>
                <p className="text-sm md:text-base text-slate-700 max-w-xl">
                  If you represent an NGO, institution or community group and would like to
                  collaborate with us, reach out through our contact page and mention
                  &quot;Edicius Foundation&quot; in your message.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold shadow-md hover:bg-slate-800 transition-colors"
                >
                  Go to Contact page
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EdiciusFoundation;

