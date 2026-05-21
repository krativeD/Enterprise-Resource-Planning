import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAttachMoney, MdPrint, MdCalculate } from 'react-icons/md'

const PayrollDetailsView = ({ employee }) => {
  const [payrollItems] = useState([
    { name: 'Social Security', type: 'Tax Deduction', wage_percent: 6.2, base_limit: 147000, amount: 285.20 },
    { name: 'Federal Income Tax', type: 'Tax Deduction', wage_percent: 15, base_limit: null, amount: 690.00 },
    { name: 'Medicare', type: 'Tax Deduction', wage_percent: 1.45, base_limit: null, amount: 66.70 },
    { name: 'Health Insurance', type: 'Deduction', wage_percent: null, base_limit: null, amount: 250.00 },
    { name: 'Fuel Reimbursement', type: 'Addition', wage_percent: null, base_limit: null, amount: 150.00 },
    { name: 'Bonus', type: 'Addition', wage_percent: null, base_limit: null, amount: 300.00 },
  ])

  const grossPay = employee?.hourly_amount ? employee.hourly_amount * 160 : 4600
  const totalDeductions = payrollItems
    .filter(item => item.type.includes('Deduction') || item.type.includes('Tax'))
    .reduce((sum, item) => sum + item.amount, 0)
  const totalAdditions = payrollItems
    .filter(item => item.type === 'Addition')
    .reduce((sum, item) => sum + item.amount, 0)
  const netPay = grossPay - totalDeductions + totalAdditions

  return (
    <div className="em-tab-content">
      <div className="em-tab-header">
        <h3>Payroll & Details</h3>
        <button className="em-neo-btn" onClick={() => window.print()}>
          🖨 Print
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div className="neo-card">
          <div style={{ textAlign: 'center' }}>
            <MdAttachMoney style={{ fontSize: '30px', color: '#2563eb', marginBottom: '10px' }} />
            <p style={{ fontSize: '12px', color: '#666' }}>Gross Pay</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>${grossPay.toFixed(2)}</p>
          </div>
        </div>
        <div className="neo-card">
          <div style={{ textAlign: 'center' }}>
            <MdCalculate style={{ fontSize: '30px', color: '#dc2626', marginBottom: '10px' }} />
            <p style={{ fontSize: '12px', color: '#666' }}>Total Deductions</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>${totalDeductions.toFixed(2)}</p>
          </div>
        </div>
        <div className="neo-card">
          <div style={{ textAlign: 'center' }}>
            <MdPrint style={{ fontSize: '30px', color: '#16a34a', marginBottom: '10px' }} />
            <p style={{ fontSize: '12px', color: '#666' }}>Net Pay</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>${netPay.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Payroll Items Table */}
      <div className="em-table-wrapper">
        <table className="em-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Type</th>
              <th>Wage %</th>
              <th>Base Limit</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payrollItems.map((item, index) => (
              <tr key={index}>
                <td style={{ fontWeight: '500' }}>{item.name}</td>
                <td>
                  <span className={`em-status-badge ${
                    item.type === 'Addition' ? 'em-status-active' :
                    item.type === 'Deduction' ? 'em-status-inactive' :
                    'em-status-on-leave'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td>{item.wage_percent ? `${item.wage_percent}%` : '--'}</td>
                <td>{item.base_limit ? `$${item.base_limit.toLocaleString()}` : '--'}</td>
                <td style={{ textAlign: 'right', fontWeight: '600' }}>
                  ${item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f0f4f8', fontWeight: 'bold' }}>
              <td colSpan={4}>Net Pay</td>
              <td style={{ textAlign: 'right', color: '#16a34a', fontSize: '16px' }}>
                ${netPay.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default PayrollDetailsView
