import React from 'react'
import { motion } from 'framer-motion'
import { MdBusiness, MdStar } from 'react-icons/md'

const ClientList = ({ clients, loading, selectedClient, onSelect, searchTerm, filters }) => {
  const filteredClients = clients.filter(client => {
    if (searchTerm && !client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !client.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (filters.status !== 'all' && client.status !== filters.status) return false
    if (filters.type !== 'all' && client.client_type !== filters.type) return false
    return true
  })

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse p-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <p className="font-semibold text-gray-800">
          {filteredClients.length} Clients
        </p>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredClients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => onSelect(client)}
            className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors
              ${selectedClient?.id === client.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <MdBusiness className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{client.company_name}</p>
                <p className="text-xs text-gray-500">{client.contact_email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                client.status === 'active' ? 'bg-green-100 text-green-800' :
                client.status === 'prospect' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {client.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ClientList
