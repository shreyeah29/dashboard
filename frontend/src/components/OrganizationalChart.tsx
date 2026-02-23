import React from 'react';
import { motion } from 'framer-motion';

interface OrganizationalChartProps {
  className?: string;
}

const OrganizationalChart: React.FC<OrganizationalChartProps> = ({ className = '' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 shadow-2xl"
      >
        {/* Top Level - EDICIUS GROUP */}
        <motion.div variants={itemVariants} className="flex justify-center mb-12">
          <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1a3a5f] rounded-xl px-8 py-6 border-2 border-red-500/30 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide text-center">
              EDICIUS GROUP
            </h1>
          </div>
        </motion.div>

        {/* Directors Row */}
        <motion.div variants={itemVariants} className="flex justify-center gap-8 md:gap-16 mb-16">
          {/* Left Director */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-red-500/50 mb-2"></div>
            <div className="bg-slate-800 rounded-lg px-6 py-4 border border-red-500/20 shadow-md min-w-[200px] md:min-w-[250px]">
              <p className="text-white/90 text-sm font-medium mb-1">Director/Chairman</p>
              <p className="text-white text-lg font-semibold">Victor Honey David</p>
            </div>
          </div>

          {/* Right Director */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-red-500/50 mb-2"></div>
            <div className="bg-slate-800 rounded-lg px-6 py-4 border border-red-500/20 shadow-md min-w-[200px] md:min-w-[250px]">
              <p className="text-white/90 text-sm font-medium mb-1">Director/Chairman</p>
              <p className="text-white text-lg font-semibold">Paul Satyanadhan David</p>
            </div>
          </div>
        </motion.div>

        {/* Connector from EDICIUS GROUP to Directors */}
        <div className="flex justify-center mb-4">
          <div className="w-0.5 h-12 bg-red-500/50"></div>
        </div>

        {/* Group Companies Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              Group Companies (India)
            </h2>
            <div className="w-24 h-0.5 bg-red-500/50 mx-auto mt-3"></div>
          </div>

          {/* Connector from Group Companies to companies */}
          <div className="flex justify-center mb-6">
            <div className="w-0.5 h-8 bg-red-500/50"></div>
          </div>

          {/* First Row of Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {[
              'Edicius Enterprises Private Limited',
              'Edicius Imports and Exports Private Limited',
              'Edicius Innovations and Consulting Private Limited',
              'Edicius Infrastructure and Developers Private Limited',
            ].map((company, index) => (
              <motion.div
                key={company}
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="w-0.5 h-6 bg-red-500/50 mb-2"></div>
                <div className="bg-slate-800 rounded-lg px-4 py-4 border border-red-500/20 shadow-md hover:shadow-lg transition-shadow w-full text-center min-h-[100px] flex items-center justify-center">
                  <p className="text-white text-sm md:text-base font-medium leading-tight">
                    {company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second Row of Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              'Edicius Productions and Entertainment Private Limited',
              'Edicius Consumer Products Private Limited',
              'Edicius Hotels and Hospitality Private Limited',
              'Edicius Mining and Minerals Private Limited',
            ].map((company, index) => (
              <motion.div
                key={company}
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="w-0.5 h-6 bg-red-500/50 mb-2"></div>
                <div className="bg-slate-800 rounded-lg px-4 py-4 border border-red-500/20 shadow-md hover:shadow-lg transition-shadow w-full text-center min-h-[100px] flex items-center justify-center">
                  <p className="text-white text-sm md:text-base font-medium leading-tight">
                    {company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrganizationalChart;
