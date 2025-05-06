import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import AboutUs from './components/AboutUs'
import './App.css'
import CommunityPage from './components/commuinty'
import HomePage from './components/home'
import InvestmentPage from './components/invesment'
import SellPropertyPage from './components/sell'
import SignInPage from './components/signIn'
import SignUpPage from './components/signUp'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path='/community' element={<CommunityPage/>} />
          <Route path='/investment' element={<InvestmentPage/>} />
          <Route path='/sell' element={<SellPropertyPage/>} />
          <Route path='/signin' element={<SignInPage/>} />
          <Route path='/signup' element={<SignUpPage/>} />



        </Routes>
      </div>
    </Router>
  )
}


export default App
