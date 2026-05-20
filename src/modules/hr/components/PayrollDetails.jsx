import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAttachMoney, MdCalculate, MdPrint } from 'react-icons/md'

const PayrollDetails = ({ employee }) => {
  const [payrollItems] = useState([
    { name: 'Social Security', type: 'Tax Deduction', wage_percent: 6.2, base_limit: 147000, amount: 285.20 },
    { name: 'Federal Income Tax', type: 'Tax Deduction', wage_percent: 15, base_limit: null, amount: 690.00 },
    { name: 'Medicare', type: 'Tax Deduction', wage_percent: 1.45, base_limit: null, amount: 66.70 },
    { name: 'Health Insurance', type: 'Deduction', wage_percent: null, base_limit: null, amount: 250.00 },
    { name: 'Fuel Reimbursement', type: 'Addition', wage_percent: null, base_limit: null, amount: 150.00 },
    { name: 'Bonus', type: 'Addition', wage_percent: null, base_limit: null, amount: 300.00 },
  ])

  const grossPay = 4600
  const totalDeductions = payrollItems
    .filter(item => item.type.includes('Deduction'))
    .reduce((sum, item) => sum + item.amount, 0)
  const totalAdditions = payrollItems
    .filter(item => item.type === 'Addition')
    .reduce((sum, item) => sum + item.amount, 0)
  const netPay = grossPay - totalDeductions + totalAdditions

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Gross Pay" amount={grossPay} color="text-blue-600" />
        <SummaryCard title="Total Deductions" amount={totalDeductions} color="text-red-600" />
        <SummaryCard title="Net Pay" amount={netPay} color="text-green-600" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payroll Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3">Item Name</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Wage %</th>
                <th className="text-left p-3">Base Limit</th>
                <th className="text-right p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payrollItems.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.type === 'Addition' ? 'bg-green-100 text-green-800' :
                      item.type === 'Deduction' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3">{item.wage_percent ? `${item.wage_percent}%` : '--'}</td>
                  <td className="p-3">{item.base_limit ? `$${item.base_limit.toLocaleString()}` : '--'}</td>
                  <td className="p-3 text-right font-semibold">
                    ${item.amount.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-2 rounded-lg 
                   hover:bg-blue-600 transition-colors"
        >
          <MdPrint /> <span>Print Payslip</span>
        </motion.button>
      </div>
    </div>
  )
}

const SummaryCard = ({ title, amount, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
  >
    <p className="text-sm text-gray-600 mb-2">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>
      ${amount.toFixed(2)}
    </p>
  </motion.div>
)

export default PayrollDetails
