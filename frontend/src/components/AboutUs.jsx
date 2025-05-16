import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import mohamedImage from '../assets/mohamed.JPG';
import hossamImage from '../assets/hossam.jpg';
import youssefImage from '../assets/youssef.jpg';
import mohnadImage from '../assets/mohnad.jpg';
import robertImage from '../assets/robert.jpg';
import logoImage from '../assets/logo.png';
import Navbar from './Navbar';

const AboutUs = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300
      }
    }
  };

  const teamMembers = [
    {
      name: "Mohamed Ibrahem",
      id: "20221460183",
      role: "Team Leader & Software Engineer",
      image: mohamedImage,
      linkedin: "#",
      github: "#"
    },
    {
      name: "Hossam Ali",
      id: "20221468640",
      role: "ML Engineer",
      image: hossamImage,
      linkedin: "#",
      github: "#"
    },
    {
      name: "Youssef Ashraf",
      id: "20221460263",
      role: "Data Analyst",
      image: youssefImage,
      linkedin: "#",
      github: "#"
    },
    {
      name: "Mohanad Kasheir",
      id: "20221372697",
      role: "Data Analyst",
      image: mohnadImage,
      linkedin: "#",
      github: "#"
    },
    {
      name: "Robert Nagy",
      id: "20221445710",
      role: "Data Scientist",
      image: robertImage,
      linkedin: "#",
      github: "#"
    }
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-16 px-4 bg-white text-green-800"
        >
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-6"
          >
            About Investly
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Empowering investors with intelligent insights and data-driven decisions
          </motion.p>
        </motion.section>

        {/* Mission Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-16 px-4 max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-green-800">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Investly, we're revolutionizing the way people invest by combining cutting-edge technology
              with financial expertise. Our platform provides intelligent insights and data-driven recommendations
              to help investors make informed decisions and achieve their financial goals.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            {[
              { title: "Innovation", description: "Pushing the boundaries of financial technology" },
              { title: "Trust", description: "Building reliable and secure investment solutions" },
              { title: "Growth", description: "Empowering investors to achieve their financial goals" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-bold mb-3 text-green-700">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Team Section */}
        <section className="py-16 px-4 bg-gray-50">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-12 text-green-800"
          >
            Meet Our Team
          </motion.h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                initial="initial"
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  {hoveredCard === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-green-600 bg-opacity-80 flex items-center justify-center"
                    >
                      <div className="text-white text-center p-4">
                        <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                        <p className="mb-2">{member.role}</p>
                        <div className="flex justify-center space-x-4">
                          <a href={member.linkedin} className="hover:text-green-200">
                            <i className="fab fa-linkedin text-2xl"></i>
                          </a>
                          <a href={member.github} className="hover:text-green-200">
                            <i className="fab fa-github text-2xl"></i>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
             
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-green-500 text-white text-center py-6"
      >
        <p className="text-lg">&copy; INVESTLY. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default AboutUs;