import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../../../components/ProtectedRoute'
import RoleBasedRoute from '../../../components/RoleBasedRoute'
import OperationsDashboard from '../pages/OperationsDashboard'
import CreateJob from '../pages/CreateJob'
import JobTracker from '../pages/JobTracker'
import { USER_ROLES } from '../../../types/authTypes'

export default function OperationsRoutes() {
  const allowedRoles = [
    USER_ROLES.SUPER_ADMIN, 
    USER_ROLES.OPERATIONS_MANAGER, 
    USER_ROLES.SUPERVISOR
  ]

  return (
    <Routes>
      {/* ============================================ */}
      {/* OPERATIONS DASHBOARD                         */}
      {/* ============================================ */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute requiredRoles={allowedRoles}>
              <OperationsDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* ============================================ */}
      {/* JOB MANAGEMENT                               */}
      {/* ============================================ */}
      
      {/* Create New Job */}
      <Route 
        path="/jobs/new" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute requiredRoles={allowedRoles}>
              <CreateJob />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* View/Edit Job */}
      <Route 
        path="/jobs/:id" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute requiredRoles={allowedRoles}>
              <OperationsDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* Job Tracker - Full lifecycle tracking */}
      <Route 
        path="/tracker" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute requiredRoles={allowedRoles}>
              <JobTracker />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* Calendar View */}
      <Route 
        path="/calendar" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute requiredRoles={allowedRoles}>
              <OperationsDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* Quality Checks */}
      <Route 
        path="/quality" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute requiredRoles={allowedRoles}>
              <OperationsDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* Routes/Map */}
      <Route 
        path="/routes" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute requiredRoles={allowedRoles}>
              <OperationsDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />

      {/* All Jobs List */}
      <Route 
        path="/jobs" 
        element={
          <ProtectedRoute>
            <RoleBasedRoute requiredRoles={allowedRoles}>
              <OperationsDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}
