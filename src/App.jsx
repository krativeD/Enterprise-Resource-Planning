import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './modules/dashboard/pages/Dashboard'
import EmployeeManager from './modules/hr/pages/EmployeeManager'
import JobScheduling from './modules/jobs/pages/JobScheduling'
import ClientManagement from './modules/clients/pages/ClientManagement'
import FinanceManagement from './modules/finance/pages/FinanceManagement'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Module 2 - Dashboard */}
      <Route path="/dashboard" element={
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      } />
      
      {/* Module 3 - HR & Payroll */}
      <Route path="/hr" element={
        <DashboardLayout>
          <EmployeeManager />
        </DashboardLayout>
      } />
      
      {/* Module 4 - Job Scheduling & Dispatch */}
      <Route path="/jobs" element={
        <DashboardLayout>
          <JobScheduling />
        </DashboardLayout>
      } />
      
      {/* Module 5 - Sales & Client Management */}
      <Route path="/clients" element={
        <DashboardLayout>
          <ClientManagement />
        </DashboardLayout>
      } />
      
      {/* Module 6 - Finance & Accounting */}
      <Route path="/finance" element={
        <DashboardLayout>
          <FinanceManagement />
        </DashboardLayout>
      } />
      
      {/* Placeholder routes for future modules */}
      <Route path="/procurement" element={
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Procurement Module</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </div>
        </DashboardLayout>
      } />
      
      <Route path="/inventory" element={
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Inventory & Warehouse</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </div>
        </DashboardLayout>
      } />
      
      <Route path="/assets" element={
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Asset & Equipment Management</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </div>
        </DashboardLayout>
      } />
      
      <Route path="/fleet" element={
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Fleet Management</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </div>
        </DashboardLayout>
      } />
      
      <Route path="/reports" element={
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Reporting & Analytics</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </div>
        </DashboardLayout>
      } />
      
      <Route path="/mobile" element={
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Mobile Cleaner App</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </div>
        </DashboardLayout>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-6xl font-bold text-gray-300 mb-4">404</h2>
              <p className="text-xl text-gray-600 mb-2">Page Not Found</p>
              <p className="text-gray-500">The page you're looking for doesn't exist.</p>
            </div>
          </div>
        </DashboardLayout>
      } />
    </Routes>
  )
}

export default App
