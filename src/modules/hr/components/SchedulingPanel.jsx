import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdCalendarToday, MdSchedule, MdEdit } from 'react-icons/md'

const SchedulingPanel = ({ employeeId }) => {
  const [weekSchedule] = useState({
    Monday: { shift: 'Morning', hours: '08:00 - 17:00', status: 'Working' },
    Tuesday: { shift: 'Morning', hours: '08:00 - 17:00', status: 'Working' },
    Wednesday: { shift: 'Morning', hours: '08:00 - 17:00', status: 'Working' },
    Thursday: { shift: 'Morning', hours: '08:00 - 17:00', status: 'Working' },
    Friday: { shift: 'Morning', hours: '08:00 - 16:00', status: 'Working' },
    Saturday: { shift: 'Off', hours: '--', status: 'Off Day' },
    Sunday: { shift: 'Off', hours: '--', status: 'Off Day' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Weekly Schedule</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <MdEdit /> <span>Edit Schedule</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {Object.entries(weekSchedule).map(([day, schedule], index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border-2 text-center
              ${schedule.status === 'Working' 
                ? 'border-blue-200 bg-blue-50' 
                : 'border-gray-200 bg-gray-50'}`}
          >
            <p className="text-sm font-semibold text-gray-800 mb-2">{day}</p>
            <p className="text-xs text-gray-600 mb-1">{schedule.shift}</p>
            <p className="text-xs text-gray-500">{schedule.hours}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
              schedule.status === 'Working' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {schedule.status}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Schedule Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Working Days</p>
            <p className="text-xl font-bold text-blue-600">5</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Hours</p>
            <p className="text-xl font-bold text-green-600">40h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Off Days</p>
            <p className="text-xl font-bold text-purple-600">2</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchedulingPanel
