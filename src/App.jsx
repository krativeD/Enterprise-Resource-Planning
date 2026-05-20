import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './modules/dashboard/pages/Dashboard'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      } />
    </Routes>
  )
}

export default App
