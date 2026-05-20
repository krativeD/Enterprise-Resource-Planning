import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdSearch, MdFilterList, MdSort, MdMoreVert, MdEdit, 
  MdDelete, MdArchive, MdEmail, MdPhone, MdPrint,
  MdCloudDownload, MdCloudUpload, MdViewList, MdGridView,
  MdCheckCircle, MdCancel, MdWarning, MdPerson
} from 'react-icons/md'

const EmployeeList = ({ 
  employees, 
  selectedEmployee, 
  onSelect, 
  onEdit, 
  onDelete, 
  onArchive,
  loading 
}) => {
  const [viewMode, setViewMode] = useState('list') // list or grid
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    payType: 'all'
  })
  const [sortConfig, setSortConfig] = useState({ key: 'first_name', direction: 'asc' })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState([])

  // Get unique departments and positions for filters
  const departments = useMemo(() => 
    [...new Set(employees.map(emp => emp.department).filter(Boolean))],
    [employees]
  )
  
  const payTypes = useMemo(() => 
    [...new Set(employees.map(emp => emp.pay_type).filter(Boolean))],
    [employees]
  )

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let result = [...employees]

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(emp => 
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(search) ||
        emp.employee_id?.toLowerCase().includes(search) ||
        emp.email?.toLowerCase().includes(search) ||
        emp.position?.toLowerCase().includes(search)
      )
    }

    // Apply filters
    if (filters.status !== 'all') {
      result = result.filter(emp => emp.status === filters.status)
    }
    if (filters.department !== 'all') {
      result = result.filter(emp => emp.department === filters.department)
    }
    if (filters.payType !== 'all') {
      result = result.filter(emp => emp.pay_type === filters.payType)
    }

    // Apply sorting
    result.sort((a, b) => {
      const aVal = a[sortConfig.key]?.toLowerCase() || ''
      const bVal = b[sortConfig.key]?.toLowerCase() || ''
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [employees, searchTerm, filters, sortConfig])

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSelectAll = (checked) => {
    setSelectedEmployees(checked ? filteredEmployees.map(e => e.id) : [])
  }

  const handleSelectEmployee = (id, checked) => {
    setSelectedEmployees(prev => 
      checked ? [...prev, id] : prev.filter(eId => eId !== id)
    )
  }

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Inactive': 'bg-gray-100 text-gray-800 border-gray-200',
      'On Leave': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Terminated': 'bg-red-100 text-red-800 border-red-200',
      'Suspended': 'bg-orange-100 text-orange-800 border-orange-200'
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Employee Directory</h2>
            <p className="text-blue-100 text-sm">
              {filteredEmployees.length} of {employees.length} employees
              {selectedEmployees.length > 0 && ` • ${selectedEmployees.length} selected`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              title={`Switch to ${viewMode === 'list' ? 'Grid' : 'List'} View`}
            >
              {viewMode === 'list' ? <MdGridView className="text-xl" /> : <MdViewList className="text-xl" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <MdFilterList className="text-xl" />
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 text-xl" />
          <input
            type="text"
            placeholder="Search by name, ID, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-blue-300/30 rounded-xl 
                     text-white placeholder-blue-200 focus:outline-none focus:ring-2 
                     focus:ring-blue-400 focus:bg-white/20 transition-all"
          />
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b"
          >
            <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-4 gap-4">
              <FilterSelect 
                label="Status" 
                value={filters.status} 
                onChange={(v) => setFilters(prev => ({...prev, status: v}))}
                options={['all', 'Active', 'Inactive', 'On Leave', 'Terminated', 'Suspended']} 
              />
              <FilterSelect 
                label="Department" 
                value={filters.department} 
                onChange={(v) => setFilters(prev => ({...prev, department: v}))}
                options={['all', ...departments]} 
              />
              <FilterSelect 
                label="Pay Type" 
                value={filters.payType} 
                onChange={(v) => setFilters(prev => ({...prev, payType: v}))}
                options={['all', ...payTypes]} 
              />
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilters({ status: 'all', department: 'all', payType: 'all' })}
                  className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg 
                           text-gray-700 font-medium transition-colors"
                >
                  Clear Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee List/Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading employees...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="p-12 text-center">
          <MdPerson className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Employees Found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4">
                  <input 
                    type="checkbox" 
                    checked={selectedEmployees.length === filteredEmployees.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600 cursor-pointer" 
                    onClick={() => handleSort('employee_id')}>
                  ID {sortConfig.key === 'employee_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600 cursor-pointer"
                    onClick={() => handleSort('first_name')}>
                  Employee {sortConfig.key === 'first_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Position</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Department</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`border-b hover:bg-blue-50 transition-colors cursor-pointer
                    ${selectedEmployee?.id === emp.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                    ${selectedEmployees.includes(emp.id) ? 'bg-blue-50/50' : ''}`}
                  onClick={() => onSelect(emp)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={(e) => handleSelectEmployee(emp.id, e.target.checked)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4 text-sm font-mono text-gray-600">{emp.employee_id}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                                    flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(emp.first_name, emp.last_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {emp.first_name} {emp.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{emp.position}</td>
                  <td className="p-4 text-sm text-gray-600">{emp.department}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-blue-100 rounded transition-colors">
                        <MdEmail className="text-gray-400 hover:text-blue-500 text-lg" />
                      </button>
                      <button className="p-1 hover:bg-blue-100 rounded transition-colors">
                        <MdPhone className="text-gray-400 hover:text-green-500 text-lg" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(emp)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <MdEdit className="text-blue-500 text-lg" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onArchive(emp.id)}
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                      >
                        <MdArchive className="text-yellow-500 text-lg" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(emp.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <MdDelete className="text-red-500 text-lg" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp, index) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelect(emp)}
              className={`p-4 bg-white border-2 rounded-xl cursor-pointer transition-all
                ${selectedEmployee?.id === emp.id ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 
                              flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(emp.first_name, emp.last_name)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(emp.status)}`}>
                  {emp.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800">{emp.first_name} {emp.last_name}</h3>
              <p className="text-sm text-gray-500">{emp.position}</p>
              <p className="text-xs text-gray-400 mt-1">{emp.department}</p>
              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="text-xs text-gray-500">ID: {emp.employee_id}</span>
                <div className="flex space-x-1">
                  <MdEmail className="text-gray-400 text-sm" />
                  <MdPhone className="text-gray-400 text-sm" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bulk Actions */}
      {selectedEmployees.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-0 bg-white border-t shadow-lg p-4 flex items-center justify-between"
        >
          <p className="text-sm text-gray-600">
            {selectedEmployees.length} employee(s) selected
          </p>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                       transition-colors text-sm flex items-center space-x-2"
            >
              <MdCloudDownload /> <span>Export</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors text-sm flex items-center space-x-2"
            >
              <MdPrint /> <span>Print IDs</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedEmployees([])}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                       transition-colors text-sm"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt === 'all' ? `All ${label}s` : opt}
        </option>
      ))}
    </select>
  </div>
)

export default EmployeeList
