import {  BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Register from './Components/Register'
import Login from './Components/Login'
import Home from './Components/Home'
import Dashboard from './Components/Dashboard'


function App() {
  
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path = "/register" element = {<Register />} />
        <Route path="/login" element = {<Login />} />
        <Route path="/user" element = {<Dashboard />} />

      </Routes>
    </Router>
  )

  
}

export default App
