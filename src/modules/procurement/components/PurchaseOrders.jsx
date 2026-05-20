import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdPrint, MdDownload, MdSend, MdCheckCircle } from 'react-icons/md'

const PurchaseOrders = ({ orders, onCreate, onUpdate, suppliers, requests, searchTerm, loading }) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    supplier_id: '',
    items: [{ item_name: '', description: '', quantity: 1, unit_price: 0, total: 0 }],
    delivery_date: '',
    payment_terms: 'net30',
    notes: '',
    shipping_address: ''
  })

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item_name: '', description: '', quantity: 1, unit_price: 0, total: 0 }]
    }))
  }

  const updateItem = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], [field]: value }
      if (field === 'quantity' || field === 'unit_price') {
        newItems[index].total = (newItems[index].quantity || 0) * (newItems[index].unit_price || 0)
      }
      return { ...prev, items: newItems }
    })
  }

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.total || 0), 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate({
      ...formData,
      po_number: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'issued',
      total_amount: totalAmount
    })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Purchase Orders</h2>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-medium flex items-center space-x-2">
            <MdAdd /> <span>Create PO</span>
          </motion.button>
        </div>
      </div>

      {/* PO List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">PO Number</th>
              <th className="p-4 text-left">Supplier</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((po, i) => (
              <tr key={po.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-mono text-indigo-600">{po.po_number}</td>
                <td className="p-4">{po.supplier_name}</td>
                <td className="p-4 text-sm">{po.date}</td>
                <td className="p-4 text-right font-medium">${(po.total_amount || 0).toFixed(2)}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{po.status}</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button className="text-blue-500"><MdPrint /></button>
                    <button className="text-green-500"><MdDownload /></button>
                    <button className="text-indigo-500"><MdSend /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create PO Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">Create Purchase Order</h2>
              <button onClick={() => setShowForm(false)} className="text-2xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier *</label>
                  <select value={formData.supplier_id} onChange={(e) => setFormData(prev => ({...prev, supplier_id: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg" required>
                    <option value="">Select supplier...</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.company_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Date</label>
                  <input type="date" value={formData.delivery_date}
                    onChange={(e) => setFormData(prev => ({...prev, delivery_date: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Items</h3>
                  <button type="button" onClick={addItem} className="text-indigo-500 text-sm">+ Add Item</button>
                </div>
                {formData.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 mb-2">
                    <input type="text" placeholder="Item" value={item.item_name}
                      onChange={(e) => updateItem(i, 'item_name', e.target.value)}
                      className="col-span-4 px-3 py-2 border rounded-lg text-sm" />
                    <input type="text" placeholder="Description" value={item.description}
                      onChange={(e) => updateItem(i, 'description', e.target.value)}
                      className="col-span-3 px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" placeholder="Qty" value={item.quantity}
                      onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                      className="col-span-2 px-3 py-2 border rounded-lg text-sm" min="1" />
                    <input type="number" placeholder="Price" value={item.unit_price}
                      onChange={(e) => updateItem(i, 'unit_price', Number(e.target.value))}
                      className="col-span-2 px-3 py-2 border rounded-lg text-sm" min="0" step="0.01" />
                    <div className="col-span-1 flex items-center justify-end font-medium text-sm">
                      ${(item.total || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-bold">Total: ${totalAmount.toFixed(2)}</span>
                <div className="flex space-x-3">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-200 rounded-xl">Cancel</button>
                  <button type="submit"
                    className="px-6 py-3 bg-indigo-500 text-white rounded-xl flex items-center space-x-2">
                    <MdCheckCircle /> <span>Issue Purchase Order</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseOrders
