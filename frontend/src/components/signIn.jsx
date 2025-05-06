import React from 'react';
import logoImage from '../assets/logo.png'

const SignInPage = () => {
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

      <div className="container bg-white rounded-lg shadow-md w-full max-w-md p-6">
        <header className="text-2xl font-semibold text-center mb-6">Login</header>
        <form action="#" className="space-y-4">
          <input
            type="text"
            placeholder="Enter your email"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <a href="#" className="text-sm text-green-600 hover:underline">
            Forgot password?
          </a>
          <input
            type="button"
            className="button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            value="Login"
          />
        </form>
        <div className="signup text-center mt-4">
          <span className="text-gray-700">
            Don't have an account?
            <a href="/signup" className="text-green-600 hover:underline">
              Signup
            </a>
          </span>
        </div>
      </div>

      <footer className="bg-green-500 text-white text-center py-3 fixed bottom-0 w-full">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignInPage;
