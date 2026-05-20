import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdAccessTime, MdCheckCircle, MdCancel, MdWarning } from 'react-icons/md'

const TimeClockHistory = ({ employeeId }) => {
  const [timeRecords, setTimeRecords] = useState([
    { id: 1, date: '2024-03-01', clockIn: '08:00 AM', clockOut: '05:00 PM', hours: 8.5, status: 'Present' },
    { id: 2, date: '2024-03-02', clockIn: '08:15 AM', clockOut: '05:10 PM', hours: 8.9, status: 'Present' },
    { id: 3, date: '2024-03-03', clockIn: '08:00 AM', clockOut: '04:45 PM', hours: 8.75, status: 'Present' },
    { id: 4, date: '2024-03-04', clockIn: '09:00 AM', clockOut: '05:00 PM', hours: 8.0, status: 'Late' },
    { id: 5, date: '2024-03-05', clockIn: '--', clockOut: '--', hours: 0, status: 'Absent' },
  ])

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Present': return <MdCheckCircle className="text-green-500" />
      case 'Late': return <MdWarning className="text-yellow-500" />
      case 'Absent': return <MdCancel className="text-red-500" />
      default: return null
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Time Clock History</h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg">
            <option>March 2024</option>
            <option>February 2024</option>
            <option>January 2024</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Clock In</th>
              <th className="text-left p-3">Clock Out</th>
              <th className="text-left p-3">Hours</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {timeRecords.map((record, index) => (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">{record.date}</td>
                <td className="p-3">{record.clockIn}</td>
                <td className="p-3">{record.clockOut}</td>
                <td className="p-3">{record.hours}h</td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(record.status)}
                    <span className={`text-sm ${
                      record.status === 'Present' ? 'text-green-600' :
                      record.status === 'Late' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Hours</p>
            <p className="text-2xl font-bold text-blue-600">34.15h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overtime</p>
            <p className="text-2xl font-bold text-green-600">4.15h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Attendance Rate</p>
            <p className="text-2xl font-bold text-purple-600">95%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeClockHistory
