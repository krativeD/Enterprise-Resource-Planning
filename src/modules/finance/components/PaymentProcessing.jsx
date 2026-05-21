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

      <div className="bg-white
