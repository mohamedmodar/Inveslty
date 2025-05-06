import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImage from '../assets/logo.png'
import houseImage from '../assets/house.jpg';
import goldImage from '../assets/gold.jpg';
import dollarImage from '../assets/dollar.png';

const HomePage = () => {
  const navigate = useNavigate();

  // JavaScript for handling button interactions
  const handleSellClick = () => {
    navigate('/sell');
  };

  const handleInvestClick = () => {
    navigate('/investment');
  };

  return (
    <div className="bg-gray-100">
      {/* Navbar Section */}
      <nav className="bg-green-500 shadow-md py-2 px-4 flex items-center justify-between">
          <div className="logo flex items-center">
            <Link to="/">
              <img src={logoImage} alt="Project Logo" className="h-20 mr-2" />
            </Link>
          </div>
          <div className="nav-links flex gap-4">
            <Link
              to="/"
              className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              More About Us
            </Link>
            <Link
              to="/community"
              className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Community
            </Link>
            <Link
              to="/signin"
              className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>

      {/* Header Section */}
      <header className="py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-black">Welcome to investly</h1>
        <p className="text-lg text-gray-700">
          Your guide to smart decisions in investment in alexandria.
        </p>
      </header>

      {/* Main Content Section */}
      <main className="container mx-auto mt-12 mb-12 p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center mb-8">Select an Option</h2>
        <div className="button-container flex justify-around items-center flex-wrap">
          {/* Sell Option */}
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md text-center transition-colors w-full sm:w-auto m-2"
            onClick={handleSellClick}
          >
            Sell Property
          </button>
          {/* Invest Option */}
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md text-center transition-colors w-full sm:w-auto m-2"
            onClick={handleInvestClick}
          >
            Explore Investments
          </button>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-green-500 text-white text-center py-3 fixed bottom-0 w-full">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
