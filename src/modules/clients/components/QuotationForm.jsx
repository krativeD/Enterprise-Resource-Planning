import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdDelete, MdSave, MdSend, MdPrint, MdCancel } from 'react-icons/md'

const QuotationForm = ({ client, onSubmit, onCancel }) => {
  const [quotation, setQuotation] = useState({
    quote_number: `Q-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
    client_id: client?.id,
    client_name: client?.company_name || '',
    date: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      { service: 'Office Cleaning', description: 'Daily office cleaning service', frequency: 'Daily', rate: 150, hours: 2, amount: 300 },
      { service: 'Window Cleaning', description: 'Monthly window cleaning', frequency: 'Monthly', rate: 200, hours: 3, amount: 600 },
    ],
    discount: 5,
    tax_rate: 15,
    notes: 'Thank you for your interest in our services.',
    terms: 'Payment due within 30 days. Prices valid for 30 days.'
  })

  const addLineItem = () => {
    setQuotation(prev => ({
      ...prev,
      items: [...prev.items, { service: '', description: '', frequency: 'Once', rate: 0, hours: 0, amount: 0 }]
    }))
  }

  const removeLineItem = (index) => {
    setQuotation(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateLineItem = (index, field, value) => {
    setQuotation(prev => {
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], [field]: value }
      if (field === 'rate' || field === 'hours') {
        newItems[index].amount = newItems[index].rate * newItems[index].hours
      }
      return { ...prev, items: newItems }
    })
  }

  const subtotal = quotation.items.reduce((sum, item) => sum + item.amount, 0)
  const discountAmount = subtotal * (quotation.discount / 100)
  const taxAmount = (subtotal - discountAmount) * (quotation.tax_rate / 100)
  const total = subtotal - discountAmount + taxAmount

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Create Quotation</h2>
        <div className="flex space-x-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => onSubmit(quotation)} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2">
            <MdSave /> <span>Save</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quote #</label>
          <input type="text" value={quotation.quote_number} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Client</label>
          <input type="text" value={quotation.client_name} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" value={quotation.date} onChange={(e) => setQuotation(prev => ({...prev, date: e.target.value}))}
            className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valid Until</label>
          <input type="date" value={quotation.valid_until} onChange={(e) => setQuotation(prev => ({...prev, valid_until: e.target.value}))}
            className="w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">Line Items</h3>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={addLineItem} className="text-sm text-blue-500 flex items-center">
            <MdAdd /> Add Item
          </motion.button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left text-sm">Service</th>
                <th className="p-2 text-left text-sm">Description</th>
                <th className="p-2 text-left text-sm">Frequency</th>
                <th className="p-2 text-right text-sm">Rate/h</th>
                <th className="p-2 text-right text-sm">Hours</th>
                <th className="p-2 text-right text-sm">Amount</th>
                <th className="p-2 text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">
                    <input type="text" value={item.service} onChange={(e) => updateLineItem(index, 'service', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm" />
                  </td>
                  <td className="p-2">
                    <input type="text" value={item.description} onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm" />
                  </td>
                  <td className="p-2">
                    <select value={item.frequency} onChange={(e) => updateLineItem(index, 'frequency', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm">
                      <option>Once</option><option>Daily</option><option>Weekly</option><option>Monthly</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input type="number" value={item.rate} onChange={(e) => updateLineItem(index, 'rate', Number(e.target.value))}
                      className="w-24 px-2 py-1 border rounded text-sm text-right" />
                  </td>
                  <td className="p-2">
                    <input type="number" value={item.hours} onChange={(e) => updateLineItem(index, 'hours', Number(e.target.value))}
                      className="w-20 px-2 py-1 border rounded text-sm text-right" />
                  </td>
                  <td className="p-2 text-right text-sm font-medium">${item.amount}</td>
                  <td className="p-2">
                    <button onClick={() => removeLineItem(index)} className="text-red-500"><MdDelete /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Discount ({quotation.discount}%):</span>
            <span className="text-red-500">-${discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax ({quotation.tax_rate}%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuotationForm
