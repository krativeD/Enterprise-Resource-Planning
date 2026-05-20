import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MdAdd, MdDelete, MdSave, MdSend, MdPrint, MdCancel,
  MdEmail, MdPictureAsPdf, MdCheckCircle, MdWork
} from 'react-icons/md'
import { useReactToPrint } from 'react-to-print'
import QuotationPrint from './QuotationPrint'
import { supabase } from '../../../services/supabase'

const QuotationForm = ({ client, onSubmit, onCancel }) => {
  const printRef = useRef()
  const [step, setStep] = useState('form') // form, preview, sent
  const [saving, setSaving] = useState(false)
  const [autoNumber, setAutoNumber] = useState('')
  
  const [quotation, setQuotation] = useState({
    quote_number: '',
    client_id: client?.id,
    company_name: 'NDANDULENI CLEANING SERVICES',
    company_address: '123 Main Street, Middelburg, Mpumalanga, 1050',
    company_phone: '+27 72 000 0000',
    company_email: 'info@ndanduleni.co.za',
    company_logo: '/logo.png', // Path to company logo
    client_name: client?.company_name || '',
    client_address: client?.service_address || '',
    client_city: client?.service_city || '',
    client_state: client?.service_state || '',
    client_zip: client?.service_zip || '',
    client_contact: client?.contact_first_name + ' ' + client?.contact_last_name || '',
    client_email: client?.contact_email || '',
    client_phone: client?.contact_phone || '',
    date: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      { 
        service: 'Office Cleaning', 
        description: 'Complete office cleaning service including all rooms, bathrooms, and common areas', 
        frequency: 'Daily', 
        rate: 150, 
        hours: 2, 
        amount: 300 
      },
      { 
        service: 'Window Cleaning', 
        description: 'Interior and exterior window cleaning for all accessible windows', 
        frequency: 'Monthly', 
        rate: 200, 
        hours: 3, 
        amount: 600 
      },
    ],
    discount: 5,
    tax_rate: 15,
    notes: 'Thank you for considering Ndanduleni Cleaning Services. This quotation is valid for 30 days.',
    terms: '1. Payment due within 30 days of invoice date.\n2. Prices valid for 30 days from quotation date.\n3. Any additional services requested will be quoted separately.\n4. Cancellation requires 24 hours notice.',
    status: 'draft'
  })

  // Auto-generate quotation number
  useEffect(() => {
    generateQuoteNumber()
  }, [])

  const generateQuoteNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('quote_number')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      const year = new Date().getFullYear()
      let nextNumber = 1

      if (data && data.length > 0) {
        const lastNumber = parseInt(data[0].quote_number.split('-')[2])
        nextNumber = lastNumber + 1
      }

      const quoteNumber = `Q-${year}-${String(nextNumber).padStart(4, '0')}`
      setAutoNumber(quoteNumber)
      setQuotation(prev => ({ ...prev, quote_number: quoteNumber }))
    } catch (error) {
      console.error('Error generating quote number:', error)
      // Fallback to timestamp-based number
      const quoteNumber = `Q-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      setAutoNumber(quoteNumber)
      setQuotation(prev => ({ ...prev, quote_number: quoteNumber }))
    }
  }

  const addLineItem = () => {
    setQuotation(prev => ({
      ...prev,
      items: [...prev.items, { 
        service: '', 
        description: '', 
        frequency: 'Once', 
        rate: 0, 
        hours: 0, 
        amount: 0 
      }]
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
        newItems[index].amount = (newItems[index].rate || 0) * (newItems[index].hours || 0)
      }
      return { ...prev, items: newItems }
    })
  }

  const subtotal = quotation.items.reduce((sum, item) => sum + (item.amount || 0), 0)
  const discountAmount = subtotal * ((quotation.discount || 0) / 100)
  const taxAmount = (subtotal - discountAmount) * ((quotation.tax_rate || 0) / 100)
  const total = subtotal - discountAmount + taxAmount

  const handleSave = async (status = 'draft') => {
    setSaving(true)
    try {
      const quotationData = {
        ...quotation,
        subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total,
        status
      }

      const { data, error } = await supabase
        .from('quotations')
        .insert([quotationData])
        .select()

      if (error) throw error

      onSubmit({ ...quotationData, id: data[0].id })
    } catch (error) {
      console.error('Error saving quotation:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAcceptAndCreateJob = async () => {
    try {
      // Save quotation as accepted
      const quotationData = {
        ...quotation,
        subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total,
        status: 'accepted'
      }

      const { data: quoteData, error: quoteError } = await supabase
        .from('quotations')
        .insert([quotationData])
        .select()

      if (quoteError) throw quoteError

      // Auto-create job from accepted quotation
      const jobData = {
        job_id: `JOB-${Date.now()}`,
        client_name: quotation.client_name,
        client_phone: quotation.client_phone,
        client_email: quotation.client_email,
        address: `${quotation.client_address}, ${quotation.client_city}, ${quotation.client_state} ${quotation.client_zip}`,
        city: quotation.client_city,
        state: quotation.client_state,
        zip_code: quotation.client_zip,
        job_type: quotation.items[0]?.service?.toLowerCase().replace(/\s+/g, '_') || 'cleaning',
        service_type: 'contract',
        priority: 'medium',
        status: 'pending',
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time: '08:00',
        estimated_duration: quotation.items.reduce((sum, item) => sum + (item.hours || 0), 0),
        team_size: Math.ceil(quotation.items.reduce((sum, item) => sum + (item.hours || 0), 0) / 4),
        notes: quotation.notes,
        special_instructions: quotation.items.map(item => 
          `${item.service}: ${item.description} (${item.frequency})`
        ).join('\n'),
        equipment_needed: [],
        chemicals_needed: [],
        frequency: quotation.items[0]?.frequency?.toLowerCase() || 'once',
        quote_reference: quotation.quote_number,
        is_emergency: false
      }

      const { error: jobError } = await supabase
        .from('jobs')
        .insert([jobData])

      if (jobError) throw jobError

      // Create contract if it's a recurring service
      if (jobData.frequency !== 'once') {
        const contractData = {
          contract_number: `C-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
          client_id: client?.id,
          quotation_id: quoteData[0].id,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          contract_value: total,
          service_type: jobData.job_type,
          frequency: jobData.frequency,
          sla_terms: quotation.terms,
          created_at: new Date()
        }

        await supabase.from('contracts').insert([contractData])
      }

      onSubmit({ ...quotationData, id: quoteData[0].id, job_created: true })
    } catch (error) {
      console.error('Error creating job from quotation:', error)
    }
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Quotation_${quotation.quote_number}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `
  })

  const handleDownloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default
    const element = printRef.current
    const opt = {
      margin: 10,
      filename: `Quotation_${quotation.quote_number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(element).save()
  }

  const handleSendEmail = () => {
    const subject = `Quotation ${quotation.quote_number} - Ndanduleni Cleaning Services`
    const body = `Dear ${quotation.client_contact},\n\nPlease find attached quotation ${quotation.quote_number}.\n\nTotal Amount: $${total.toFixed(2)}\n\nBest regards,\nNdanduleni Cleaning Services`
    window.location.href = `mailto:${quotation.client_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 'form' ? 'Create Quotation' : 
               step === 'preview' ? 'Preview Quotation' : 'Quotation Saved'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Quote #: <span className="font-mono font-bold text-blue-600">{quotation.quote_number}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {step === 'form' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('preview')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2"
                >
                  <MdPictureAsPdf /> <span>Preview</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center space-x-2"
                >
                  <MdSave /> <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                >
                  Cancel
                </motion.button>
              </>
            )}
            {step === 'preview' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handlePrint}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center space-x-2"
                >
                  <MdPrint /> <span>Print</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2"
                >
                  <MdPictureAsPdf /> <span>Download PDF</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2"
                >
                  <MdEmail /> <span>Email</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleAcceptAndCreateJob}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center space-x-2"
                >
                  <MdWork /> <span>Accept & Create Job</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('form')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                >
                  Back to Edit
                </motion.button>
              </>
            )}
            {step === 'sent' && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center space-x-2"
              >
                <MdCheckCircle /> <span>Done</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Form or Preview */}
      {step === 'form' ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Client & Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg border-b pb-2">Company Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" value={quotation.company_name} 
                  onChange={(e) => setQuotation(prev => ({...prev, company_name: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={quotation.company_address} 
                  onChange={(e) => setQuotation(prev => ({...prev, company_address: e.target.value}))}
                  rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={quotation.company_phone} 
                    onChange={(e) => setQuotation(prev => ({...prev, company_phone: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="text" value={quotation.company_email} 
                    onChange={(e) => setQuotation(prev => ({...prev, company_email: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg border-b pb-2">Client Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input type="text" value={quotation.client_name} disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={`${quotation.client_address}, ${quotation.client_city}, ${quotation.client_state} ${quotation.client_zip}`} 
                  disabled rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input type="text" value={quotation.client_contact} disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="text" value={quotation.client_email} disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quote Number</label>
              <input type="text" value={quotation.quote_number} disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={quotation.date} 
                onChange={(e) => setQuotation(prev => ({...prev, date: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
              <input type="date" value={quotation.valid_until} 
                onChange={(e) => setQuotation(prev => ({...prev, valid_until: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">Services</h3>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={addLineItem}
                className="text-sm text-blue-500 flex items-center space-x-1"
              >
                <MdAdd /> <span>Add Service</span>
              </motion.button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-sm font-medium">Service</th>
                    <th className="p-3 text-left text-sm font-medium">Description</th>
                    <th className="p-3 text-left text-sm font-medium">Frequency</th>
                    <th className="p-3 text-right text-sm font-medium">Rate/h ($)</th>
                    <th className="p-3 text-right text-sm font-medium">Hours</th>
                    <th className="p-3 text-right text-sm font-medium">Amount ($)</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="p-2">
                        <input type="text" value={item.service} 
                          onChange={(e) => updateLineItem(index, 'service', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm" 
                          placeholder="e.g., Office Cleaning" />
                      </td>
                      <td className="p-2">
                        <input type="text" value={item.description} 
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          placeholder="Service description" />
                      </td>
                      <td className="p-2">
                        <select value={item.frequency} 
                          onChange={(e) => updateLineItem(index, 'frequency', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm">
                          <option>Once</option>
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Bi-Weekly</option>
                          <option>Monthly</option>
                          <option>Quarterly</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input type="number" value={item.rate} 
                          onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border rounded text-sm text-right" min="0" step="0.01" />
                      </td>
                      <td className="p-2">
                        <input type="number" value={item.hours} 
                          onChange={(e) => updateLineItem(index, 'hours', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border rounded text-sm text-right" min="0" step="0.5" />
                      </td>
                      <td className="p-2 text-right text-sm font-medium">
                        ${(item.amount || 0).toFixed(2)}
                      </td>
                      <td className="p-2">
                        <button onClick={() => removeLineItem(index)} 
                          className="text-red-500 hover:text-red-700">
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount ({quotation.discount}%):</span>
                <span className="text-red-500">-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({quotation.tax_rate}%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={quotation.notes} 
                onChange={(e) => setQuotation(prev => ({...prev, notes: e.target.value}))}
                rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Additional notes for the client..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
              <textarea value={quotation.terms} 
                onChange={(e) => setQuotation(prev => ({...prev, terms: e.target.value}))}
                rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Terms and conditions..." />
            </div>
          </div>
        </div>
      ) : (
        /* A4 Preview */
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div ref={printRef}>
            <QuotationPrint quotation={{ ...quotation, subtotal, discountAmount, taxAmount, total }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default QuotationForm
