import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MdEdit, MdDelete, MdPhone, MdEmail, MdLocationOn,
  MdBusiness, MdDescription, MdReceipt, MdStar,
  MdTrendingUp, MdWarning, MdCheckCircle, MdSchedule,
  MdAttachMoney, MdAssignment, MdRateReview
} from 'react-icons/md'

const ClientDetails = ({ client, onEdit, onDelete, onCreateQuote, onCreateContract, onGenerateInvoice, onManageSLA, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: MdBusiness },
    { id: 'services', label: 'Services', icon: MdSchedule },
    { id: 'quotes', label: 'Quotations', icon: MdDescription },
    { id: 'contracts', label: 'Contracts', icon: MdAssignment },
    { id: 'invoices', label: 'Invoices', icon: MdReceipt },
    { id: 'feedback', label: 'Feedback', icon: MdRateReview }
  ]

  const recentQuotes = [
    { id: 'Q-2024-001', date: '2024-03-15', amount: 5200, status: 'approved' },
    { id: 'Q-2024-002', date: '2024-03-10', amount: 3800, status: 'pending' }
  ]

  const activeContracts = [
    { id: 'C-2024-001', type: 'Office Cleaning', start: '2024-01-01', end: '2024-12-31', value: 48000 },
    { id: 'C-2024-002', type: 'Deep Cleaning', start: '2024-03-01', end: '2025-02-28', value: 24000 }
  ]

  const recentInvoices = [
    { id: 'INV-2024-089', date: '2024-03-15', amount: 5200, status: 'paid' },
    { id: 'INV-2024-076', date: '2024-02-28', amount: 3800, status: 'pending' },
    { id: 'INV-2024-064', date: '2024-02-15', amount: 4200, status: 'overdue' }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Client Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold">{client.company_name?.[0]}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{client.company_name}</h2>
              <p className="text-blue-100 mt-1">{client.client_type?.toUpperCase()}</p>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium
                  ${client.status === 'active' ? 'bg-green-500' :
                    client.status === 'prospect' ? 'bg-yellow-500' : 'bg-gray-500'}`}>
                  {client.status?.toUpperCase()}
                </span>
                {client.contract_active && (
                  <span className="px-3 py-1 bg-blue-400 rounded-full text-xs font-medium">
                    CONTRACT ACTIVE
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={onEdit} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
              <MdEdit className="text-xl" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={onDelete} className="p-2 bg-white/20 rounded-lg hover:bg-red-500/30">
              <MdDelete className="text-xl" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-b px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionButton icon={MdDescription} label="Create Quote" onClick={onCreateQuote} />
          <QuickActionButton icon={MdAssignment} label="New Contract" onClick={onCreateContract} />
          <QuickActionButton icon={MdReceipt} label="Generate Invoice" onClick={onGenerateInvoice} />
          <QuickActionButton icon={MdRateReview} label="Manage SLA" onClick={onManageSLA} />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-6">
        <div className="flex space-x-4 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <tab.icon className="text-lg" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard title="Contact Information" icon={MdPhone}>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Name:</span> {client.contact_first_name} {client.contact_last_name}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {client.contact_email}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {client.contact_phone}</p>
                  <p className="text-sm"><span className="font-medium">Position:</span> {client.contact_position}</p>
                </div>
              </InfoCard>
              <InfoCard title="Address" icon={MdLocationOn}>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Billing:</p>
                  <p className="text-sm">{client.billing_address}</p>
                  <p className="text-sm">{client.billing_city}, {client.billing_state} {client.billing_zip}</p>
                  <p className="text-sm font-medium text-gray-500 mt-2">Service:</p>
                  <p className="text-sm">{client.service_address}</p>
                  <p className="text-sm">{client.service_city}, {client.service_state} {client.service_zip}</p>
                </div>
              </InfoCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="Total Revenue" value="$85,400" icon={MdAttachMoney} color="text-green-600" />
              <StatCard title="Active Contracts" value="2" icon={MdAssignment} color="text-blue-600" />
              <StatCard title="Customer Since" value="Jan 2024" icon={MdStar} color="text-purple-600" />
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">Invoice #</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((inv, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{inv.id}</td>
                      <td className="p-3 text-sm">{inv.date}</td>
                      <td className="p-3 text-right">${inv.amount.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                            inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button className="text-blue-500 hover:text-blue-700">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const QuickActionButton = ({ icon: Icon, label, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-gray-200 
             rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-medium"
  >
    <Icon className="text-blue-500" />
    <span>{label}</span>
  </motion.button>
)

const InfoCard = ({ title, icon: Icon, children }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
      <Icon className="mr-2 text-blue-500" /> {title}
    </h4>
    {children}
  </div>
)

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm text-gray-600">{title}</p>
      <Icon className={`text-xl ${color}`} />
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
)

export default ClientDetails
