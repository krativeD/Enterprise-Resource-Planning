import React from 'react'
import { motion } from 'framer-motion'
import { MdReceipt, MdPrint, MdDownload } from 'react-icons/md'

const InvoiceManagement = ({ invoices, onCreateInvoice, onUpdateInvoice, onDeleteInvoice, searchTerm, setSearchTerm, loading }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Invoice Management</h2>
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">Invoice #</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="p-4"><div className="h-4 bg-gray-200 rounded animate-pulse"></div></td>
                  ))}
                </tr>
              ))
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">No invoices found</td>
              </tr>
            ) : (
              invoices.map((inv, i) => (
                <tr key={inv.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm">{inv.invoice_number}</td>
                  <td className="p-4 text-sm">{inv.date}</td>
                  <td className="p-4 text-right font-medium">${(inv.total || 0).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inv.status || 'pending'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button className="text-blue-500"><MdPrint /></button>
                      <button className="text-green-500"><MdDownload /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoiceManagement
