import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from './layouts/DashboardLayout'
import './App.css'

// Lazy load modules for better performance
const Dashboard = lazy(() => import('./modules/dashboard/pages/Dashboard'))
const EmployeeManager = lazy(() => import('./modules/hr/pages/EmployeeManager'))
const JobScheduling = lazy(() => import('./modules/jobs/pages/JobScheduling'))
const ClientManagement = lazy(() => import('./modules/clients/pages/ClientManagement'))
const FinanceManagement = lazy(() => import('./modules/finance/pages/FinanceManagement'))
const ProcurementManagement = lazy(() => import('./modules/procurement/pages/ProcurementManagement'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="neo-spinner mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading module...</p>
    </div>
  </div>
)

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Module Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="neo-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Default redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              </ErrorBoundary>
            </DashboardLayout>
          }
        />

        {/* HR & Payroll */}
        <Route
          path="/hr"
          element={
            <DashboardLayout>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <EmployeeManager />
                </Suspense>
              </ErrorBoundary>
            </DashboardLayout>
          }
        />

        {/* Job Scheduling & Dispatch */}
        <Route
          path="/jobs"
          element={
            <DashboardLayout>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <JobScheduling />
                </Suspense>
              </ErrorBoundary>
            </DashboardLayout>
          }
        />

        {/* Sales & Client Management */}
        <Route
          path="/clients"
          element={
            <DashboardLayout>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <ClientManagement />
                </Suspense>
              </ErrorBoundary>
            </DashboardLayout>
          }
        />

        {/* Finance & Accounting */}
        <Route
          path="/finance"
          element={
            <DashboardLayout>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <FinanceManagement />
                </Suspense>
              </ErrorBoundary>
            </DashboardLayout>
          }
        />

        {/* Procurement */}
        <Route
          path="/procurement"
          element={
            <DashboardLayout>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <ProcurementManagement />
                </Suspense>
              </ErrorBoundary>
            </DashboardLayout>
          }
        />

        {/* 404 - Catch all */}
        <Route
          path="*"
          element={
            <DashboardLayout>
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-8xl mb-4">🔍</div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                  <p className="text-xl text-gray-600 mb-4">Page not found</p>
                  <p className="text-gray-500 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  <a href="/dashboard" className="neo-btn">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            </DashboardLayout>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default App
