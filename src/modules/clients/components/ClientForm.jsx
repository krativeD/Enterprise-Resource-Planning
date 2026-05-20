import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSave, MdCancel, MdAdd, MdBusiness, MdLocationOn, MdPerson } from 'react-icons/md'

const ClientForm = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    // Company Information
    company_name: client?.company_name || '',
    client_type: client?.client_type || 'commercial',
    industry: client?.industry || '',
    tax_id: client?.tax_id || '',
    website: client?.website || '',
    status: client?.status || 'active',
    
    // Primary Contact
    contact_first_name: client?.contact_first_name || '',
    contact_last_name: client?.contact_last_name || '',
    contact_email: client?.contact_email || '',
    contact_phone: client?.contact_phone || '',
    contact_position: client?.contact_position || '',
    
    // Address
    billing_address: client?.billing_address || '',
    billing_city: client?.billing_city || '',
    billing_state: client?.billing_state || '',
    billing_zip: client?.billing_zip || '',
    
    service_address: client?.service_address || '',
    service_city: client?.service_city || '',
    service_state: client?.service_state || '',
    service_zip: client?.service_zip || '',
    
    // Service Preferences
    preferred_service_type: client?.preferred_service_type || [],
    service_frequency: client?.service_frequency || 'weekly',
    square_footage: client?.square_footage || '',
    number_of_rooms: client?.number_of_rooms || '',
    special_requirements: client?.special_requirements || '',
    
    // Billing
    billing_cycle: client?.billing_cycle || 'monthly',
    payment_terms: client?.payment_terms || 'net30',
    credit_limit: client?.credit_limit || '',
    preferred_payment_method: client?.preferred_payment_method || 'bank_transfer',
    
    // Notes
    internal_notes: client?.internal_notes || '',
    source: client?.source || '',
    referred_by: client?.referred_by || ''
  })

  const serviceTypes = [
    'Office Cleaning',
    'Residential Cleaning',
    'Deep Cleaning',
    'Carpet Cleaning',
    'Window Cleaning',
    'Sanitization',
    'Pest Control',
    'Garden Services',
    'Floor Maintenance',
    'Pressure Washing'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleServiceType = (type) => {
    setFormData(prev => ({
      ...prev,
      preferred_service_type: prev.preferred_service_type.includes(type)
        ? prev.preferred_service_type.filter(t => t !== type)
        : [...prev.preferred_service_type, type]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Information */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <MdBusiness className="mr-2 text-blue-500" /> Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Type *</label>
            <select name="client_type" value={formData.client_type} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
              <option value="industrial">Industrial</option>
              <option value="government">Government</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input type="text" name="industry" value={formData.industry} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID/VAT Number</label>
            <input type="text" name="tax_id" value={formData.tax_id} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input type="url" name="website" value={formData.website} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Contact */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <MdPerson className="mr-2 text-green-500" /> Primary Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input type="text" name="contact_first_name" value={formData.contact_first_name} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input type="text" name="contact_last_name" value={formData.contact_last_name} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input type="text" name="contact_position" value={formData.contact_position} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MdLocationOn className="mr-2 text-purple-500" /> Billing Address
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="billing_address" value={formData.billing_address} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input type="text" name="billing_city" value={formData.billing_city} onChange={handleChange}
                placeholder="City" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" name="billing_state" value={formData.billing_state} onChange={handleChange}
                placeholder="State" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" name="billing_zip" value={formData.billing_zip} onChange={handleChange}
                placeholder="ZIP" className="px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MdLocationOn className="mr-2 text-orange-500" /> Service Address
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="sameAsBilling" className="rounded"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      service_address: prev.billing_address,
                      service_city: prev.billing_city,
                      service_state: prev.billing_state,
                      service_zip: prev.billing_zip
                    }))
                  }
                }} />
              <label htmlFor="sameAsBilling" className="text-sm text-gray-600">Same as billing address</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="service_address" value={formData.service_address} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input type="text" name="service_city" value={formData.service_city} onChange={handleChange}
                placeholder="City" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" name="service_state" value={formData.service_state} onChange={handleChange}
                placeholder="State" className="px-4 py-2 border border-gray-300 rounded-lg" />
              <input type="text" name="service_zip" value={formData.service_zip} onChange={handleChange}
                placeholder="ZIP" className="px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Service Preferences */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Service Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Services</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {serviceTypes.map(type => (
                <button key={type} type="button" onClick={() => toggleServiceType(type)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all
                    ${formData.preferred_service_type.includes(type)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select name="service_frequency" value={formData.service_frequency} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage</label>
              <input type="number" name="square_footage" value={formData.square_footage} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
              <input type="number" name="number_of_rooms" value={formData.number_of_rooms} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
            <textarea name="special_requirements" value={formData.special_requirements} onChange={handleChange}
              rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Any special cleaning requirements or instructions..."></textarea>
          </div>
        </div>
      </div>

      {/* Billing Preferences */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Billing Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
            <select name="billing_cycle" value={formData.billing_cycle} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
            <select name="payment_terms" value={formData.payment_terms} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="net15">Net 15</option>
              <option value="net30">Net 30</option>
              <option value="net45">Net 45</option>
              <option value="net60">Net 60</option>
              <option value="due_on_receipt">Due on Receipt</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select name="preferred_payment_method" value={formData.preferred_payment_method} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_order">Debit Order</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                   font-medium flex items-center space-x-2 shadow-lg"
        >
          <MdSave /> <span>{client ? 'Update Client' : 'Create Client'}</span>
        </motion.button>
      </div>
    </form>
  )
}

export default ClientForm
