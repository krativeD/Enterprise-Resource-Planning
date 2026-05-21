import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdRefresh, MdAdd, MdEdit, MdDelete, MdSchedule } from 'react-icons/md'

const RecurringServices = ({ client }) => {
  const [services, setServices] = useState([
    { id: 1, service: 'Office Cleaning', frequency: 'Daily', nextDate: '2024-03-22', status: 'active', price: 150 },
    { id: 2, service: 'Window Cleaning', frequency: 'Monthly', nextDate: '2024-04-01', status: 'active', price: 200 },
    { id: 3, service: 'Carpet Cleaning', frequency: 'Quarterly', nextDate: '2024-06-15', status: 'active', price: 350 },
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MdRefresh className="mr-2 text-blue-500" /> Recurring Services
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm flex items-center space-x-1"
        >
          <MdAdd /> <span>Add Service</span>
        </motion.button>
      </div>

      <div className="grid gap-3">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MdSchedule className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{service.service}</p>
                  <p className="text-sm text-gray-500">
                    {service.frequency} • Next: {service.nextDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-blue-600">${service.price}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.status}
                </span>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-500">
                    <MdEdit className="text-sm" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-500">
                    <MdDelete className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <MdRefresh className="text-4xl mx-auto mb-2" />
          <p>No recurring services set up</p>
        </div>
      )}
    </div>
  )
}

export default RecurringServices
