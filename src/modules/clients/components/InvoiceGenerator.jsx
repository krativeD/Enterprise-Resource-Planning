import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdSave, MdPrint, MdDownload, MdEmail, MdWork } from 'react-icons/md'
import { supabase } from '../../../services/supabase'

const InvoiceGenerator = ({ client, onGenerate, onCancel }) => {
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    client_id: client?.id,
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'draft'
  })

  const [quotations, setQuotations] = useState([])
  const [selectedQuotation, setSelectedQuotation] = useState(null)

  // Load client's accepted quotations
  useEffect(() => {
    loadQuotations()
    generateInvoiceNumber()
  }, [])

  const loadQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('client_id', client?.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotations(data || [])
    } catch (error) {
      console.error('Error loading quotations:', error)
    }
  }

  const generateInvoiceNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      const year = new Date().getFullYear()
      let nextNumber = 1

      if (data && data.length > 0) {
        const lastNumber = parseInt(data[0].invoice_number.split('-')[2])
        nextNumber = lastNumber + 1
      }

      const invNumber = `INV-${year}-${String(nextNumber).padStart(4, '0')}`
      setInvoice(prev => ({ ...prev, invoice_number: invNumber }))
    } catch (error) {
      const invNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      setInvoice(prev => ({ ...prev, invoice_number: invNumber }))
    }
  }

  const handleSelectQuotation = (quoteId) => {
    const quote = quotations.find(q => q.id === quoteId)
    if (quote) {
      setSelectedQuotation(quote)
      setInvoice(prev => ({
        ...prev,
        items: quote.items || [],
        subtotal: quote.subtotal || 0,
        tax: quote.tax_amount || 0,
        total: quote.total || 0
      }))
    }
  }

  const handleGenerateAndCreateJobs = async () => {
    try {
      // Save invoice
      const { data: invData, error: invError } = await supabase
        .from('invoices')
        .insert([invoice])
        .select()

      if (invError) throw invError

      // Create jobs from invoice items
      if (invoice.items?.length > 0) {
        const jobs = invoice.items.map(item => ({
          job_id: `JOB-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          client_name: client?.company_name,
          client_phone: client?.contact_phone,
          client_email: client?.contact_email,
          address: client?.service_address,
          city: client?.service_city,
          state: client?.service_state,
          zip_code: client?.service_zip,
          job_type: item.service?.toLowerCase().replace(/\s+/g, '_') || 'cleaning',
          service_type: 'regular',
          priority: 'medium',
          status: 'pending',
          scheduled_date: new Date().toISOString().split('T')[0],
          scheduled_time: '08:00',
          estimated_duration: item.hours || 2,
          team_size: Math.ceil((item.hours || 2) / 4),
          frequency: item.frequency?.toLowerCase() || 'once',
          invoice_reference: invoice.invoice_number,
          quote_reference: selectedQuotation?.quote_number
        }))

        await supabase.from('jobs').insert(jobs)
      }

      onGenerate(invoice)
    } catch (error) {
      console.error('Error generating invoice and jobs:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Generate Invoice #{invoice.invoice_number}
          </h2>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleGenerateAndCreateJobs}
              className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2"
            >
              <MdWork /> <span>Generate & Create Jobs</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </motion.button>
          </div>
        </div>

        {/* Select from Quotation */}
        {quotations.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Create from Accepted Quotation
            </label>
            <select
              onChange={(e) => handleSelectQuotation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select quotation...</option>
              {quotations.map(quote => (
                <option key={quote.id} value={quote.id}>
                  {quote.quote_number} - ${quote.total?.toFixed(2)} ({quote.date})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Invoice Items */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right">Rate</th>
                <th className="p-3 text-right">Hours</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{item.service}</td>
                  <td className="p-3 text-sm text-gray-600">{item.description}</td>
                  <td className="p-3 text-right">${item.rate?.toFixed(2)}</td>
                  <td className="p-3 text-right">{item.hours}h</td>
                  <td className="p-3 text-right font-medium">${item.amount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-bold">
                <td colSpan={4} className="p-3 text-right">Total:</td>
                <td className="p-3 text-right text-blue-600">${invoice.total?.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InvoiceGenerator
