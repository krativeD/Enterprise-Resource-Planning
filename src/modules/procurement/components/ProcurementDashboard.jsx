import React from 'react'
import { motion } from 'framer-motion'
import { MdShoppingCart, MdBusiness, MdReceipt, MdLocalShipping, MdAttachMoney, MdPending } from 'react-icons/md'

const ProcurementDashboard = ({ stats, loading }) => {
  const kpis = [
    { label: 'Purchase Requests', value: stats?.totalRequests || 0, icon: MdShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Approvals', value: stats?.pendingApprovals || 0, icon: MdPending, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Active Orders', value: stats?.activeOrders || 0, icon: MdReceipt, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Suppliers', value: stats?.totalSuppliers || 0, icon: MdBusiness, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending Deliveries', value: stats?.pendingDeliveries || 0, icon: MdLocalShipping, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Total Spent', value: `$${(stats?.totalSpent || 0).toLocaleString()}`, icon: MdAttachMoney, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className={`w-10 h-10 ${kpi.bg} rounded-lg flex items-center justify-center mb-3`}>
              <kpi.icon className={`text-xl ${kpi.color}`} />
            </div>
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Workflow Visualization */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Procurement Workflow</h3>
        <div className="flex items-center justify-between">
          {['Purchase Request', 'Approval', 'Purchase Order', 'Delivery', 'Invoice', 'Payment'].map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  {i + 1}
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">{step}</p>
              </div>
              {i < 5 && <div className="flex-1 h-1 bg-indigo-200 mx-2"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProcurementDashboard
