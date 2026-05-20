import { supabase } from './supabase'

// Mock data for initial development
const mockDashboardData = {
  stats: {
    totalEmployees: { value: 156, trend: 12 },
    activeJobs: { value: 34, trend: 8 },
    pendingInvoices: { value: 23, trend: -5 },
    monthlyRevenue: { value: 245000, trend: 15 },
    lowStockAlerts: { value: 8, trend: -20 },
    attendanceRate: { value: 94, trend: 3 }
  },
  revenueData: [
    { month: 'Jan', revenue: 180000, expenses: 120000 },
    { month: 'Feb', revenue: 200000, expenses: 130000 },
    { month: 'Mar', revenue: 220000, expenses: 140000 },
    { month: 'Apr', revenue: 210000, expenses: 135000 },
    { month: 'May', revenue: 240000, expenses: 150000 },
    { month: 'Jun', revenue: 245000, expenses: 155000 },
  ],
  recentActivities: [
    { id: 1, type: 'job', title: 'New Job Assigned', description: 'Office cleaning at Tech Corp', time: '5 min ago', color: 'bg-blue-500' },
    { id: 2, type: 'employee', title: 'Employee Check-in', description: 'Sarah Johnson checked in', time: '15 min ago', color: 'bg-green-500' },
    { id: 3, type: 'invoice', title: 'Invoice Generated', description: 'Invoice #INV-2024-089 for $5,200', time: '1 hour ago', color: 'bg-purple-500' },
    { id: 4, type: 'alert', title: 'Low Stock Alert', description: 'Disinfectant running low', time: '2 hours ago', color: 'bg-red-500' },
    { id: 5, type: 'job', title: 'Job Completed', description: 'Deep cleaning at City Mall', time: '3 hours ago', color: 'bg-teal-500' },
  ],
  employeeAttendance: [
    { name: 'Present', value: 145, color: '#10B981' },
    { name: 'Absent', value: 5, color: '#EF4444' },
    { name: 'On Leave', value: 6, color: '#F59E0B' },
  ]
}

// Initialize database tables
export const initializeDashboardTables = async () => {
  try {
    // Create tables if they don't exist
    const { error } = await supabase.rpc('initialize_dashboard_tables')
    if (error) {
      console.log('Tables might already exist:', error.message)
    }
    return true
  } catch (error) {
    console.error('Error initializing tables:', error)
    return false
  }
}

// Fetch dashboard data
export const fetchDashboardData = async () => {
  try {
    // For now, return mock data
    // In production, this would fetch from Supabase
    return mockDashboardData
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw error
  }
}

// Setup realtime subscriptions
export const subscribeToDashboardUpdates = (callback) => {
  const subscription = supabase
    .channel('dashboard-updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'jobs' },
      payload => callback('jobs', payload)
    )
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'employees' },
      payload => callback('employees', payload)
    )
    .subscribe()

  return () => {
    supabase.removeChannel(subscription)
  }
}
