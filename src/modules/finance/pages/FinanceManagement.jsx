import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdAttachMoney, MdAccountBalance, MdReceipt, MdTrendingUp,
  MdTrendingDown, MdAssessment, MdCalculate, MdPrint,
  MdDownload, MdRefresh, MdAdd, MdSearch, MdFilterList,
  MdCalendarToday, MdPieChart, MdBarChart, MdShowChart,
  MdMonetizationOn, MdMoneyOff, MdAccountBalanceWallet,
  MdReceiptLong, MdPayment, MdSavings, MdCreditCard,
  MdWarning, MdCheckCircle, MdSchedule, MdBuild,
  MdArrowUpward, MdArrowDownward, MdMoreVert, MdEdit,
  MdDelete, MdFileDownload, MdEmail, MdSend
} from 'react-icons/md'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Scatter
} from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import FinanceDashboard from '../components/FinanceDashboard'
import InvoiceManagement from '../components/InvoiceManagement'
import ExpenseTracking from '../components/ExpenseTracking'
import PaymentProcessing from '../components/PaymentProcessing'
import PayrollAccounting from '../components/PayrollAccounting'
import BudgetingTools from '../components/BudgetingTools'
import ProfitLoss from '../components/ProfitLoss'
import CashFlowReport from '../components/CashFlowReport'
import TaxReports from '../components/TaxReports'
import FinancialReports from '../components/FinancialReports'
import { useFinanceData } from '../hooks/useFinanceData'
import { useToast } from '../../../hooks/useToast'

const FinanceManagement = () => {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  })
  const [searchTerm, setSearchTerm] = useState('')

  const {
    invoices,
    expenses,
    payments,
    financialData,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    addExpense,
    recordPayment,
    refreshData
  } = useFinanceData()

  const { showToast } = useToast()

  const modules = [
    { id: 'dashboard', label: 'Financial Dashboard', icon: MdDashboard },
    { id: 'invoices', label: 'Invoices', icon: MdReceipt },
    { id: 'expenses', label: 'Expenses', icon: MdMoneyOff },
    { id: 'payments', label: 'Payments', icon: MdPayment },
    { id: 'payroll', label: 'Payroll Accounting', icon: MdAccountBalance },
    { id: 'budgeting', label: 'Budgeting', icon: MdSavings },
    { id: 'profitloss', label: 'Profit & Loss', icon: MdTrendingUp },
    { id: 'cashflow', label: 'Cash Flow', icon: MdShowChart },
    { id: 'tax', label: 'Tax Reports', icon: MdAssessment },
    { id: 'reports', label: 'Financial Reports', icon: MdPrint }
  ]

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <MdAccountBalance className="text-4xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Finance & Accounting</h1>
                <p className="text-emerald-200 mt-1">
                  Complete financial management and reporting system
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/10 rounded-xl px-4 py-2">
                <MdCalendarToday className="text-emerald-200" />
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="bg-transparent text-white text-sm border-none outline-none"
                />
                <span className="text-emerald-200">to</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="bg-transparent text-white text-sm border-none outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20"
              >
                <MdRefresh className={loading ? 'animate-spin' : ''} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <motion.button
                  key={mod.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModule(mod.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-t-xl transition-all whitespace-nowrap
                    ${activeModule === mod.id
                      ? 'bg-white text-emerald-600 font-semibold'
                      : 'bg-transparent text-emerald-100 hover:bg-white/10'}`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden md:inline">{mod.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeModule === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FinanceDashboard
                financialData={financialData}
                dateRange={dateRange}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InvoiceManagement
                invoices={invoices}
                onCreateInvoice={createInvoice}
                onUpdateInvoice={updateInvoice}
                onDeleteInvoice={deleteInvoice}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'expenses' && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ExpenseTracking
                expenses={expenses}
                onAddExpense={addExpense}
                dateRange={dateRange}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PaymentProcessing
                payments={payments}
                invoices={invoices}
                onRecordPayment={recordPayment}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'payroll' && (
            <motion.div
              key="payroll"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PayrollAccounting dateRange={dateRange} />
            </motion.div>
          )}

          {activeModule === 'budgeting' && (
            <motion.div
              key="budgeting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BudgetingTools dateRange={dateRange} />
            </motion.div>
          )}

          {activeModule === 'profitloss' && (
            <motion.div
              key="profitloss"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProfitLoss dateRange={dateRange} financialData={financialData} />
            </motion.div>
          )}

          {activeModule === 'cashflow' && (
            <motion.div
              key="cashflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CashFlowReport dateRange={dateRange} financialData={financialData} />
            </motion.div>
          )}

          {activeModule === 'tax' && (
            <motion.div
              key="tax"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TaxReports dateRange={dateRange} financialData={financialData} />
            </motion.div>
          )}

          {activeModule === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FinancialReports dateRange={dateRange} financialData={financialData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FinanceManagement
