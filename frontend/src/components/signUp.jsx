import React from 'react';
import logoImage from '../assets/logo.png'

const SignUpPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      {/* Navbar */}
      <nav className="bg-green-500 shadow-md py-2 px-4 w-full flex items-center justify-between absolute top-0">
        <div className="logo flex items-center">
          <a href="/">
            <img src={logoImage} alt="Project Logo" className="h-20 mr-2" />
          </a>
        </div>
        <div className="nav-links flex gap-4">
          <a
            href="/"
            className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Home
          </a>
          <a
            href="/about-us"
            className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            More About Us
          </a>
          <a
            href="/commuinty.html"
            className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Community
          </a>
          <a
            href="/signin.html"
            className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </nav>

      <div className="container bg-white rounded-lg shadow-md p-6 w-full max-w-md mt-10">
        <h1 className="text-2xl font-semibold text-green-800 text-center mb-4">Sign Up</h1>
        <form action="/submit-signup" method="POST" className="space-y-4">
          {/* Personal Information */}
          <div className="form-group">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm your password"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Work and Investment Preferences */}
          <div className="form-group">
            <label htmlFor="occupation" className="block text-gray-700 text-sm font-bold mb-2">
              Your Job
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              placeholder="Enter your job"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="form-group">
            <label htmlFor="investment-type" className="block text-gray-700 text-sm font-bold mb-2">
              Preferred Investment Type
            </label>
            <select
              id="investment-type"
              name="investment-type"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="real-estate">Real Estate</option>
              <option value="gold">Gold</option>
              <option value="dollars">Dollars</option>
              <option value="stocks">Stocks</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="form-group">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Sign Up
            </button>
          </div>

          {/* Links */}
          <div className="form-footer text-center mt-4">
            <p className="text-gray-700 text-sm">
              Already have an account?{' '}
              <a href="signin.html" className="text-green-600 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>

      <footer className="bg-green-500 text-white text-center py-3 fixed bottom-0 w-full">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignUpPage;
