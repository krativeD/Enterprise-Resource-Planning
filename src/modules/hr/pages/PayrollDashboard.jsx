import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './PayrollDashboard.css'

const PayrollDashboard = ({ onBack }) => {
  const [payrollData, setPayrollData] = useState({
    payrollDate: '8/30/2023',
    status: 'Pending',
    payFromDate: '8/1/2023',
    payToDate: '8/15/2023',
    totalGross: '$11,686.83',
    totalNet: '$10,502.55'
  })

  const [employees, setEmployees] = useState([
    { name: 'Andy Anderson', payType: 'Salary', grossPay: '$4,300', netPay: '$4,100' },
    { name: 'Anita Withers', payType: 'Hourly', grossPay: '$3,900', netPay: '$3,600' },
    { name: 'Fred Fredders', payType: 'Hourly', grossPay: '$4,603', netPay: '$4,086' },
    { name: 'Emily Brown', payType: 'Hourly', grossPay: '$2,100', netPay: '$1,960' }
  ])

  const [selectedEmployee, setSelectedEmployee] = useState(employees[0])
  const [timesheets, setTimesheets] = useState([])
  const [activeFooterTab, setActiveFooterTab] = useState('payroll')

  useEffect(() => {
    generateTimesheets()
  }, [])

  const generateTimesheets = () => {
    const entries = []
    for (let i = 0; i < 8; i++) {
      entries.push({
        date: `2026-05-${10 + i}`,
        timeIn: '08:00',
        timeOut: '17:00',
        regHours: 8,
        otHours: i < 3 ? 2 : 0,
        totalHours: i < 3 ? 10 : 8
      })
    }
    setTimesheets(entries)
  }

  const handleAddNewPayroll = () => {
    alert('New payroll created!')
  }

  const handleSavePayroll = () => {
    alert('Payroll saved successfully!')
  }

  const handlePrintPayStub = () => {
    window.print()
  }

  const footerTabs = [
    'Payroll',
    'Payroll List',
    'Paid Employees List',
    'Pay Items',
    'Timesheet Data',
    'Employees'
  ]

  return (
    <div className="payroll-wrapper">
      {/* Header */}
      <div className="payroll-header">
        <div className="payroll-avatar">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Avatar" />
        </div>
        <h1>Payroll Dashboard</h1>
        <button 
          className="payroll-back-btn"
          onClick={onBack}
          style={{
            position: 'absolute',
            right: '10px',
            background: 'linear-gradient(to bottom, #e74c3c, #c0392b)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back to Employee Manager
        </button>
      </div>

      {/* Top Buttons */}
      <div className="payroll-top-buttons">
        <button className="payroll-neo-btn" onClick={handleAddNewPayroll}>
          ➕ ADD NEW PAYROLL
        </button>
        <button className="payroll-neo-btn" onClick={handleSavePayroll}>
          ✔ SAVE PAYROLL
        </button>
        <button className="payroll-neo-btn">
          ⬅ PREVIOUS
        </button>
        <button className="payroll-neo-btn">
          ➕ ADD EMPLOYEE
        </button>
        <button className="payroll-neo-btn">
          SAVE & NEXT ➡
        </button>
        <button className="payroll-neo-btn" onClick={handlePrintPayStub}>
          🖨 PRINT PAY STUB
        </button>
      </div>

      {/* Main Grid */}
      <div className="payroll-grid">
        {/* Payroll Details Panel */}
        <div className="payroll-panel">
          <div className="payroll-panel-title">PAYROLL DETAILS</div>

          <div className="payroll-details-grid">
            <div className="payroll-field">
              <span className="payroll-field-label">Payroll Date:</span>
              <input 
                type="text" 
                value={payrollData.payrollDate}
                onChange={(e) => setPayrollData(prev => ({...prev, payrollDate: e.target.value}))}
              />
            </div>
            <div className="payroll-field">
              <span className="payroll-field-label">Status:</span>
              <select 
                value={payrollData.status}
                onChange={(e) => setPayrollData(prev => ({...prev, status: e.target.value}))}
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Processing</option>
                <option>Paid</option>
              </select>
            </div>

            <div className="payroll-field">
              <span className="payroll-field-label">Pay From Date:</span>
              <input 
                type="text" 
                value={payrollData.payFromDate}
                onChange={(e) => setPayrollData(prev => ({...prev, payFromDate: e.target.value}))}
              />
            </div>
            <div className="payroll-field">
              <span className="payroll-field-label">Pay To Date:</span>
              <input 
                type="text" 
                value={payrollData.payToDate}
                onChange={(e) => setPayrollData(prev => ({...prev, payToDate: e.target.value}))}
              />
            </div>
          </div>

          <div className="payroll-summary">
            <span>Total Gross Payroll {payrollData.totalGross}</span>
            <span>Total Net {payrollData.totalNet}</span>
          </div>
        </div>

        {/* Employee Details Panel */}
        <div className="payroll-panel">
          <div className="payroll-panel-title">EMPLOYEE DETAILS</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px' }}>
            <div>
              <div className="payroll-details-grid">
                <div className="payroll-field">
                  <span className="payroll-field-label">Employee Name:</span>
                  <select 
                    value={selectedEmployee?.name}
                    onChange={(e) => {
                      const emp = employees.find(em => em.name === e.target.value)
                      setSelectedEmployee(emp)
                    }}
                  >
                    {employees.map(emp => (
                      <option key={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div className="payroll-field">
                  <span className="payroll-field-label">Pay Type:</span>
                  <span>{selectedEmployee?.payType}</span>
                </div>

                <div className="payroll-field">
                  <span className="payroll-field-label">Payroll Date:</span>
                  <span>{payrollData.payrollDate}</span>
                </div>
                <div className="payroll-field">
                  <span className="payroll-field-label">PTO Taken:</span>
                  <input type="text" placeholder="0" />
                </div>

                <div className="payroll-field">
                  <span className="payroll-field-label">Pay Amount:</span>
                  <span style={{ fontWeight: 'bold', color: '#1a5c32' }}>{selectedEmployee?.grossPay}</span>
                </div>
                <div className="payroll-field">
                  <span className="payroll-field-label">Overtime Rate:</span>
                  <span>1.5x</span>
                </div>
              </div>
            </div>

            <div>
              <div className="payroll-employee-photo">
                <img src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" alt="Employee" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="payroll-tables">
        {/* Selected Employees */}
        <div className="payroll-panel">
          <div className="payroll-panel-title">SELECTED PAY PERIOD EMPLOYEES</div>
          <table className="payroll-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Pay Type</th>
                <th>Gross Pay</th>
                <th>Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={i} onClick={() => setSelectedEmployee(emp)} style={{ cursor: 'pointer' }}>
                  <td>{emp.name}</td>
                  <td>{emp.payType}</td>
                  <td>{emp.grossPay}</td>
                  <td>{emp.netPay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Timesheet Entries */}
        <div className="payroll-panel">
          <div className="payroll-panel-title">TIMESHEET ENTRIES</div>
          <table className="payroll-table">
            <thead>
              <tr>
                <th>Entry Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Reg. Hrs.</th>
                <th>OT Hrs.</th>
                <th>Total Hrs.</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((ts, i) => (
                <tr key={i}>
                  <td>{ts.date}</td>
                  <td>{ts.timeIn}</td>
                  <td>{ts.timeOut}</td>
                  <td>{ts.regHours}</td>
                  <td style={{ color: ts.otHours > 0 ? '#e67e22' : '#999' }}>{ts.otHours}</td>
                  <td style={{ fontWeight: 'bold' }}>{ts.totalHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Tabs */}
      <div className="payroll-footer-tabs">
        {footerTabs.map(tab => (
          <div
            key={tab}
            className={`payroll-footer-tab ${activeFooterTab === tab.toLowerCase().replace(/\s+/g, '') ? 'active' : ''}`}
            onClick={() => setActiveFooterTab(tab.toLowerCase().replace(/\s+/g, ''))}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PayrollDashboard
