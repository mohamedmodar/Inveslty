import React from 'react';
import logoImage from '../assets/logo.png'
import dollarImage from '../assets/dollar.png'
import goldImage from '../assets/gold.jpg'
import houseImage from '../assets/house.jpg'
import investImage from '../assets/investing.jpg'



const CommunityPage = () => {
  return (
    <div className="bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-green-500 shadow-md py-2 px-4 flex items-center justify-between">
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
            href="/community"
            className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Community
          </a>
          <a
            href="/signin"
            className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </nav>

      {/* Banner Section */}
      <section className="banner text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Community</h1>
        <p className="text-xl">
          Explore insightful articles and join discussions on the best investment
          opportunities!
        </p>
      </section>

      {/* Articles Section */}
      <section className="articles py-10 px-4 text-center bg-white">
        <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
        <div className="article-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          <div className="article-card bg-gray-100 rounded-lg shadow-md p-6 text-left max-w-sm w-full">
            <img
              src={goldImage}
              alt="Gold Investment"
              className="w-full rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Why Gold is a Safe Investment
            </h3>
            <a
              href="gold_article.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-semibold hover:underline"
            >
              Read More
            </a>
          </div>
          <div className="article-card bg-gray-100 rounded-lg shadow-md p-6 text-left max-w-sm w-full">
            <img
              src={dollarImage}
              alt="Dollar Investment"
              className="w-full rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Investing in Dollars: A Smart Choice?
            </h3>
            <a
              href="dollar_article.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-semibold hover:underline"
            >
              Read More
            </a>
          </div>
          <div className="article-card bg-gray-100 rounded-lg shadow-md p-6 text-left max-w-sm w-full">
            <img
              src={houseImage}
              alt="Real Estate"
              className="w-full rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Top 5 Real Estate Investment Strategies
            </h3>
            <a
              href="real_estate_article.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-semibold hover:underline"
            >
              Read More
            </a>
          </div>
          <div className="article-card bg-gray-100 rounded-lg shadow-md p-6 text-left max-w-sm w-full">
            <img
              src={investImage}
              alt="Real Estate"
              className="w-full rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Investing in gold vs property
            </h3>
            <a
              href="real_estate_article.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-semibold hover:underline"
            >
              Read More
            </a>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="comments-section py-10 px-4 bg-green-100 text-center">
        <h2 className="text-3xl font-bold mb-8">Join the Conversation</h2>
        <form className="comment-form">
          <textarea
            placeholder="Share your thoughts or questions..."
            className="w-full max-w-2xl h-32 border border-gray-300 rounded-md p-2 mb-4"
          ></textarea>
          <br />
          <button
            type="submit"
            className="bg-green-700 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-green-800"
          >
            Post Comment
          </button>
        </form>
        {/* <div className="comments">
            <p>
              <strong>User1:</strong> I think investing in gold is the safest
              option right now.
            </p>
            <p>
              <strong>User2:</strong> Real estate in Alexandria is booming! Great
              article.
            </p>
          </div> */}
      </section>

      {/* Footer */}
      <footer className="bg-green-500 text-white text-center py-3 relative bottom-0 w-full">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CommunityPage;
