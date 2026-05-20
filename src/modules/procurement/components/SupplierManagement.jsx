import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MdBusiness, MdAdd, MdEdit, MdDelete, MdStar,
  MdPhone, MdEmail, MdLocationOn, MdSearch,
  MdCheckCircle, MdWarning, MdTimer
} from 'react-icons/md'

const SupplierManagement = ({ suppliers, onAdd, onUpdate, onDelete, searchTerm, loading }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    category: 'chemicals',
    tax_id: '',
    payment_terms: 'net30',
    rating: 3,
    status: 'active',
    notes: '',
    website: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSupplier) {
      onUpdate(editingSupplier.id, formData)
    } else {
      onAdd({ ...formData, supplier_code: `SUP-${Date.now().toString(36).toUpperCase()}` })
    }
    setShowForm(false)
    setEditingSupplier(null)
    setFormData({
      company_name: '', contact_person: '', email: '', phone: '',
      address: '', city: '', state: '', zip: '', category: 'chemicals',
      tax_id: '', payment_terms: 'net30', rating: 3, status: 'active',
      notes: '', website: ''
    })
  }

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier)
    setFormData(supplier)
    setShowForm(true)
  }

  const filteredSuppliers = suppliers.filter(s =>
    !searchTerm || s.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Suppliers</h2>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setEditingSupplier(null); setFormData({
              company_name: '', contact_person: '', email: '', phone: '',
              address: '', city: '', state: '', zip: '', category: 'chemicals',
              tax_id: '', payment_terms: 'net30', rating: 3, status: 'active',
              notes: '', website: ''
            }); setShowForm(true) }}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-medium flex items-center space-x-2">
            <MdAdd /> <span>Add Supplier</span>
          </motion.button>
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:border-indigo-200 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <MdBusiness className="text-2xl text-indigo-600" />
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <MdStar key={i} className={`text-lg ${i < (supplier.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-1">{supplier.company_name}</h3>
            <p className="text-sm text-gray-500 mb-3">{supplier.supplier_code}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MdPerson className="mr-2 text-gray-400" /> {supplier.contact_person}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MdEmail className="mr-2 text-gray-400" /> {supplier.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MdPhone className="mr-2 text-gray-400" /> {supplier.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MdLocationOn className="mr-2 text-gray-400" /> {supplier.city}, {supplier.state}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className={`px-2 py-1 rounded-full text-xs ${
                supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {supplier.status}
              </span>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(supplier)} className="text-indigo-500 hover:text-indigo-700">
                  <MdEdit />
                </button>
                <button onClick={() => onDelete(supplier.id)} className="text-red-500 hover:text-red-700">
                  <MdDelete />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
              <button onClick={() => setShowForm(false)} className="text-2xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name *</label>
                  <input type="text" value={formData.company_name} onChange={(e) => setFormData(prev => ({...prev, company_name: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person</label>
                  <input type="text" value={formData.contact_person} onChange={(e) => setFormData(prev => ({...prev, contact_person: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={formData.state} onChange={(e) => setFormData(prev => ({...prev, state: e.target.value}))}
                    placeholder="State" className="px-4 py-2 border rounded-lg" />
                  <input type="text" value={formData.zip} onChange={(e) => setFormData(prev => ({...prev, zip: e.target.value}))}
                    placeholder="ZIP" className="px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg">
                    <option value="chemicals">Chemicals</option>
                    <option value="equipment">Equipment</option>
                    <option value="ppe">PPE</option>
                    <option value="uniforms">Uniforms</option>
                    <option value="consumables">Consumables</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Terms</label>
                  <select value={formData.payment_terms} onChange={(e) => setFormData(prev => ({...prev, payment_terms: e.target.value}))}
                    className="w-full px-4 py-2 border rounded-lg">
                    <option value="net15">Net 15</option>
                    <option value="net30">Net 30</option>
                    <option value="net60">Net 60</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 rounded-xl">Cancel</button>
                <button type="submit"
                  className="px-6 py-3 bg-indigo-500 text-white rounded-xl">
                  {editingSupplier ? 'Update' : 'Add'} Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierManagement
