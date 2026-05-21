import React from 'react'
import { MdAccountBalance } from 'react-icons/md'

const PayrollAccounting = ({ dateRange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <MdAccountBalance className="mr-2 text-indigo-500" /> Payroll Accounting
      </h2>
      <p className="text-gray-500">Payroll accounting integrated with HR module.</p>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Total Salaries</p>
          <p className="text-2xl font-bold text-indigo-600">$180,000</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Tax Deductions</p>
          <p className="text-2xl font-bold text-red-600">$45,000</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Net Pay</p>
          <p className="text-2xl font-bold text-green-600">$135,000</p>
        </div>
      </div>
    </div>
  )
}

export default PayrollAccounting
