import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  const discussions = [
    {
      id: 1,
      title: "Best Investment Strategies for 2024",
      author: "John Doe",
      authorImage: "https://randomuser.me/api/portraits/men/1.jpg",
      replies: 24,
      views: 156,
      lastActivity: "2 hours ago",
      tags: ["Investment", "Strategy"],
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60",
      content: "Exploring the most effective investment strategies for the current market conditions..."
    },
    
    {
      id: 6,
      title: "Real Estate Investment Opportunities",
      author: "Emma Thompson",
      authorImage: "https://randomuser.me/api/portraits/women/3.jpg",
      replies: 37,
      views: 245,
      lastActivity: "6 hours ago",
      tags: ["Real Estate", "Investment"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60",
      content: "Exploring emerging real estate investment opportunities..."
    }
  ];

  const events = [
    {
      id: 1,
      title: "Investment Workshop 2024",
      date: "March 15, 2024",
      time: "10:00 AM",
      location: "Virtual Event",
      attendees: 156,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
      description: "Learn advanced investment strategies from industry experts"
    },
    {
      id: 2,
      title: "Trading Strategies Webinar",
      date: "March 20, 2024",
      time: "2:00 PM",
      location: "Online",
      attendees: 89,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
      description: "Master the art of trading with proven strategies"
    },
    {
      id: 3,
      title: "Investment Portfolio Review",
      date: "March 25, 2024",
      time: "11:00 AM",
      location: "Virtual Meeting",
      attendees: 45,
      image: "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800&auto=format&fit=crop&q=60",
      description: "Get expert feedback on your investment portfolio"
    },
  
    {
      id: 5,
      title: "Real Estate Investment Summit",
      date: "April 5, 2024",
      time: "9:00 AM",
      location: "Virtual Conference",
      attendees: 200,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60",
      description: "Connect with real estate investment professionals"
    }
  ];

  const resources = [
    {
      id: 1,
      title: "Investment Guide 2024",
      type: "PDF",
      downloads: 234,
      size: "2.4 MB",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60",
      description: "Comprehensive guide to investment strategies"
    },
    {
      id: 2,
      title: "Market Analysis Report",
      type: "PDF",
      downloads: 189,
      size: "1.8 MB",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60",
      description: "Detailed market analysis and trends"
    },
    {
      id: 3,
      title: "Trading Strategies Video",
      type: "Video",
      downloads: 156,
      size: "45 MB",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
      description: "Video tutorial on advanced trading strategies"
    },

    {
      id: 5,
      title: "Real Estate Investment Guide",
      type: "PDF",
      downloads: 178,
      size: "2.8 MB",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60",
      description: "Essential guide to real estate investments"
    }
  ];

  const allTags = [...new Set(discussions.flatMap(d => d.tags))];

  const filteredDiscussions = discussions
    .filter(d => !selectedTag || d.tags.includes(selectedTag))
    .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      }
      if (sortBy === 'popular') {
        return b.views - a.views;
      }
      return b.replies - a.replies;
    });

  const renderContent = () => {
    switch (activeTab) {
      case 'discussions':
        return (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {allTags.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedTag === tag
                      ? 'bg-green-500 text-white'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-end mb-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="replies">Most Replies</option>
              </select>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {filteredDiscussions.map((discussion) => (
                <motion.div
                  key={discussion.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={discussion.image}
                        alt={discussion.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex items-center mb-4">
                        <img
                          src={discussion.authorImage}
                          alt={discussion.author}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{discussion.title}</h3>
                          <p className="text-gray-600">Posted by {discussion.author}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{discussion.content}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>{discussion.replies} replies</span>
                        <span>{discussion.views} views</span>
                        <span>Last activity: {discussion.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case 'events':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 text-gray-600">
                    <p>📅 {event.date}</p>
                    <p>⏰ {event.time}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {event.attendees} attendees</p>
                  </div>
                  <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
                    Register Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );
      case 'resources':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resources.map((resource) => (
              <motion.div
                key={resource.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex justify-between items-center text-gray-600 mb-4">
                    <span>Type: {resource.type}</span>
                    <span>{resource.downloads} downloads</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Size: {resource.size}</span>
                  </div>
                  <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
                    Download
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-16 px-4 bg-white"
        >
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-6 text-gray-800"
          >
            Join Our Community
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Connect with fellow investors, share insights, and learn from experts
          </motion.p>
        </motion.section>

        {/* Search and Tabs */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              {['discussions', 'events', 'resources'].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full capitalize ${
                    activeTab === tab
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-green-600 text-white text-center py-4 mt-8 shadow-inner"
      >
        <p className="text-lg">&copy; INVESTLY. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default Community; 