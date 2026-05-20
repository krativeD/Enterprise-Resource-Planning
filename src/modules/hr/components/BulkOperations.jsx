import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MdCloudUpload, MdCloudDownload, MdPrint, MdEmail,
  MdGroup, MdArchive, MdDelete, MdEdit,
  MdFileDownload, MdPictureAsPdf
} from 'react-icons/md'
import * as XLSX from 'xlsx'

const BulkOperations = ({ employees, selectedEmployees, onBulkUpdate }) => {
  const [showImport, setShowImport] = useState(false)
  const [importData, setImportData] = useState(null)
  const [importPreview, setImportPreview] = useState([])

  const handleExportExcel = () => {
    const dataToExport = selectedEmployees.length > 0 
      ? employees.filter(e => selectedEmployees.includes(e.id))
      : employees

    const exportData = dataToExport.map(emp => ({
      'Employee ID': emp.employee_id,
      'First Name': emp.first_name,
      'Last Name': emp.last_name,
      'Email': emp.email,
      'Position': emp.position,
      'Department': emp.department,
      'Status': emp.status,
      'Pay Type': emp.pay_type,
      'Hourly Amount': emp.hourly_amount,
      'Phone': emp.cell_phone
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Employees')
    XLSX.writeFile(wb, `employees_export_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleExportPDF = () => {
    // Implementation for PDF export
    console.log('Exporting PDF...')
  }

  const handleImportExcel = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      const wb = XLSX.read(event.target.result, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws)
      setImportPreview(data)
      setImportData(data)
    }
    reader.readAsBinaryString(file)
  }

  const handleBulkStatusUpdate = (newStatus) => {
    onBulkUpdate(selectedEmployees, { status: newStatus })
  }

  const handleBulkDepartmentUpdate = (newDepartment) => {
    onBulkUpdate(selectedEmployees, { department: newDepartment })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Bulk Operations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Export Operations */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
            <MdCloudDownload className="mr-2" /> Export
          </h4>
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportExcel}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                       transition-colors text-sm flex items-center justify-center space-x-2"
            >
              <MdFileDownload /> <span>Export Excel</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportPDF}
              className="w-full px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 
                       transition-colors text-sm flex items-center justify-center space-x-2"
            >
              <MdPictureAsPdf /> <span>Export PDF</span>
            </motion.button>
          </div>
        </div>

        {/* Import Operations */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
            <MdCloudUpload className="mr-2" /> Import
          </h4>
          <div className="space-y-2">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportExcel}
              className="hidden"
              id="importExcel"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('importExcel').click()}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors text-sm flex items-center justify-center space-x-2"
            >
              <MdCloudUpload /> <span>Import Excel</span>
            </motion.button>
            {importPreview.length > 0 && (
              <div className="text-sm text-green-700 bg-white rounded-lg p-2">
                {importPreview.length} records ready to import
              </div>
            )}
          </div>
        </div>

        {/* Bulk Update Operations */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
            <MdEdit className="mr-2" /> Bulk Update
          </h4>
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBulkStatusUpdate('Active')}
              disabled={selectedEmployees.length === 0}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                       transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set Status Active
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBulkStatusUpdate('On Leave')}
              disabled={selectedEmployees.length === 0}
              className="w-full px-4 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 
                       transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set Status On Leave
            </motion.button>
          </div>
        </div>

        {/* Mass Actions */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center">
            <MdGroup className="mr-2" /> Mass Actions
          </h4>
          <div className="space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {/* Archive confirmation */}}
              disabled={selectedEmployees.length === 0}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                       transition-colors text-sm flex items-center justify-center space-x-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdArchive /> <span>Archive Selected</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {/* Delete confirmation */}}
              disabled={selectedEmployees.length === 0}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                       transition-colors text-sm flex items-center justify-center space-x-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdDelete /> <span>Delete Selected</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Import Preview Modal */}
      {importPreview.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-3">Import Preview</h4>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {Object.keys(importPreview[0]).slice(0, 6).map(key => (
                    <th key={key} className="p-2 text-left">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importPreview.slice(0, 5).map((row, index) => (
                  <tr key={index} className="border-t">
                    {Object.values(row).slice(0, 6).map((val, i) => (
                      <td key={i} className="p-2">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setImportPreview([])}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Import {importPreview.length} Records
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BulkOperations
