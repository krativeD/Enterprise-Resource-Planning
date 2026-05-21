import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdPayment, MdAdd, MdCheckCircle } from 'react-icons/md'

const PaymentProcessing = ({ payments, invoices, onRecordPayment, loading }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    invoice_id: '', amount: 0, payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer', reference_number: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onRecordPayment({ ...formData, payment_number: `PAY-${Date.now().toString(36).toUpperCase()}` })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Payment Processing</h2>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-xl flex items-center space-x-2"
          >
            <MdAdd /> <span>Record Payment</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Payment #</th>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Method</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-12 text-center">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={5} className="p-12 text-center text-gray-500">No payments recorded</td></tr>
            ) : (
              payments.map((pay, i) => (
                <tr key={pay.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm">{pay.payment_number}</td>
                  <td className="p-4 text-sm">{pay.invoice_id}</td>
                  <td className="p-4 text-right font-medium text-green-600">${(pay.amount || 0).toFixed(2)}</td>
                  <td className="p-4 text-sm">{pay.payment_date}</td>
                  <td className="p-4 text-sm capitalize">{pay.payment_method?.replace(/_/g, ' ')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Invoice</label>
                <select value={formData.invoice_id} onChange={(e) => setFormData(prev => ({...prev, invoice_id: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg" required>
                  <option value="">Select invoice...</option>
                  {invoices?.map(inv => (
                    <option key={inv.id} value={inv.id}>{inv.invoice_number} - ${inv.total}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" value={formData.amount}
                  onChange={(e) => setFormData(prev => ({...prev, amount: parseFloat(e.target.value) || 0}))}
                  className="w-full px-4 py-2 border rounded-lg" min="0" step="0.01" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Date</label>
                <input type="date" value={formData.payment_date}
                  onChange={(e) => setFormData(prev => ({...prev, payment_date: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentProcessing
