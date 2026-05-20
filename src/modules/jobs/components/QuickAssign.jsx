import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdClose, MdPerson, MdCheckCircle, MdStar, MdSearch } from 'react-icons/md'

const QuickAssign = ({ job, onAssign, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCleaners, setSelectedCleaners] = useState([])
  const [availableCleaners] = useState([
    { id: 1, name: 'Sarah Johnson', rating: 4.8, status: 'available', zone: 'A' },
    { id: 2, name: 'Mike Ndlovu', rating: 4.5, status: 'available', zone: 'B' },
    { id: 3, name: 'Peter Mabaso', rating: 4.9, status: 'available', zone: 'A' },
    { id: 4, name: 'Lindiwe Zulu', rating: 4.7, status: 'busy', zone: 'C' },
    { id: 5, name: 'Thabo Molefe', rating: 4.6, status: 'available', zone: 'A' },
    { id: 6, name: 'Grace Khumalo', rating: 4.3, status: 'available', zone: 'B' },
  ])

  const toggleCleaner = (cleanerId) => {
    setSelectedCleaners(prev =>
      prev.includes(cleanerId)
        ? prev.filter(id => id !== cleanerId)
        : [...prev, cleanerId]
    )
  }

  const filteredCleaners = availableCleaners.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    c.status === 'available'
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Assign Cleaners</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <MdClose className="text-2xl" />
            </button>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-blue-800">{job.client_name}</p>
            <p className="text-xs text-blue-600">{job.address}</p>
            <p className="text-xs text-blue-600 mt-1">
              {job.scheduled_time} • {job.estimated_duration}h • {job.team_size} cleaners needed
            </p>
          </div>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cleaners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-4 space-y-2">
          {filteredCleaners.map(cleaner => (
            <motion.div
              key={cleaner.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => toggleCleaner(cleaner.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border
                ${selectedCleaners.includes(cleaner.id)
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-gray-200 hover:border-blue-300'}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
                            flex items-center justify-center text-white font-bold">
                  {cleaner.name[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{cleaner.name}</p>
                  <div className="flex items-center text-sm">
                    <MdStar className="text-yellow-500 mr-1" />
                    <span>{cleaner.rating}</span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-500">Zone {cleaner.zone}</span>
                  </div>
                </div>
              </div>
              {selectedCleaners.includes(cleaner.id) && (
                <MdCheckCircle className="text-blue-500 text-xl" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {selectedCleaners.length} of {job.team_size} cleaners selected
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAssign(selectedCleaners)}
            disabled={selectedCleaners.length === 0}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium
                     hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign {selectedCleaners.length} Cleaner(s)
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default QuickAssign
