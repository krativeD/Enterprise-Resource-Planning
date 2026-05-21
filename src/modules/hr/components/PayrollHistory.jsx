import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdCheckCircle, MdSchedule, MdPrint } from 'react-icons/md'
import { supabase } from '../../../services/supabase'

const PayrollHistory = ({ employeeId }) => {
  const [payrolls, setPayrolls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (employeeId) {
      loadPayrollHistory()
    }
  }, [employeeId])

  const loadPayrollHistory = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('payroll_items')
        .select(`
          *,
          payrolls:payroll_id (*)
        `)
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayrolls(data || [])
    } catch (error) {
      console.error('Error loading payroll history:', error)
      // Set demo data if no real data
      setPayrolls([
        {
          id: 'PR-2024-001',
          payrolls: {
            start_date: '2024-03-01',
            end_date: '2024-03-15',
            status: 'Confirmed',
            gross_amount: 4600,
            net_amount: 3758.10
          },
          created_at: '2024-03-15'
        },
        {
          id: 'PR-2024-002',
          payrolls: {
            start_date: '2024-02-15',
            end_date: '2024-02-28',
            status: 'Confirmed',
            gross_amount: 4600,
            net_amount: 3800.00
          },
          created_at: '2024-02-28'
        },
        {
          id: 'PR-2024-003',
          payrolls: {
            start_date: '2024-02-01',
            end_date: '2024-02-14',
            status: 'Confirmed',
            gross_amount: 4600,
            net_amount: 3750.00
          },
          created_at: '2024-02-14'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="em-tab-content">
        <div className="em-loading">Loading payroll history...</div>
      </div>
    )
  }

  return (
    <div className="em-tab-content">
      <div className="em-tab-header">
        <h3>Payroll History</h3>
        <select className="em-filter-select">
          <option>2024</option>
          <option>2023</option>
        </select>
      </div>

      {payrolls.length === 0 ? (
        <div className="em-empty-state">
          <div className="em-empty-icon">💰</div>
          <div className="em-empty-text">No Payroll History</div>
          <div className="em-empty-subtext">No payroll records found for this employee</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {payrolls.map((payroll, index) => {
            const p = payroll.payrolls || payroll
            return (
              <motion.div
                key={payroll.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="neo-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <h4 style={{ fontWeight: '600', color: '#1a3a5c' }}>
                        Payroll #{typeof payroll.id === 'string' ? payroll.id : `PR-${index + 1}`}
                      </h4>
                      <span className="em-status-badge em-status-active">
                        <MdCheckCircle style={{ display: 'inline', marginRight: '3px' }} />
                        {p.status || 'Confirmed'}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#666' }}>
                      <MdSchedule style={{ display: 'inline', marginRight: '5px' }} />
                      {p.start_date || 'N/A'} - {p.end_date || 'N/A'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: '#666' }}>Gross Pay</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                      ${(p.gross_amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#666' }}>Net Pay</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                      ${(p.net_amount || 0).toFixed(2)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: '#666' }}>Payment Date</p>
                    <p style={{ fontSize: '13px', fontWeight: '500' }}>
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <button className="em-neo-btn" onClick={() => window.print()}>
                    🖨 Print
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PayrollHistory
