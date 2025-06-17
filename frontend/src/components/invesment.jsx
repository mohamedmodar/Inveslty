import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useUser } from '../context/UserContext';

const InvestmentPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    investment_goal: 'grow',
    risk_tolerance: 'medium',
    time_horizon: 'medium',
    liquidity: 'moderate',
    investment_capital: 5000000,
    priority: 'return',
    experience: 'little',
    return_type: 'variable',
    additional_requests: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hardcoded options from the provided CSV and backend logic
  const districts = [
    "Abu talat", "Al asafra", "Bakoos", "Bolekly", "Borg el arab", "Camp cesar", "Chatby",
    "Cleopatra", "El amreya", "El hanouvel", "El mamoura", "El mandara", "Fleming", "Ganaklis",
    "Glim", "Kafr-abdo", "King maryot", "Lauren", "Mansheya", "Miami",
    "Moharram bey", "Montazah", "Roshdy", "Saba basha", "San stefano", "Sidi bishr", "Sidi gaber", "Smouha",
    "Sporting", "Stanley", "Zezenia"
  ];
  const finishTypes = ["Super Lux", "Lux", "Not Finished"];
  const viewTypes = ["Sea View", "Street View", "Garden View"];

  const investment_questions = {
    investment_goal: {
      question: "What is your investment goal?",
      options: ["preserve", "grow", "maximize", "income"]
    },
    risk_tolerance: {
      question: "What is your risk tolerance?",
      options: ["low", "medium", "high"]
    },
    time_horizon: {
      question: "What is your time horizon?",
      options: ["short", "medium", "long"]
    },
    liquidity: {
      question: "How much liquidity do you need?",
      options: ["high", "moderate", "low"]
    },
    investment_capital: {
      question: "What is your investment capital (in EGP)?",
      options: []
    },
    priority: {
      question: "What's your top investment priority?",
      options: ["return", "protection", "income", "tangible"]
    },
    experience: {
      question: "Have you invested before?",
      options: ["yes", "little", "no"]
    },
    return_type: {
      question: "Do you prefer fixed or variable returns?",
      options: ["fixed", "variable"]
    },
    additional_requests: {
      question: "Enter any additional requests:",
      options: []
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation: investment_capital must be above 200,000
   /* if (Number(formData.investment_capital) <= 200000) {
      setError('Investment capital must be greater than 200,000 EGP.');
      setLoading(false);
      return;
    } */

    const payload = {
      ...formData,
      investment_capital: Number(formData.investment_capital),
    };

    try {
      const response = await fetch('http://localhost:9000/investment-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to get investment advice.');
      }

      const result = await response.json();
      navigate('/investment-result', { state: { advice: result } });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto py-8 px-4">
        <section className="investment-form bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-green-600 text-center mb-4">
            Investment Profile Questionnaire
          </h1>
          <p className="text-center mb-6">
            Answer a few questions to help us understand your investment needs.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(investment_questions).map(([key, value]) => (
              <div key={key} className="form-group">
                <label htmlFor={key} className="block text-gray-700 text-sm font-bold mb-2">
                  {value.question}
                </label>
                {value.options.length > 0 ? (
                  <select
                    name={key}
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {value.options.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                  </select>
                ) : (
                  <input
                    type={key === 'investment_capital' ? 'number' : 'text'}
                    name={key}
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
                    placeholder={key === 'additional_requests' ? 'e.g., I prefer properties in a specific neighborhood' : ''}
                  />
                )}
              </div>
            ))}

            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto block w-full" disabled={loading}>
              {loading ? 'Analyzing...' : 'Get Investment Advice'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              <h2 className="text-xl font-bold">Error:</h2>
              <p>{error}</p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-green-500 text-white text-center py-2">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InvestmentPage;
