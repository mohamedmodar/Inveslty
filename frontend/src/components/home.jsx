import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaCoins, FaMoneyBillWave } from 'react-icons/fa';

const investmentCategories = [
  {
    title: 'Real Estate',
    description: 'Explore the best property investment opportunities in Alexandria.',
    icon: <FaBuilding className="text-4xl text-green-500" />,
    color: 'from-green-400 to-green-600',
  },
  {
    title: 'Gold',
    description: 'Track gold prices and invest with confidence in precious metals.',
    icon: <FaCoins className="text-4xl text-yellow-500" />,
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    title: 'Currency',
    description: 'Stay updated on currency exchange rates and smart forex moves.',
    icon: <FaMoneyBillWave className="text-4xl text-blue-500" />,
    color: 'from-blue-400 to-blue-600',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSellClick = () => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/sell');
      navigate('/signin');
    } else navigate('/sell');
  };
  const handleInvestClick = () => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/investment');
      navigate('/signin');
    } else navigate('/investment');
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 ">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
        >
          Investly: Your Gateway to Smart Investments
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-2xl text-blue-50 max-w-2xl mx-auto mb-8"
        >
          Discover, compare, and act on the best investment opportunities in Alexandria—real estate, gold, and currency—all in one place.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleSellClick}
            className="bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-100 transition-all text-lg"
          >
            Sell Property
          </button>
          <button
            onClick={handleInvestClick}
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition-all text-lg"
          >
            Explore Investments
          </button>
        </motion.div>
      </section>

      {/* Investment Categories */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16"
            >
              {investmentCategories.map((cat, idx) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 * idx }}
                  whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                  className={
                    `rounded-3xl p-8 bg-transparent border border-blue-100 shadow-lg flex flex-col items-center text-gray-800 backdrop-blur-sm`
                  }
                >
                  <div className="mb-4">{cat.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{cat.title}</h3>
                  <p className="text-base opacity-90">{cat.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonial/Quote Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "With Investly, I made my first property investment with confidence. The insights and support are unmatched!"
          </blockquote>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-green-600">— Satisfied Investor</span>
            <span className="text-gray-400 text-sm">Alexandria, Egypt</span>
          </div>
        </motion.div> */}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-green-600 text-white text-center py-4 mt-8 shadow-inner"
      >
        <p className="font-semibold tracking-wide">&copy; {new Date().getFullYear()} INVESTLY. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default HomePage;
