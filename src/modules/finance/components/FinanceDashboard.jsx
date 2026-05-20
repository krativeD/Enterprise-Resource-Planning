import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  MdTrendingUp, MdTrendingDown, MdAccountBalance,
  MdReceipt, MdPayment, MdMoneyOff, MdSavings,
  MdWarning, MdCheckCircle
} from 'react-icons/md'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts'

const FinanceDashboard = ({ financialData, dateRange, loading }) => {
  // Mock financial data for display
  const kpiData = {
    totalRevenue: 485000,
    totalExpenses: 312000,
    netProfit: 173000,
    outstandingInvoices: 84500,
    cashInBank: 256000,
    monthlyGrowth: 12.5
  }

  const monthlyData = [
    { month: 'Jan', revenue: 38000, expenses: 25000, profit: 13000 },
    { month: 'Feb', revenue: 42000, expenses: 27000, profit: 15000 },
    { month: 'Mar', revenue: 45000, expenses: 28000, profit: 17000 },
    { month: 'Apr', revenue: 40000, expenses: 26000, profit: 14000 },
    { month: 'May', revenue: 48000, expenses: 30000, profit: 18000 },
    { month: 'Jun', revenue: 52000, expenses: 31000, profit: 21000 }
  ]

  const expenseBreakdown = [
    { name: 'Salaries', value: 180000, color: '#3B82F6' },
    { name: 'Supplies', value: 45000, color: '#10B981' },
    { name: 'Equipment', value: 35000, color: '#F59E0B' },
    { name: 'Transport', value: 25000, color: '#EF4444' },
    { name: 'Utilities', value: 15000, color: '#8B5CF6' },
    { name: 'Other', value: 12000, color: '#EC4899' }
  ]

  const cashFlowData = [
    { month: 'Jan', inflow: 42000, outflow: 28000 },
    { month: 'Feb', inflow: 45000, outflow: 30000 },
    { month: 'Mar', inflow: 48000, outflow: 32000 },
    { month: 'Apr', inflow: 43000, outflow: 29000 },
    { month: 'May', inflow: 50000, outflow: 33000 },
    { month: 'Jun', inflow: 55000, outflow: 34000 }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`$${kpiData.totalRevenue.toLocaleString()}`}
          icon={MdTrendingUp}
          trend="+12.5%"
          color="text-emerald-600"
          bgColor="bg-emerald-100"
          loading={loading}
        />
        <KPICard
          title="Total Expenses"
          value={`$${kpiData.totalExpenses.toLocaleString()}`}
          icon={MdMoneyOff}
          trend="+8.3%"
          color="text-red-600"
          bgColor="bg-red-100"
          loading={loading}
        />
        <KPICard
          title="Net Profit"
          value={`$${kpiData.netProfit.toLocaleString()}`}
          icon={MdSavings}
          trend="+18.2%"
          color="text-blue-600"
          bgColor="bg-blue-100"
          loading={loading}
        />
        <KPICard
          title="Cash in Bank"
          value={`$${kpiData.cashInBank.toLocaleString()}`}
          icon={MdAccountBalance}
          trend="+5.7%"
          color="text-purple-600"
          bgColor="bg-purple-100"
          loading={loading}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#revenueGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="url(#expenseGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Flow</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inflow" fill="#10B981" name="Cash In" />
              <Bar dataKey="outflow" fill="#EF4444" name="Cash Out" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left text-sm font-medium">Date</th>
                <th className="p-3 text-left text-sm font-medium">Description</th>
                <th className="p-3 text-left text-sm font-medium">Category</th>
                <th className="p-3 text-right text-sm font-medium">Amount</th>
                <th className="p-3 text-left text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2024-03-15', desc: 'Invoice #INV-2024-089 Payment', category: 'Income', amount: 5200, status: 'completed' },
                { date: '2024-03-14', desc: 'Cleaning Supplies Purchase', category: 'Expense', amount: -1250, status: 'completed' },
                { date: '2024-03-13', desc: 'Salary Payment - March', category: 'Expense', amount: -45000, status: 'completed' },
                { date: '2024-03-12', desc: 'Invoice #INV-2024-088 Payment', category: 'Income', amount: 3800, status: 'pending' },
                { date: '2024-03-11', desc: 'Equipment Maintenance', category: 'Expense', amount: -850, status: 'completed' }
              ].map((tx, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-sm">{tx.date}</td>
                  <td className="p-3 text-sm">{tx.desc}</td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.category === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className={`p-3 text-sm text-right font-medium ${
                    tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(tx.amount).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const KPICard = ({ title, value, icon: Icon, trend, color, bgColor, loading }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-2xl shadow-lg p-6"
  >
    {loading ? (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-3">
          <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
            <Icon className={`text-2xl ${color}`} />
          </div>
          <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </>
    )}
  </motion.div>
)

export default FinanceDashboard
