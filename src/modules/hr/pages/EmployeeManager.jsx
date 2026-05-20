import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdPeople, MdAttachMoney, MdAssessment, MdSettings,
  MdDashboard, MdList, MdGroup
} from 'react-icons/md'
import EmployeeList from '../components/EmployeeList'
import EmployeeForm from '../components/EmployeeForm'
import PayrollProcessor from '../components/PayrollProcessor'
import AdvancedReports from '../components/AdvancedReports'
import BulkOperations from '../components/BulkOperations'
import { useEmployeeData } from '../hooks/useEmployeeData'
import { useToast } from '../../../hooks/useToast'

const EmployeeManager = () => {
  const [activeModule, setActiveModule] = useState('directory')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [editing, setEditing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { employees, loading, addEmployee, updateEmployee, archiveEmployee, deleteEmployee } = useEmployeeData()
  const { showToast } = useToast()

  const modules = [
    { id: 'directory', label: 'Employee Directory', icon: MdList },
    { id: 'payroll', label: 'Payroll Processing', icon: MdAttachMoney },
    { id: 'reports', label: 'Reports & Analytics', icon: MdAssessment },
    { id: 'bulk', label: 'Bulk Operations', icon: MdGroup },
  ]

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, employeeData)
        showToast('Employee updated successfully', 'success')
      } else {
        await addEmployee(employeeData)
        showToast('Employee added successfully', 'success')
      }
      setEditing(false)
      setShowForm(false)
      setSelectedEmployee(null)
    } catch (error) {
      showToast('Error saving employee', 'error')
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
                <MdPeople className="text-4xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">HR & Payroll Management</h1>
                <p className="text-blue-200 mt-1">Complete employee lifecycle management system</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowForm(true); setSelectedEmployee(null); setEditing(true) }}
                className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 
                         transition-colors font-medium flex items-center space-x-2 shadow-lg"
              >
                <MdPeople /> <span>Add Employee</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {modules.map((module) => {
              const Icon = module.icon
              return (
                <motion.button
                  key={module.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModule(module.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-t-xl transition-all
                    ${activeModule === module.id 
                      ? 'bg-white text-blue-600 font-semibold' 
                      : 'bg-transparent text-blue-100 hover:bg-white/10'}`}
                >
                  <Icon className="text-lg" />
                  <span>{module.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeModule === 'directory' && (
            <motion.div
              key="directory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2">
                <EmployeeList
                  employees={employees}
                  selectedEmployee={selectedEmployee}
                  onSelect={setSelectedEmployee}
                  onEdit={(emp) => { setSelectedEmployee(emp); setEditing(true) }}
                  onArchive={archiveEmployee}
                  onDelete={deleteEmployee}
                  loading={loading}
                />
              </div>
              <div>
                <BulkOperations
                  employees={employees}
                  selectedEmployees={[]}
                  onBulkUpdate={() => {}}
                />
              </div>
            </motion.div>
          )}

          {activeModule === 'payroll' && (
            <motion.div
              key="payroll"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PayrollProcessor />
            </motion.div>
          )}

          {activeModule === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdvancedReports />
            </motion.div>
          )}

          {activeModule === 'bulk' && (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BulkOperations
                employees={employees}
                selectedEmployees={[]}
                onBulkUpdate={() => {}}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Employee Edit Modal */}
      <AnimatePresence>
        {editing && (
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
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setEditing(false); setSelectedEmployee(null) }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-6">
                <EmployeeForm
                  employee={selectedEmployee}
                  editing={editing}
                  onSave={handleSaveEmployee}
                  onCancel={() => { setEditing(false); setSelectedEmployee(null) }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmployeeManager
