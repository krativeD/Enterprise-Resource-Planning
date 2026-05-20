import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { MdPrint, MdDownload, MdTrendingUp, MdTrendingDown } from 'react-icons/md'

const ProfitLoss = ({ dateRange, financialData }) => {
  const pnlData = useMemo(() => ({
    revenue: {
      cleaningServices: 320000,
      contractServices: 145000,
      otherIncome: 20000,
      totalRevenue: 485000
    },
    expenses: {
      salaries: 180000,
      cleaningSupplies: 45000,
      equipment: 35000,
      transport: 25000,
      utilities: 15000,
      rent: 24000,
      insurance: 8000,
      marketing: 5000,
      other: 12000,
      totalExpenses: 349000
    },
    grossProfit: 485000 - 349000,
    operatingExpenses: 72000,
    netProfit: (485000 - 349000) - 72000
  }), [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Profit & Loss Statement</h2>
            <p className="text-gray-500 mt-1">
              {dateRange.from} to {dateRange.to}
            </p>
          </div>
          <div className="flex space-x-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2">
              <MdPrint /> <span>Print</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2">
              <MdDownload /> <span>Export</span>
            </motion.button>
          </div>
        </div>

        {/* P&L Statement */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {/* Revenue Section */}
            <div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-3 flex items-center">
                <MdTrendingUp className="mr-2" /> REVENUE
              </h3>
              <div className="space-y-2 pl-4">
                <PLRow label="Cleaning Services" amount={pnlData.revenue.cleaningServices} />
                <PLRow label="Contract Services" amount={pnlData.revenue.contractServices} />
                <PLRow label="Other Income" amount={pnlData.revenue.otherIncome} />
                <PLRow label="TOTAL REVENUE" amount={pnlData.revenue.totalRevenue} bold total />
              </div>
            </div>

            {/* Expenses Section */}
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                <MdTrendingDown className="mr-2" /> EXPENSES
              </h3>
              <div className="space-y-2 pl-4">
                <PLRow label="Salaries & Wages" amount={pnlData.expenses.salaries} />
                <PLRow label="Cleaning Supplies" amount={pnlData.expenses.cleaningSupplies} />
                <PLRow label="Equipment" amount={pnlData.expenses.equipment} />
                <PLRow label="Transport" amount={pnlData.expenses.transport} />
                <PLRow label="Utilities" amount={pnlData.expenses.utilities} />
                <PLRow label="Rent" amount={pnlData.expenses.rent} />
                <PLRow label="Insurance" amount={pnlData.expenses.insurance} />
                <PLRow label="Marketing" amount={pnlData.expenses.marketing} />
                <PLRow label="Other Expenses" amount={pnlData.expenses.other} />
                <PLRow label="TOTAL EXPENSES" amount={pnlData.expenses.totalExpenses} bold total />
              </div>
            </div>

            {/* Summary */}
            <div className="border-t-2 pt-4">
              <PLRow label="GROSS PROFIT" amount={pnlData.grossProfit} bold color="text-blue-600" />
              <PLRow label="Operating Expenses" amount={pnlData.operatingExpenses} />
              <PLRow 
                label="NET PROFIT" 
                amount={pnlData.netProfit} 
                bold 
                total 
                color={pnlData.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-600">Gross Margin</p>
              <p className="text-2xl font-bold text-emerald-600">
                {((pnlData.grossProfit / pnlData.revenue.totalRevenue) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Margin</p>
              <p className="text-2xl font-bold text-blue-600">
                {((pnlData.netProfit / pnlData.revenue.totalRevenue) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Operating Ratio</p>
              <p className="text-2xl font-bold text-purple-600">
                {((pnlData.expenses.totalExpenses / pnlData.revenue.totalRevenue) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PLRow = ({ label, amount, bold, total, color, size }) => (
  <div className={`flex justify-between py-2 ${total ? 'border-t-2 pt-3' : ''}`}>
    <span className={`${bold ? 'font-semibold' : ''} ${size === 'lg' ? 'text-lg' : 'text-sm'} text-gray-700`}>
      {label}
    </span>
    <span className={`${bold ? 'font-bold' : 'font-medium'} ${size === 'lg' ? 'text-lg' : 'text-sm'} ${color || 'text-gray-800'}`}>
      ${amount.toLocaleString()}
    </span>
  </div>
)

export default ProfitLoss
