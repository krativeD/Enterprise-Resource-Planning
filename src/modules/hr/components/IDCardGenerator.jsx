import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { MdClose, MdPrint, MdDownload } from 'react-icons/md'
import html2canvas from 'html2canvas'

const IDCardGenerator = ({ employee, onClose }) => {
  const cardRef = useRef(null)

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current)
      const link = document.createElement('a')
      link.download = `ID_Card_${employee?.first_name}_${employee?.last_name}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const handlePrint = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current)
      const win = window.open()
      win.document.write(`<img src="${canvas.toDataURL()}"/>`)
      win.print()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Employee ID Card</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose className="text-2xl" />
          </motion.button>
        </div>

        {/* ID Card Preview */}
        <div ref={cardRef} className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-xl mb-6">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src={employee?.image_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                  className="w-full h-full object-cover"
                  alt="Employee"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">
                  {employee?.first_name} {employee?.last_name}
                </h3>
                <p className="text-lg text-blue-600 font-semibold">{employee?.position}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">ID: {employee?.employee_id}</p>
                  <p className="text-sm text-gray-600">Department: {employee?.department}</p>
                  <p className="text-sm text-gray-600">Phone: {employee?.cell_phone}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500">NDANDULENI CLEANING SERVICES</p>
              <p className="text-xs text-gray-400">This card is property of Ndanduleni Cleaning</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 
                     transition-colors flex items-center justify-center space-x-2"
          >
            <MdDownload /> <span>Download</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 
                     transition-colors flex items-center justify-center space-x-2"
          >
            <MdPrint /> <span>Print</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default IDCardGenerator
