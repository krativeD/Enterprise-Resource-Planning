import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdPeople, MdBusiness, MdDescription, MdAttachMoney,
  MdAdd, MdSearch, MdFilterList, MdRefresh, MdStar,
  MdAssignment, MdReceipt, MdAssessment, MdChat,
  MdPhone, MdEmail, MdLocationOn, MdCalendarToday,
  MdCheckCircle, MdWarning, MdTimer, MdBuild,
  MdHome, MdApartment, MdStore, MdFactory,
  MdArrowForward, MdMoreVert, MdEdit, MdDelete,
  MdFileDownload, MdPrint, MdSend, MdRateReview,
  MdHandshake, MdTrendingUp, MdPersonAdd
} from 'react-icons/md'
import ClientList from '../components/ClientList'
import ClientForm from '../components/ClientForm'
import ClientDetails from '../components/ClientDetails'
import QuotationForm from '../components/QuotationForm'
import ContractForm from '../components/ContractForm'
import InvoiceGenerator from '../components/InvoiceGenerator'
import SLAManagement from '../components/SLAManagement'
import ClientFeedback from '../components/ClientFeedback'
import ClientCommunication from '../components/ClientCommunication'
import ClientStats from '../components/ClientStats'
import RecurringServices from '../components/RecurringServices'
import { useClientData } from '../hooks/useClientData'
import { useToast } from '../../../hooks/useToast'

const ClientManagement = () => {
  const [activeView, setActiveView] = useState('list')
  const [selectedClient, setSelectedClient] = useState(null)
  const [showClientForm, setShowClientForm] = useState(false)
  const [showQuotation, setShowQuotation] = useState(false)
  const [showContract, setShowContract] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)
  const [showSLA, setShowSLA] = useState(false)
  const [editing, setEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    contractStatus: 'all'
  })

  const {
    clients,
    loading,
    error,
    stats,
    createClient,
    updateClient,
    deleteClient,
    refreshClients
  } = useClientData()

  const { showToast } = useToast()

  const views = [
    { id: 'list', label: 'Clients', icon: MdPeople },
    { id: 'details', label: 'Details', icon: MdBusiness },
    { id: 'quotes', label: 'Quotations', icon: MdDescription },
    { id: 'contracts', label: 'Contracts', icon: MdAssignment },
    { id: 'invoices', label: 'Invoices', icon: MdReceipt },
    { id: 'communication', label: 'Communication', icon: MdChat }
  ]

  const handleCreateClient = async (clientData) => {
    try {
      const newClient = await createClient(clientData)
      showToast('Client created successfully', 'success')
      setShowClientForm(false)
      setSelectedClient(newClient)
      setActiveView('details')
    } catch (error) {
      showToast('Error creating client', 'error')
    }
  }

  const handleUpdateClient = async (id, clientData) => {
    try {
      await updateClient(id, clientData)
      showToast('Client updated successfully', 'success')
      setEditing(false)
    } catch (error) {
      showToast('Error updating client', 'error')
    }
  }

  const handleDeleteClient = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id)
        showToast('Client deleted', 'success')
        setSelectedClient(null)
        setActiveView('list')
      } catch (error) {
        showToast('Error deleting client', 'error')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <MdBusiness className="text-4xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Sales & Client Management</h1>
                <p className="text-blue-200 mt-1">
                  Manage clients, quotations, contracts, and invoicing
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedClient(null); setShowClientForm(true) }}
                className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 
                         transition-colors font-medium flex items-center space-x-2 shadow-lg"
              >
                <MdPersonAdd /> <span>Add Client</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* View Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {views.map((view) => {
              const Icon = view.icon
              return (
                <motion.button
                  key={view.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-t-xl transition-all whitespace-nowrap
                    ${activeView === view.id
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'bg-transparent text-blue-100 hover:bg-white/10'}`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden md:inline">{view.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-4">
        <ClientStats stats={stats} />
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search clients by name, company, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
              <option value="on_hold">On Hold</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">All Types</option>
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
              <option value="industrial">Industrial</option>
              <option value="government">Government</option>
            </select>
            <select
              value={filters.contractStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, contractStatus: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">All Contracts</option>
              <option value="active">Active Contracts</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="none">No Contract</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshClients}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                       transition-colors flex items-center space-x-2"
            >
              <MdRefresh className={loading ? 'animate-spin' : ''} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Client List Sidebar */}
          <div className="lg:col-span-1">
            <ClientList
              clients={clients}
              loading={loading}
              selectedClient={selectedClient}
              onSelect={(client) => {
                setSelectedClient(client)
                setActiveView('details')
              }}
              searchTerm={searchTerm}
              filters={filters}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {!selectedClient && activeView === 'list' && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-lg p-12 text-center"
                >
                  <MdPeople className="text-8xl text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                    Select a Client
                  </h2>
                  <p className="text-gray-500">
                    Choose a client from the list or create a new one
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowClientForm(true)}
                    className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                             transition-colors font-medium"
                  >
                    Create New Client
                  </motion.button>
                </motion.div>
              )}

              {selectedClient && activeView === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ClientDetails
                    client={selectedClient}
                    onEdit={() => {
                      setEditing(true)
                      setShowClientForm(true)
                    }}
                    onDelete={() => handleDeleteClient(selectedClient.id)}
                    onCreateQuote={() => setShowQuotation(true)}
                    onCreateContract={() => setShowContract(true)}
                    onGenerateInvoice={() => setShowInvoice(true)}
                    onManageSLA={() => setShowSLA(true)}
                    onUpdate={(data) => handleUpdateClient(selectedClient.id, data)}
                  />
                </motion.div>
              )}

              {activeView === 'quotes' && (
                <motion.div
                  key="quotes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <QuotationForm
                    client={selectedClient}
                    onSubmit={(data) => {
                      showToast('Quotation created!', 'success')
                      setShowQuotation(false)
                    }}
                    onCancel={() => setShowQuotation(false)}
                  />
                </motion.div>
              )}

              {activeView === 'contracts' && (
                <motion.div
                  key="contracts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ContractForm
                    client={selectedClient}
                    onSubmit={(data) => {
                      showToast('Contract created!', 'success')
                      setShowContract(false)
                    }}
                    onCancel={() => setShowContract(false)}
                  />
                </motion.div>
              )}

              {activeView === 'invoices' && (
                <motion.div
                  key="invoices"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <InvoiceGenerator
                    client={selectedClient}
                    onGenerate={(data) => {
                      showToast('Invoice generated!', 'success')
                      setShowInvoice(false)
                    }}
                    onCancel={() => setShowInvoice(false)}
                  />
                </motion.div>
              )}

              {activeView === 'communication' && (
                <motion.div
                  key="communication"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ClientCommunication client={selectedClient} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Client Form Modal */}
      <AnimatePresence>
        {showClientForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editing ? 'Edit Client' : 'New Client'}
                </h2>
                <button 
                  onClick={() => { setShowClientForm(false); setEditing(false) }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <ClientForm
                  client={editing ? selectedClient : null}
                  onSubmit={(data) => {
                    if (editing) {
                      handleUpdateClient(selectedClient.id, data)
                    } else {
                      handleCreateClient(data)
                    }
                  }}
                  onCancel={() => { setShowClientForm(false); setEditing(false) }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {showQuotation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Create Quotation</h2>
                <button onClick={() => setShowQuotation(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
              </div>
              <QuotationForm
                client={selectedClient}
                onSubmit={(data) => {
                  showToast('Quotation created!', 'success')
                  setShowQuotation(false)
                }}
                onCancel={() => setShowQuotation(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {showSLA && (
          <SLAManagement
            client={selectedClient}
            onClose={() => setShowSLA(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClientManagement
