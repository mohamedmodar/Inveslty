import React from 'react'
import { Link } from 'react-router-dom'
import mohamedImage from '../assets/mohamed.JPG'
import hossamImage from '../assets/hossam.jpg'
import youssefImage from '../assets/youssef.jpg'
import mohnadImage from '../assets/mohnad.jpg'
import robertImage from '../assets/robert.jpg'
import logoImage from '../assets/logo.png'

const AboutUs = () => {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Navbar */}
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
  
        {/* Main Content */}
        <main className="flex-grow">
          <section className="about-us text-center py-10 px-4 bg-green-100">
            <h1 className="text-3xl font-bold mb-4">Meet Our Team</h1>
            <div className="team-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center mt-5">
              {/* Team Member 1 */}
              <div className="team-card bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-left">
                <img src={mohamedImage} alt="Mohamed Ibrahem" className="w-full h-52 rounded-md mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-green-800">Mohamed Ibrahem</h2>
                <p className="mb-2">ID: 20221460183</p>
                <p className="mb-2">Role: Team Leader & Software Engineer</p>
                <p className="mb-2">
                  LinkedIn: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Profile</a>
                </p>
                <p className="mb-2">
                  GitHub: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Repositories</a>
                </p>
              </div>
  
              {/* Team Member 2 */}
              <div className="team-card bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-left">
                <img src={hossamImage} alt="Hossam Ali" className="w-full h-52 rounded-md mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-green-800">Hossam Ali</h2>
                <p className="mb-2">ID: 20221468640</p>
                <p className="mb-2">Role: ML Engineer</p>
                <p className="mb-2">
                  LinkedIn: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Profile</a>
                </p>
                <p className="mb-2">
                  GitHub: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Repositories</a>
                </p>
              </div>
  
              {/* Team Member 3 */}
               <div className="team-card bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-left">
                <img src={youssefImage} alt="Youssef Ashraf" className="w-full h-52 rounded-md mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-green-800">Youssef Ashraf</h2>
                <p className="mb-2">ID: 20221460263</p>
                <p className="mb-2">Role: Data Analyst</p>
                <p className="mb-2">
                  LinkedIn: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Profile</a>
                </p>
                <p className="mb-2">
                  GitHub: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Repositories</a>
                </p>
              </div>
  
              {/* Team Member 4 */}
              <div className="team-card bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-left">
                <img src={mohnadImage} alt="Mohanad Kasheir" className="w-full h-52 rounded-md mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-green-800">Mohanad Kasheir</h2>
                <p className="mb-2">ID: 20221372697</p>
                <p className="mb-2">Role: Data Analyst</p>
                <p className="mb-2">
                  LinkedIn: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Profile</a>
                </p>
                <p className="mb-2">
                  GitHub: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Repositories</a>
                </p>
              </div>
  
              {/* Team Member 5 */}
              <div className="team-card bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-left">
                <img src={robertImage} alt="Robert Nagy" className="w-full h-52 rounded-md mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-green-800">Robert Nagy</h2>
                <p className="mb-2">ID: 20221445710</p>
                <p className="mb-2">Role: Data Scientist</p>
                <p className="mb-2">
                  LinkedIn: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Profile</a>
                </p>
                <p className="mb-2">
                  GitHub: <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">View Repositories</a>
                </p>
              </div>
            </div>
          </section>
        </main>
  
        {/* Footer */}
      
        <footer className="bg-green-500 text-white text-center py-3 relative bottom-0 w-full">
        <p>&copy; INVESTLY. All rights reserved.</p>
      </footer>
      </div>
    );
  };
  
  export default AboutUs;