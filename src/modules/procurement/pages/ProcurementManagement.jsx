import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdShoppingCart, MdLocalShipping, MdBusiness, MdDescription,
  MdAdd, MdSearch, MdFilterList, MdRefresh, MdAssessment,
  MdCheckCircle, MdWarning, MdSchedule, MdBuild,
  MdAttachMoney, MdReceipt, MdAssignment, MdPerson,
  MdInventory, MdTimer, MdStar, MdTrendingUp,
  MdArrowForward, MdMoreVert, MdEdit, MdDelete,
  MdFileDownload, MdPrint, MdSend, MdEmail,
  MdFactCheck, MdApproval, MdCancel, MdThumbUp,
  MdLocalOffer, MdStore, MdWarehouse
} from 'react-icons/md'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import PurchaseRequests from '../components/PurchaseRequests'
import SupplierManagement from '../components/SupplierManagement'
import PurchaseOrders from '../components/PurchaseOrders'
import ApprovalWorkflow from '../components/ApprovalWorkflow'
import DeliveryTracking from '../components/DeliveryTracking'
import SupplierInvoices from '../components/SupplierInvoices'
import ProcurementDashboard from '../components/ProcurementDashboard'
import RFQManagement from '../components/RFQManagement'
import { useProcurementData } from '../hooks/useProcurementData'
import { useToast } from '../../../hooks/useToast'

const ProcurementManagement = () => {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  })

  const {
    purchaseRequests,
    suppliers,
    purchaseOrders,
    deliveries,
    supplierInvoices,
    loading,
    error,
    stats,
    createPurchaseRequest,
    updatePurchaseRequest,
    deletePurchaseRequest,
    createPurchaseOrder,
    updatePurchaseOrder,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    recordDelivery,
    recordSupplierInvoice,
    refreshData
  } = useProcurementData()

  const { showToast } = useToast()

  const modules = [
    { id: 'dashboard', label: 'Dashboard', icon: MdAssessment },
    { id: 'requests', label: 'Purchase Requests', icon: MdShoppingCart },
    { id: 'suppliers', label: 'Suppliers', icon: MdBusiness },
    { id: 'orders', label: 'Purchase Orders', icon: MdReceipt },
    { id: 'approvals', label: 'Approvals', icon: MdFactCheck },
    { id: 'deliveries', label: 'Deliveries', icon: MdLocalShipping },
    { id: 'invoices', label: 'Supplier Invoices', icon: MdAttachMoney },
    { id: 'rfq', label: 'RFQs', icon: MdLocalOffer }
  ]

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(refreshData, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleCreatePR = async (data) => {
    try {
      await createPurchaseRequest(data)
      showToast('Purchase request created successfully', 'success')
    } catch (error) {
      showToast('Error creating purchase request', 'error')
    }
  }

  const handleApprovePR = async (id) => {
    try {
      await updatePurchaseRequest(id, { status: 'approved', approved_at: new Date() })
      showToast('Purchase request approved', 'success')
    } catch (error) {
      showToast('Error approving request', 'error')
    }
  }

  const handleCreatePO = async (data) => {
    try {
      const po = await createPurchaseOrder(data)
      showToast('Purchase order created successfully', 'success')
      return po
    } catch (error) {
      showToast('Error creating purchase order', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <MdShoppingCart className="text-4xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Procurement Management</h1>
                <p className="text-indigo-200 mt-1">
                  Supplier management, purchase orders, and procurement workflow
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveModule('requests')}
                className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 flex items-center space-x-2"
              >
                <MdAdd /> <span>New Request</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20"
              >
                <MdRefresh className={loading ? 'animate-spin' : ''} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <motion.button
                  key={mod.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModule(mod.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-t-xl transition-all whitespace-nowrap
                    ${activeModule === mod.id
                      ? 'bg-white text-indigo-600 font-semibold'
                      : 'bg-transparent text-indigo-100 hover:bg-white/10'}`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden md:inline">{mod.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search by supplier, item, PO number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">All Categories</option>
              <option value="chemicals">Chemicals</option>
              <option value="equipment">Equipment</option>
              <option value="ppe">PPE</option>
              <option value="uniforms">Uniforms</option>
              <option value="consumables">Consumables</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <AnimatePresence mode="wait">
          {activeModule === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ProcurementDashboard stats={stats} loading={loading} />
            </motion.div>
          )}

          {activeModule === 'requests' && (
            <motion.div key="requests" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PurchaseRequests
                requests={purchaseRequests}
                onCreate={handleCreatePR}
                onApprove={handleApprovePR}
                onDelete={deletePurchaseRequest}
                searchTerm={searchTerm}
                filters={filters}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'suppliers' && (
            <motion.div key="suppliers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <SupplierManagement
                suppliers={suppliers}
                onAdd={addSupplier}
                onUpdate={updateSupplier}
                onDelete={deleteSupplier}
                searchTerm={searchTerm}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PurchaseOrders
                orders={purchaseOrders}
                onCreate={handleCreatePO}
                onUpdate={updatePurchaseOrder}
                suppliers={suppliers}
                requests={purchaseRequests}
                searchTerm={searchTerm}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'approvals' && (
            <motion.div key="approvals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ApprovalWorkflow
                requests={purchaseRequests}
                onApprove={handleApprovePR}
                onReject={(id, reason) => updatePurchaseRequest(id, { status: 'rejected', rejection_reason: reason })}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'deliveries' && (
            <motion.div key="deliveries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <DeliveryTracking
                deliveries={deliveries}
                orders={purchaseOrders}
                onRecordDelivery={recordDelivery}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'invoices' && (
            <motion.div key="invoices" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <SupplierInvoices
                invoices={supplierInvoices}
                onRecord={recordSupplierInvoice}
                orders={purchaseOrders}
                loading={loading}
              />
            </motion.div>
          )}

          {activeModule === 'rfq' && (
            <motion.div key="rfq" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <RFQManagement
                suppliers={suppliers}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProcurementManagement
