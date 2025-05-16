import React, { useState } from 'react';
import logoImage from '../assets/logo.png'
import Navbar from './Navbar';

const InvestmentPage = () => {
  const [formData, setFormData] = useState({
    investmentType: '',
    budget: '',
    timeframe: '',
    riskTolerance: '',
    investmentGoal: '',
    contact: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData); // For demonstration
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
            <Navbar />

      <header>
        {/* Navbar Section */}
        {/* <nav className="bg-green-500 shadow-md py-2 px-4 flex items-center justify-between">
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
        </nav> */}
      </header>

      <main className="max-w-3xl mx-auto py-8 px-4">
        <section className="investment-form bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-green-600 text-center mb-4">Investment Options</h1>
          <p className="text-center mb-6">
            Choose your preferred investment type and let us guide you to the best opportunities.
          </p>
          <form id="investmentForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="investmentType" className="block text-gray-700 text-sm font-bold mb-2">
                Select Investment Type:
              </label>
              <select
                id="investmentType"
                name="investmentType"
                value={formData.investmentType}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">-- Please Choose an Option --</option>
                <option value="gold">Gold</option>
                <option value="dollars">Dollars</option>
                <option value="apartment">Apartment in Alexandria</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget" className="block text-gray-700 text-sm font-bold mb-2">
                Enter Your Budget (in egyptian bound):
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter your budget"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="form-group">
              <label htmlFor="timeframe" className="block text-gray-700 text-sm font-bold mb-2">
                Preferred Investment Timeframe:
              </label>
              <input
                type="text"
                id="timeframe"
                name="timeframe"
                value={formData.timeframe}
                onChange={handleChange}
                placeholder="e.g., Short-term, Long-term"
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="form-group">
              <label htmlFor="riskTolerance" className="block text-gray-700 text-sm font-bold mb-2">
                Risk Tolerance:
              </label>
              <select
                id="riskTolerance"
                name="riskTolerance"
                value={formData.riskTolerance}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">-- Please Choose an Option --</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="investmentGoal" className="block text-gray-700 text-sm font-bold mb-2">
                Investment Goal:
              </label>
              <input
                type="text"
                id="investmentGoal"
                name="investmentGoal"
                value={formData.investmentGoal}
                onChange={handleChange}
                placeholder="e.g., Save for retirement, Quick profit"
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail" className="block text-gray-700 text-sm font-bold mb-2">
                Contact Email:
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactPhone" className="block text-gray-700 text-sm font-bold mb-2">
                Contact Phone:
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto block">
              Submit
            </button>
          </form>
        </section>
      </main>

      <footer className="bg-green-500 text-white text-center py-2 fixed bottom-0 w-full">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InvestmentPage;
