import React from 'react'
import { MdSavings } from 'react-icons/md'

const BudgetingTools = ({ dateRange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <MdSavings className="mr-2 text-emerald-500" /> Budgeting Tools
      </h2>
      <p className="text-gray-500">Budget planning and variance analysis.</p>
      <div className="mt-4 space-y-3">
        {['Salaries', 'Supplies', 'Equipment', 'Transport'].map((cat, i) => (
          <div key={i} className="flex items-center">
            <span className="w-24 text-sm">{cat}</span>
            <div className="flex-1 mx-3 bg-gray-200 rounded-full h-3">
              <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${60 + i * 10}%` }}></div>
            </div>
            <span className="text-sm font-medium">{60 + i * 10}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BudgetingTools
