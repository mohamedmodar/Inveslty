import React from 'react';
import logoImage from '../assets/logo.png'

const SellPropertyPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar Section */}
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

      {/* Header Section */}
      <header className="py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-black">Sell Your Property</h1>
        <p className="text-lg text-gray-700">
          Provide the details of your property to get an estimated price or determine the best time to sell.
        </p>
      </header>

      {/* Main Form Section */}
      <div className="form-container flex justify-center items-center py-8">
        <form id="sellForm" className="bg-white rounded-lg shadow-md p-6 w-full max-w-md space-y-4">
          <label htmlFor="property-type" className="block text-gray-700 text-sm font-bold mb-2">
            Property Type:
          </label>
          <select
            id="property-type"
            name="propertyType"
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
          </select>

          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Enter property location"
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label htmlFor="area" className="block text-gray-700 text-sm font-bold mb-2">
            Area (in sq.m):
          </label>
          <input
            type="number"
            id="area"
            name="area"
            placeholder="Enter property area"
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label htmlFor="bedrooms" className="block text-gray-700 text-sm font-bold mb-2">
            Number of Bedrooms:
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            placeholder="Enter number of bedrooms"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label htmlFor="bathrooms" className="block text-gray-700 text-sm font-bold mb-2">
            Number of Bathrooms:
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            placeholder="Enter number of bathrooms"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
            Expected Price (Optional):
          </label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Enter your expected price"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <label htmlFor="sell-time" className="block text-gray-700 text-sm font-bold mb-2">
            Do you want to sell now or estimate the best time?
          </label>
          <select
            id="sell-time"
            name="sellTime"
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select Option</option>
            <option value="now">Sell Now</option>
            <option value="estimate">Estimate Best Time</option>
          </select>

          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Submit
          </button>
        </form>
      </div>

      {/* Footer Section */}
      <footer className="bg-green-500 text-white text-center py-3 fixed bottom-0 w-full">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SellPropertyPage;
