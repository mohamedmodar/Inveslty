import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { UserProvider } from './context/UserContext'
import HomePage from './components/home'
import AboutUs from './components/AboutUs'
import CommunityPage from './components/commuinty'
import InvestmentPage from './components/invesment'
import SellPropertyPage from './components/sell'
import SignInPage from './components/signIn'
import SignUpPage from './components/signUp'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/investment" element={<InvestmentPage />} />
          <Route path="/sell" element={<SellPropertyPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
        <Chatbot />
      </Router>
    </UserProvider>
  )
}

export default App
