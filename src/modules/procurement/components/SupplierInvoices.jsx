import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdReceipt, MdAdd, MdAttachMoney } from 'react-icons/md'

const SupplierInvoices = ({ invoices, onRecord, orders, loading }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    supplier_id: '',
    po_id: '',
    invoice_number: '',
    amount: 0,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    status: 'pending'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onRecord(formData)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Supplier Invoices</h2>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl flex items-center space-x-2"
          >
            <MdAdd /> <span>Record Invoice</span>
          </motion.button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Invoice #</th>
              <th className="p-4 text-left">PO Reference</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Due Date</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="p-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                  ))}
                </tr>
              ))
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-500">No supplier invoices recorded</td>
              </tr>
            ) : (
              invoices.map((inv, i) => (
                <tr key={inv.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{inv.invoice_number}</td>
                  <td className="p-4 text-sm">{inv.po_id}</td>
                  <td className="p-4 text-right font-medium">${(inv.amount || 0).toFixed(2)}</td>
                  <td className="p-4 text-sm">{inv.invoice_date}</td>
                  <td className="p-4 text-sm">{inv.due_date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      inv.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inv.payment_status || 'unpaid'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Record Invoice Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Record Supplier Invoice</h2>
              <button onClick={() => setShowForm(false)} className="text-2xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Invoice Number *</label>
                <input type="text" value={formData.invoice_number}
                  onChange={(e) => setFormData(prev => ({...prev, invoice_number: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount *</label>
                <input type="number" value={formData.amount}
                  onChange={(e) => setFormData(prev => ({...prev, amount: parseFloat(e.target.value) || 0}))}
                  className="w-full px-4 py-2 border rounded-lg" min="0" step="0.01" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Invoice Date</label>
                <input type="date" value={formData.invoice_date}
                  onChange={(e) => setFormData(prev => ({...prev, invoice_date: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input type="date" value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({...prev, due_date: e.target.value}))}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center justify-center space-x-2">
                  <MdReceipt /> <span>Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierInvoices
