import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdSearch, MdPersonAdd, MdArchive, MdBadge, MdUpload, MdDelete,
  MdEdit, MdSave, MdCancel, MdChevronLeft, MdChevronRight,
  MdFileDownload, MdPrint, MdEmail, MdPhone, MdLocationOn,
  MdWork, MdCalendarToday, MdAttachMoney, MdAccessTime,
  MdEvent, MdBeachAccess, MdDescription, MdImage
} from 'react-icons/md'
import { supabase } from '../../../services/supabase'
import EmployeeForm from '../components/EmployeeForm'
import EmployeeTabs from '../components/EmployeeTabs'
import AttachmentsPanel from '../components/AttachmentsPanel'
import TimeClockHistory from '../components/TimeClockHistory'
import PayrollHistory from '../components/PayrollHistory'
import PayrollDetails from '../components/PayrollDetails'
import SchedulingPanel from '../components/SchedulingPanel'
import LeaveManagement from '../components/LeaveManagement'
import EventsPanel from '../components/EventsPanel'
import IDCardGenerator from '../components/IDCardGenerator'
import { useEmployeeData } from '../hooks/useEmployeeData'
import { useToast } from '../../../hooks/useToast'

const EmployeeManager = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [activeTab, setActiveTab] = useState('general')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [showIDCard, setShowIDCard] = useState(false)
  const [editing, setEditing] = useState(false)
  const [employeeImage, setEmployeeImage] = useState(null)
  const { employees, loading, error, addEmployee, updateEmployee, archiveEmployee } = useEmployeeData()
  const { showToast } = useToast()

  const tabs = [
    { id: 'general', label: 'General Info', icon: MdPerson },
    { id: 'timeclock', label: 'Time Clock History', icon: MdAccessTime },
    { id: 'payrollHistory', label: 'Payroll History', icon: MdAttachMoney },
    { id: 'payrollDetails', label: 'Payroll & Details', icon: MdDescription },
    { id: 'scheduling', label: 'Scheduling', icon: MdCalendarToday },
    { id: 'leave', label: 'Leave', icon: MdBeachAccess },
    { id: 'events', label: 'Events', icon: MdEvent }
  ]

  const filteredEmployees = employees.filter(emp => 
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setEmployeeImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (employeeData) => {
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, employeeData)
        showToast('Employee updated successfully', 'success')
      } else {
        await addEmployee(employeeData)
        showToast('Employee added successfully', 'success')
      }
      setEditing(false)
      setShowAddForm(false)
    } catch (error) {
      showToast('Error saving employee', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MdPeople className="text-5xl" />
              <div>
                <h1 className="text-4xl font-bold tracking-wider">EMPLOYEE MANAGER</h1>
                <p className="text-blue-200 mt-1">Complete HR & Payroll Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-blue-300/30 
                           text-white placeholder-blue-200 focus:outline-none focus:ring-2 
                           focus:ring-blue-400 w-80"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowAddForm(true); setSelectedEmployee(null); setEditing(true) }}
                className="btn bg-green-500 hover:bg-green-600"
              >
                <MdPersonAdd className="mr-2" /> Add New
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowArchive(!showArchive)}
                className="btn bg-orange-500 hover:bg-orange-600"
              >
                <MdArchive className="mr-2" /> Archive
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowIDCard(true)}
                className="btn bg-purple-500 hover:bg-purple-600"
              >
                <MdBadge className="mr-2" /> ID Cards
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Employee List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                <h2 className="font-semibold text-lg">
                  {showArchive ? 'Archived Employees' : 'Active Employees'}
                </h2>
                <p className="text-blue-100 text-sm">{filteredEmployees.length} employees</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No employees found</div>
                ) : (
                  filteredEmployees.map((emp, index) => (
                    <motion.div
                      key={emp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedEmployee(emp)}
                      className={`p-4 cursor-pointer border-b hover:bg-blue-50 transition-colors
                        ${selectedEmployee?.id === emp.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={emp.image_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
                          className="w-10 h-10 rounded-full object-cover"
                          alt={emp.first_name}
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {emp.first_name} {emp.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{emp.position}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Employee Details */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selectedEmployee || editing ? (
                <motion.div
                  key={selectedEmployee?.id || 'new'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Tabs */}
                  <div className="border-b">
                    <EmployeeTabs 
                      tabs={tabs} 
                      activeTab={activeTab} 
                      setActiveTab={setActiveTab} 
                    />
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'general' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <EmployeeForm
                            employee={selectedEmployee}
                            editing={editing}
                            setEditing={setEditing}
                            onSave={handleSave}
                          />
                          <AttachmentsPanel employeeId={selectedEmployee?.id} />
                        </div>
                        <div className="md:col-span-1">
                          <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 
                                        rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                              <img 
                                src={employeeImage || selectedEmployee?.image_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                                className="w-full h-full object-cover"
                                alt="Employee"
                              />
                            </div>
                            <input 
                              type="file" 
                              id="imageUpload" 
                              className="hidden" 
                              onChange={handleImageUpload}
                              accept="image/*"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => document.getElementById('imageUpload').click()}
                              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 
                                       transition-colors w-full"
                            >
                              <MdUpload className="inline mr-2" /> Add Picture
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'timeclock' && (
                      <TimeClockHistory employeeId={selectedEmployee?.id} />
                    )}

                    {activeTab === 'payrollHistory' && (
                      <PayrollHistory employeeId={selectedEmployee?.id} />
                    )}

                    {activeTab === 'payrollDetails' && (
                      <PayrollDetails employee={selectedEmployee} />
                    )}

                    {activeTab === 'scheduling' && (
                      <SchedulingPanel employeeId={selectedEmployee?.id} />
                    )}

                    {activeTab === 'leave' && (
                      <LeaveManagement employeeId={selectedEmployee?.id} />
                    )}

                    {activeTab === 'events' && (
                      <EventsPanel employeeId={selectedEmployee?.id} />
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-lg p-12 text-center"
                >
                  <MdPeople className="text-8xl text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                    Select an Employee
                  </h2>
                  <p className="text-gray-500">
                    Choose an employee from the list to view their details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ID Card Generator Modal */}
      {showIDCard && (
        <IDCardGenerator 
          employee={selectedEmployee}
          onClose={() => setShowIDCard(false)}
        />
      )}
    </div>
  )
}

export default EmployeeManager
