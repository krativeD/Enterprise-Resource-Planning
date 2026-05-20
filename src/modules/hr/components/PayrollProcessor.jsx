import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdCalculate, MdAttachMoney, MdCheckCircle, MdPrint,
  MdEmail, MdFilterList, MdSearch, MdCalendarToday,
  MdPeople, MdAssessment, MdDownload, MdSend,
  MdWarning, MdInfo
} from 'react-icons/md'

const PayrollProcessor = () => {
  const [payrollRun, setPayrollRun] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState({
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    type: 'Bi-Weekly'
  })
  const [step, setStep] = useState(1) // 1: Setup, 2: Review, 3: Process, 4: Complete
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all'
  })
  const [previewData, setPreviewData] = useState([])

  // Mock payroll data
  const payrollPreview = [
    {
      id: 1,
      employee: 'John Mokoena',
      position: 'HR Manager',
      department: 'HR',
      payType: 'Salary',
      regularHours: 80,
      overtimeHours: 5,
      grossPay: 4600,
      deductions: {
        socialSecurity: 285.20,
        federalTax: 690.00,
        medicare: 66.70,
        healthInsurance: 250.00
      },
      additions: {
        fuelReimbursement: 150.00,
        bonus: 300.00
      },
      netPay: 3758.10,
      ptoTaken: 0
    },
    {
      id: 2,
      employee: 'Sarah Johnson',
      position: 'Cleaner',
      department: 'Operations',
      payType: 'Hourly',
      regularHours: 80,
      overtimeHours: 10,
      grossPay: 3200,
      deductions: {
        socialSecurity: 198.40,
        federalTax: 480.00,
        medicare: 46.40,
        healthInsurance: 250.00
      },
      additions: {
        fuelReimbursement: 100.00
      },
      netPay: 2325.20,
      ptoTaken: 8
    },
    {
      id: 3,
      employee: 'Mike Ndlovu',
      position: 'Supervisor',
      department: 'Operations',
      payType: 'Salary',
      regularHours: 80,
      overtimeHours: 0,
      grossPay: 3800,
      deductions: {
        socialSecurity: 235.60,
        federalTax: 570.00,
        medicare: 55.10,
        healthInsurance: 250.00
      },
      additions: {},
      netPay: 2689.30,
      ptoTaken: 0
    }
  ]

  const summary = useMemo(() => {
    return payrollPreview.reduce((acc, emp) => ({
      totalGross: acc.totalGross + emp.grossPay,
      totalDeductions: acc.totalDeductions + Object.values(emp.deductions).reduce((a, b) => a + b, 0),
      totalAdditions: acc.totalAdditions + Object.values(emp.additions).reduce((a, b) => a + b, 0),
      totalNet: acc.totalNet + emp.netPay,
      totalEmployees: acc.totalEmployees + 1
    }), {
      totalGross: 0,
      totalDeductions: 0,
      totalAdditions: 0,
      totalNet: 0,
      totalEmployees: 0
    })
  }, [payrollPreview])

  const handleProcessPayroll = async () => {
    setStep(3)
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    setStep(4)
    setPayrollRun({
      id: `PR-${new Date().getFullYear()}-${String(payrollPreview.length).padStart(3, '0')}`,
      date: new Date().toISOString(),
      ...summary
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Payroll Processing</h2>
            <p className="text-gray-500 mt-1">Process employee payroll for selected period</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                       transition-colors flex items-center space-x-2"
            >
              <MdDownload /> <span>Export</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       transition-colors flex items-center space-x-2"
            >
              <MdPrint /> <span>Print Report</span>
            </motion.button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {['Setup', 'Review', 'Process', 'Complete'].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${step > i + 1 ? 'bg-green-500 text-white' :
                    step === i + 1 ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'}`}
                >
                  {step > i + 1 ? <MdCheckCircle /> : i + 1}
                </div>
                <span className={`ml-2 text-sm font-medium
                  ${step === i + 1 ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  {s}
                </span>
              </div>
              {i < 3 && (
                <div className={`flex-1 h-1 mx-4 rounded
                  ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pay Period Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Weekly</option>
                    <option selected>Bi-Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={selectedPeriod.startDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={selectedPeriod.endDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Status Filter
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="all">All Active Employees</option>
                    <option value="active">Active Only</option>
                    <option value="hourly">Hourly Only</option>
                    <option value="salary">Salary Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Filter
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="all">All Departments</option>
                    <option value="operations">Operations</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                           transition-colors flex items-center space-x-2 font-medium"
                >
                  <MdSearch /> <span>Preview Payroll</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <SummaryCard title="Employees" value={summary.totalEmployees} icon={MdPeople} color="text-blue-600" />
                <SummaryCard title="Total Gross" value={`$${summary.totalGross.toLocaleString()}`} icon={MdAttachMoney} color="text-green-600" />
                <SummaryCard title="Deductions" value={`$${summary.totalDeductions.toLocaleString()}`} icon={MdCalculate} color="text-red-600" />
                <SummaryCard title="Additions" value={`$${summary.totalAdditions.toLocaleString()}`} icon={MdAttachMoney} color="text-purple-600" />
                <SummaryCard title="Net Pay" value={`$${summary.totalNet.toLocaleString()}`} icon={MdCheckCircle} color="text-indigo-600" />
              </div>

              {/* Payroll Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-sm font-semibold">Employee</th>
                      <th className="p-3 text-left text-sm font-semibold">Position</th>
                      <th className="p-3 text-center text-sm font-semibold">Reg Hours</th>
                      <th className="p-3 text-center text-sm font-semibold">OT Hours</th>
                      <th className="p-3 text-right text-sm font-semibold">Gross Pay</th>
                      <th className="p-3 text-right text-sm font-semibold">Deductions</th>
                      <th className="p-3 text-right text-sm font-semibold">Additions</th>
                      <th className="p-3 text-right text-sm font-semibold">Net Pay</th>
                      <th className="p-3 text-center text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollPreview.map((emp, index) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium">{emp.employee}</td>
                        <td className="p-3 text-sm text-gray-600">{emp.position}</td>
                        <td className="p-3 text-center">{emp.regularHours}h</td>
                        <td className="p-3 text-center">
                          <span className={emp.overtimeHours > 0 ? 'text-orange-600 font-medium' : ''}>
                            {emp.overtimeHours}h
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium">${emp.grossPay.toFixed(2)}</td>
                        <td className="p-3 text-right text-red-600">
                          ${Object.values(emp.deductions).reduce((a, b) => a + b, 0).toFixed(2)}
                        </td>
                        <td className="p-3 text-right text-green-600">
                          ${Object.values(emp.additions).reduce((a, b) => a + b, 0).toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-bold text-indigo-600">${emp.netPay.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Ready
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="p-3" colSpan={4}>TOTALS</td>
                      <td className="p-3 text-right">${summary.totalGross.toFixed(2)}</td>
                      <td className="p-3 text-right text-red-600">${summary.totalDeductions.toFixed(2)}</td>
                      <td className="p-3 text-right text-green-600">${summary.totalAdditions.toFixed(2)}</td>
                      <td className="p-3 text-right text-indigo-600">${summary.totalNet.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-6 flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 
                           transition-colors font-medium"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProcessPayroll}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 
                           transition-colors flex items-center space-x-2 font-medium"
                >
                  <MdCalculate /> <span>Process Payroll</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent 
                            rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Payroll...</h3>
              <p className="text-gray-500">Calculating payments for {summary.totalEmployees} employees</p>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <MdCheckCircle className="text-8xl text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Payroll Processed Successfully!</h3>
              <p className="text-gray-500 mb-4">
                Payroll ID: {payrollRun?.id} • {summary.totalEmployees} employees processed
              </p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                           transition-colors flex items-center space-x-2"
                >
                  <MdPrint /> <span>Print Payslips</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 
                           transition-colors flex items-center space-x-2"
                >
                  <MdEmail /> <span>Email Payslips</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 
                           transition-colors font-medium"
                >
                  New Payroll Run
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Payroll History */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Payroll Runs</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">Payroll ID</th>
                <th className="p-3 text-left">Period</th>
                <th className="p-3 text-left">Employees</th>
                <th className="p-3 text-right">Gross Amount</th>
                <th className="p-3 text-right">Net Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'PR-2024-045', period: '02/15/2024 - 02/28/2024', employees: 156, gross: 425000, net: 345000, status: 'Confirmed' },
                { id: 'PR-2024-044', period: '02/01/2024 - 02/14/2024', employees: 154, gross: 418000, net: 339000, status: 'Confirmed' },
                { id: 'PR-2024-043', period: '01/15/2024 - 01/31/2024', employees: 152, gross: 412000, net: 335000, status: 'Confirmed' }
              ].map((run, index) => (
                <motion.tr
                  key={run.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">{run.id}</td>
                  <td className="p-3 text-sm">{run.period}</td>
                  <td className="p-3 text-sm">{run.employees}</td>
                  <td className="p-3 text-right">${run.gross.toLocaleString()}</td>
                  <td className="p-3 text-right font-semibold">${run.net.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {run.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <MdPrint />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <MdDownload />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4"
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm text-gray-600">{title}</p>
      <Icon className={`text-xl ${color}`} />
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </motion.div>
)

export default PayrollProcessor
