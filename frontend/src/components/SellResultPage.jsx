import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';

const ResultPage = () => {
  const location = useLocation();
  const { prediction, error } = location.state || {};

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl text-center p-8 md:p-12 transform hover:scale-105 transition-transform duration-300">
          {error ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                Estimation Failed
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                We couldn't estimate the price. Please try again.
              </p>
              <p className="text-md text-gray-500 bg-red-50 p-4 rounded-lg">
                <strong>Error:</strong> {error}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-light text-gray-700 mb-2">
                Estimated Apartment Price:
              </h1>
              <p className="text-5xl md:text-7xl font-bold text-green-600 mb-8 animate-pulse">
                {formatPrice(prediction)}
              </p>
              <p className="text-md text-gray-500">
                This is an estimate based on the provided details and current market data. Actual prices may vary.
              </p>
            </>
          )}
          <Link
            to="/sell"
            className="mt-10 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Go Back
          </Link>
        </div>
      </main>

      <footer className="bg-green-500 text-white text-center py-3">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ResultPage; 