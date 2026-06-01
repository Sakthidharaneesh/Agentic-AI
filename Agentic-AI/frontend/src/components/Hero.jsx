import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Crosshair, Brain } from 'lucide-react';

const Hero = ({ scrollToUpload }) => (
  <section className="relative flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-green-900 text-white overflow-hidden">
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 2 }}
    >
      {/* You can place a subtle background pattern or image here */}
    </motion.div>
    <div className="relative z-10 text-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Leaf className="mx-auto mb-4 text-green-400" size={64} />
      </motion.div>
      <motion.h1
        className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        Advanced Leaf Disease Diagnosis
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl max-w-2xl mx-auto text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
        Leveraging cutting-edge AI to provide fast, accurate, and actionable insights for crop health. Protect your yield with confidence.
      </motion.p>
      <motion.button
        onClick={scrollToUpload}
        className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full text-lg font-semibold transition-transform transform hover:scale-105"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        Get Started
      </motion.button>
    </div>
  </section>
);

export default Hero;
