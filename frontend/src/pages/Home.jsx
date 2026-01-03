import React from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function Home() {
  return (
    <Router>
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
    </Router>
  )
}
