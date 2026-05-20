import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MdAssessment, MdPeople, MdAttachMoney, MdAccessTime,
  MdTrendingUp, MdPrint, MdDownload, MdDateRange,
  MdPieChart, MdBarChart, MdShowChart
} from 'react-icons/md'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

const AdvancedReports = () => {
  const [reportType, setReportType] = useState('overview')
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-03-31' })

  // Report Data
  const departmentDistribution = [
    { name: 'Operations', value: 85, color: '#3B82F6' },
    { name: 'HR', value: 12, color: '#10B981' },
    { name: 'Finance', value: 8, color: '#F59E0B' },
    { name: 'Admin', value: 15, color: '#EF4444' },
    { name: 'Sales', value: 10, color: '#8B5CF6' },
    { name: 'Management', value: 6, color: '#EC4899' }
  ]

  const turnoverData = [
    { month: 'Jan', hired: 8, terminated: 2 },
    { month: 'Feb', hired: 5, terminated: 3 },
    { month: 'Mar', hired: 12, terminated: 1 },
    { month: 'Apr', hired: 6, terminated: 4 },
    { month: 'May', hired: 10, terminated: 2 },
    { month: 'Jun', hired: 7, terminated: 3 }
  ]

  const attendanceTrend = [
    { month: 'Jan', attendance: 94, punctuality: 88 },
    { month: 'Feb', attendance: 92, punctuality: 85 },
    { month: 'Mar', attendance: 95, punctuality: 90 },
    { month: 'Apr', attendance: 93, punctuality: 87 },
    { month: 'May', attendance: 96, punctuality: 91 },
    { month: 'Jun', attendance: 94, punctuality: 89 }
  ]

  const salaryDistribution = [
    { range: '0-20k', count: 45 },
    { range: '20k-30k', count: 35 },
    { range: '30k-40k', count: 25 },
    { range: '40k-50k', count: 15 },
    { range: '50k-60k', count: 10 },
    { range: '60k+', count: 6 }
  ]

  const performanceMetrics = [
    { subject: 'Attendance', A: 95, fullMark: 100 },
    { subject: 'Productivity', A: 88, fullMark: 100 },
    { subject: 'Quality', A: 92, fullMark: 100 },
    { subject: 'Teamwork', A: 85, fullMark: 100 },
    { subject: 'Initiative', A: 78, fullMark: 100 },
    { subject: 'Compliance', A: 96, fullMark: 100 }
  ]

  const reportTypes = [
    { id: 'overview', label: 'HR Overview', icon: MdAssessment },
    { id: 'demographics', label: 'Demographics', icon: MdPieChart },
    { id: 'attendance', label: 'Attendance', icon: MdAccessTime },
    { id: 'payroll', label: 'Payroll', icon: MdAttachMoney },
    { id: 'performance', label: 'Performance', icon: MdTrendingUp }
  ]

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <MdAssessment className="mr-2 text-blue-500" />
            HR Reports & Analytics
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">From:</label>
              <input 
                type="date" 
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({...prev, from: e.target.value}))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">To:</label>
              <input 
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({...prev, to: e.target.value}))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                       transition-colors text-sm flex items-center space-x-2"
            >
              <MdPrint /> <span>Print</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors text-sm flex items-center space-x-2"
            >
              <MdDownload /> <span>Export</span>
            </motion.button>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="flex space-x-2 mb-6">
          {reportTypes.map((type) => {
            const Icon = type.icon
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReportType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                  ${reportType === type.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Icon className="text-lg" />
                <span className="text-sm font-medium">{type.label}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Report Content */}
        {reportType === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Distribution */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Employee Turnover */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Turnover</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={turnoverData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hired" fill="#10B981" name="Hired" />
                  <Bar dataKey="terminated" fill="#EF4444" name="Terminated" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance Trend */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance & Punctuality Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="punctuality" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Salary Distribution */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Salary Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="range" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {reportType === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics Radar</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={performanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Employees" value="136" trend="+12%" color="blue" />
        <KPICard title="Turnover Rate" value="2.4%" trend="-0.5%" color="green" />
        <KPICard title="Avg. Attendance" value="94.2%" trend="+1.2%" color="purple" />
        <KPICard title="Training Completion" value="87%" trend="+5%" color="orange" />
      </div>
    </div>
  )
}

const KPICard = ({ title, value, trend, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${color}-500`}
  >
    <p className="text-sm text-gray-600 mb-1">{title}</p>
    <p className={`text-3xl font-bold text-${color}-600 mb-2`}>{value}</p>
    <span className={`text-sm font-medium text-${color}-500`}>{trend}</span>
  </motion.div>
)

export default AdvancedReports
