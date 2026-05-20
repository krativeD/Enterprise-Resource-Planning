import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MdPeople, MdWork, MdAttachMoney, MdTrendingUp,
  MdWarning, MdCheckCircle, MdNotifications,
  MdCalendarToday, MdInventory, MdSchedule
} from 'react-icons/md'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import StatCard from '../../../components/StatCard'
import ChartCard from '../../../components/ChartCard'
import ActivityItem from '../../../components/ActivityItem'
import { fetchDashboardData, subscribeToDashboardUpdates } from '../../../services/dashboardService'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    loadDashboardData()
    
    // Subscribe to realtime updates
    const unsubscribe = subscribeToDashboardUpdates((type, payload) => {
      console.log('Realtime update:', type, payload)
      // Refresh dashboard data on updates
      loadDashboardData()
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await fetchDashboardData()
      setDashboardData(data)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MdWarning className="text-6xl text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
          <p className="text-gray-600">Please check your connection and try again</p>
        </div>
      </div>
    )
  }

  const { stats, revenueData, recentActivities, employeeAttendance } = dashboardData

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-gray-800"
          >
            Dashboard Overview
          </motion.h1>
          <p className="text-gray-500 mt-1">Welcome back, John! Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center space-x-2"
          >
            <MdCalendarToday />
            <span>Generate Report</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          icon={MdPeople}
          title="Total Employees"
          value={stats.totalEmployees.value}
          trend={stats.totalEmployees.trend}
          color="text-blue-600"
          bgColor="bg-blue-500"
        />
        <StatCard
          icon={MdWork}
          title="Active Jobs"
          value={stats.activeJobs.value}
          trend={stats.activeJobs.trend}
          color="text-green-600"
          bgColor="bg-green-500"
        />
        <StatCard
          icon={MdAttachMoney}
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.value.toLocaleString()}`}
          trend={stats.monthlyRevenue.trend}
          color="text-purple-600"
          bgColor="bg-purple-500"
        />
        <StatCard
          icon={MdWarning}
          title="Low Stock Alerts"
          value={stats.lowStockAlerts.value}
          trend={stats.lowStockAlerts.trend}
          color="text-red-600"
          bgColor="bg-red-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <ChartCard title="Revenue Overview" icon={MdTrendingUp}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  fill="url(#expenseGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Attendance Chart */}
        <ChartCard title="Employee Attendance" icon={MdPeople}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeeAttendance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {employeeAttendance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <ChartCard title="Recent Activities" icon={MdNotifications}>
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  icon={getActivityIcon(activity.type)}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                  color={activity.color}
                />
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Quick Actions */}
        <div>
          <ChartCard title="Quick Actions" icon={MdSchedule}>
            <div className="space-y-3">
              <QuickActionButton icon={MdPeople} label="Add Employee" color="bg-blue-500" />
              <QuickActionButton icon={MdWork} label="Create Job" color="bg-green-500" />
              <QuickActionButton icon={MdAttachMoney} label="Generate Invoice" color="bg-purple-500" />
              <QuickActionButton icon={MdInventory} label="Check Inventory" color="bg-orange-500" />
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

// Helper Components
const getActivityIcon = (type) => {
  const icons = {
    job: MdWork,
    employee: MdPeople,
    invoice: MdAttachMoney,
    alert: MdWarning,
  }
  return icons[type] || MdNotifications
}

const QuickActionButton = ({ icon: Icon, label, color }) => (
  <motion.button
    whileHover={{ scale: 1.02, x: 5 }}
    whileTap={{ scale: 0.98 }}
    className="w-full flex items-center space-x-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
  >
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
      <Icon className="text-white text-lg" />
    </div>
    <span className="font-medium text-gray-700">{label}</span>
  </motion.button>
)

export default Dashboard
