import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAttachMoney, MdCheckCircle, MdSchedule } from 'react-icons/md'

const PayrollHistory = ({ employeeId }) => {
  const [payrolls] = useState([
    {
      id: 'PR-2024-001',
      period: '03/01/2024 - 03/15/2024',
      status: 'Confirmed',
      grossPay: 4600,
      netPay: 3800,
      paymentDate: '03/15/2024'
    },
    {
      id: 'PR-2024-002',
      period: '02/15/2024 - 02/28/2024',
      status: 'Confirmed',
      grossPay: 4600,
      netPay: 3750,
      paymentDate: '02/28/2024'
    },
    {
      id: 'PR-2024-003',
      period: '02/01/2024 - 02/14/2024',
      status: 'Confirmed',
      grossPay: 4600,
      netPay: 3800,
      paymentDate: '02/14/2024'
    }
  ])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Payroll History</h3>
        <select className="px-3 py-2 border border-gray-300 rounded-lg">
          <option>2024</option>
          <option>2023</option>
        </select>
      </div>

      <div className="space-y-4">
        {payrolls.map((payroll, index) => (
          <motion.div
            key={payroll.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-800">{payroll.id}</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs flex items-center">
                    <MdCheckCircle className="mr-1" /> {payroll.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <MdSchedule className="inline mr-1" />
                  {payroll.period}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Gross Pay</p>
                <p className="text-xl font-bold text-blue-600">${payroll.grossPay.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Net Pay</p>
                <p className="text-lg font-bold text-green-600">${payroll.netPay.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Payment Date</p>
                <p className="text-sm font-medium">{payroll.paymentDate}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PayrollHistory
