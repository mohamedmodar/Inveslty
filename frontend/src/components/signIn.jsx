import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import logoImage from '../assets/logo.png'

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in context
        login(data);
        
        // Check if there's a redirect path stored
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          // Clear the stored path
          localStorage.removeItem('redirectAfterLogin');
          // Redirect to the stored path
          navigate(redirectPath);
        } else {
          // If no redirect path, go to home
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

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
            href="/community"
            className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Community
          </a>
          {/* <a
            href="/signin.html"
            className="text-white font-bold text-base px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Sign In
          </a> */}
        </div>
      </nav>

      <div className="container bg-white rounded-lg shadow-md w-full max-w-md p-6">
        <header className="text-2xl font-semibold text-center mb-6">Login</header>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <a href="#" className="text-sm text-green-600 hover:underline">
            Forgot password?
          </a>
          <button
            type="submit"
            className="button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
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
