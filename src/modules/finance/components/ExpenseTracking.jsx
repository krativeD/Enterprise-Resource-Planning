import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdMoneyOff } from 'react-icons/md'

const ExpenseTracking = ({ expenses, onAddExpense, dateRange, loading }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    description: '', category: 'supplies', amount: 0, date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddExpense({ ...formData, expense_number: `EXP-${Date.now().toString(36).toUpperCase()}` })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Expense Tracking</h2>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-red-500 text-white rounded-xl flex items-center space-x-2"
          >
            <MdAdd /> <span>Add Expense</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-12 text-center">Loading...</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan={4} className="p-12 text-center text-gray-500">No expenses recorded</td></tr>
            ) : (
              expenses.map((exp, i) => (
                <tr key={exp.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-sm">{exp.date}</td>
                  <td className="p-4">{exp.description}</td>
                  <td className="p-4 text-sm">{exp.category}</td>
                  <td className="p-4 text-right font-medium text-red-600">-${(exp.amount || 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" value={formData.amount}
                  onChange={(e) => setFormData(prev => ({...prev, amount: parseFloat(e.target.value) || 0}))}
                  className="w-full px-4 py-2 border rounded-lg" min="0" step="0.01" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg">
                  <option value="supplies">Supplies</option>
                  <option value="equipment">Equipment</option>
                  <option value="transport">Transport</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseTracking
