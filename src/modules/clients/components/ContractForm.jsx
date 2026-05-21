import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSave } from 'react-icons/md'

const ContractForm = ({ client, onSubmit, onCancel }) => {
  const [contract, setContract] = useState({
    contract_number: `C-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    client_name: client?.company_name || '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    service_type: 'Office Cleaning',
    frequency: 'Weekly',
    contract_value: 0,
    sla_terms: 'Standard SLA applies',
    status: 'draft'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(contract)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Contract</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Contract #</label>
          <input type="text" value={contract.contract_number} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Client</label>
          <input type="text" value={contract.client_name} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" value={contract.start_date}
              onChange={(e) => setContract(prev => ({...prev, start_date: e.target.value}))}
              className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input type="date" value={contract.end_date}
              onChange={(e) => setContract(prev => ({...prev, end_date: e.target.value}))}
              className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contract Value ($)</label>
          <input type="number" value={contract.contract_value}
            onChange={(e) => setContract(prev => ({...prev, contract_value: parseFloat(e.target.value) || 0}))}
            className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button type="button" onClick={onCancel} className="px-6 py-3 bg-gray-200 rounded-lg">Cancel</button>
          <motion.button type="submit" whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center space-x-2">
            <MdSave /> <span>Create Contract</span>
          </motion.button>
        </div>
      </form>
    </div>
  )
}

export default ContractForm
