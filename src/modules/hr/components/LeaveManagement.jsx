import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdBeachAccess, MdSick, MdFlight } from 'react-icons/md'

const LeaveManagement = ({ employeeId }) => {
  const [leaveBalance] = useState({
    pto: { total: 20, used: 5, remaining: 15 },
    sick: { total: 10, used: 2, remaining: 8 },
    vacation: { total: 15, used: 3, remaining: 12 }
  })

  const [leaveHistory] = useState([
    { id: 1, type: 'PTO', date: '2024-03-10', days: 1, status: 'Approved', reason: 'Personal' },
    { id: 2, type: 'Sick', date: '2024-02-15', days: 2, status: 'Approved', reason: 'Illness' },
    { id: 3, type: 'Vacation', date: '2024-01-20', days: 3, status: 'Approved', reason: 'Family trip' },
  ])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LeaveCard
          icon={MdBeachAccess}
          title="Paid Time Off"
          total={leaveBalance.pto.total}
          used={leaveBalance.pto.used}
          remaining={leaveBalance.pto.remaining}
          color="bg-blue-500"
        />
        <LeaveCard
          icon={MdSick}
          title="Sick Leave"
          total={leaveBalance.sick.total}
          used={leaveBalance.sick.used}
          remaining={leaveBalance.sick.remaining}
          color="bg-red-500"
        />
        <LeaveCard
          icon={MdFlight}
          title="Vacation"
          total={leaveBalance.vacation.total}
          used={leaveBalance.vacation.used}
          remaining={leaveBalance.vacation.remaining}
          color="bg-green-500"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Days</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Reason</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave, index) => (
                <motion.tr
                  key={leave.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {leave.type}
                    </span>
                  </td>
                  <td className="p-3">{leave.date}</td>
                  <td className="p-3">{leave.days}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {leave.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{leave.reason}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const LeaveCard = ({ icon: Icon, title, total, used, remaining, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white border border-gray-200 rounded-xl p-6"
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
      <Icon className="text-white text-2xl" />
    </div>
    <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Total</span>
        <span className="font-medium">{total} days</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Used</span>
        <span className="font-medium text-red-600">{used} days</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Remaining</span>
        <span className="font-medium text-green-600">{remaining} days</span>
      </div>
    </div>
    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full`}
        style={{ width: `${(used / total) * 100}%` }}
      ></div>
    </div>
  </motion.div>
)

export default LeaveManagement
