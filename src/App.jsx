import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './modules/dashboard/pages/Dashboard'
import EmployeeManager from './modules/hr/pages/EmployeeManager'
import JobScheduling from './modules/jobs/pages/JobScheduling'
import ClientManagement from './modules/clients/pages/ClientManagement'
import FinanceManagement from './modules/finance/pages/FinanceManagement'
import ProcurementManagement from './modules/procurement/pages/ProcurementManagement'
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
      
      {/* Module 7 - Procurement & Supplier Management */}
      <Route path="/procurement" element={
        <DashboardLayout>
          <ProcurementManagement />
        </DashboardLayout>
      } />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
