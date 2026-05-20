import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MdDashboard, MdPeople, MdWork, MdAttachMoney, MdShoppingCart,
  MdInventory, MdBuild, MdLocalShipping, MdAssessment, MdSettings
} from 'react-icons/md'

const menuItems = [
  { icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MdPeople, label: 'HR & Payroll', path: '/hr' },
  { icon: MdWork, label: 'Job Scheduling', path: '/jobs' },
  { icon: MdPeople, label: 'Clients', path: '/clients' },
  { icon: MdAttachMoney, label: 'Finance', path: '/finance' },
  { icon: MdShoppingCart, label: 'Procurement', path: '/procurement' },
  { icon: MdInventory, label: 'Inventory', path: '/inventory' },
  { icon: MdBuild, label: 'Assets', path: '/assets' },
  { icon: MdLocalShipping, label: 'Fleet', path: '/fleet' },
  { icon: MdAssessment, label: 'Reports', path: '/reports' },
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          NDANDULENI
        </h1>
        <p className="text-xs text-gray-400 mt-1">Cleaning ERP System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <Icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-0 w-1 h-8 bg-blue-400 rounded-l-full"
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold">SA</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Super Admin</p>
            <p className="text-xs text-gray-400">admin@ndanduleni.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
