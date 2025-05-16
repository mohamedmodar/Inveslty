import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import logoImage from '../assets/logo.png'

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="bg-green-500 shadow-md py-2 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="logo flex items-center">
          <Link to="/">
            <img src={logoImage} alt="Project Logo" className="h-16 mr-2" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-white font-semibold text-base hover:text-green-100 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about-us"
            className="text-white font-semibold text-base hover:text-green-100 transition-colors"
          >
            More About Us
          </Link>
          <Link
            to="/community"
            className="text-white font-semibold text-base hover:text-green-100 transition-colors"
          >
            Community
          </Link>

          {/* User Section */}
          {user ? (
            <div className="flex items-center space-x-4 ml-4">
              <div className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-full">
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Username */}
                <span className="text-white font-semibold">
                  {user.username}
                </span>
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="bg-white text-green-600 hover:bg-green-50 font-semibold px-4 py-2 rounded-full transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 