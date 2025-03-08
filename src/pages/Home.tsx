import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-6">
          The Future of <span className="gradient-text">Decentralized Finance</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Secure, transparent, and efficient financial services powered by blockchain technology
        </p>
        
        <div className="flex justify-center space-x-4 mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Learn More
          </motion.button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Feature
            icon={<Shield className="h-8 w-8 text-primary-400" />}
            title="Zero-Knowledge Proofs"
            description="Enhanced privacy and security for your transactions using advanced cryptographic techniques"
          />
          <Feature
            icon={<Zap className="h-8 w-8 text-primary-400" />}
            title="Instant Payments"
            description="Lightning-fast transactions using Ethereum blockchain technology"
          />
          <Feature
            icon={<Lock className="h-8 w-8 text-primary-400" />}
            title="Secure Wallet"
            description="Your assets are protected with military-grade encryption"
          />
        </div>
      </motion.div>
    </div>
  );
};

const Feature = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="card"
  >
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

export default Home;