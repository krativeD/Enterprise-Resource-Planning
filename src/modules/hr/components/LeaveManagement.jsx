import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdBeachAccess, MdSick, MdFlight } from 'react-icons/md'
import { supabase } from '../../../services/supabase'

const LeaveManagement = ({ employeeId }) => {
  const [leaveBalance, setLeaveBalance] = useState({
    pto: { total: 20, used: 5, remaining: 15 },
    sick: { total: 10, used: 2, remaining: 8 },
    vacation: { total: 15, used: 3, remaining: 12 }
  })
  const [leaveHistory, setLeaveHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (employeeId) {
      loadLeaveData()
    }
  }, [employeeId])

  const loadLeaveData = async () => {
    setLoading(true)
    try {
      // Load leave balances
      const { data: balanceData } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('year', new Date().getFullYear())
        .single()

      if (balanceData) {
        setLeaveBalance({
          pto: { total: balanceData.pto_total || 20, used: balanceData.pto_used || 0, remaining: balanceData.pto_remaining || 20 },
          sick: { total: balanceData.sick_total || 10, used: balanceData.sick_used || 0, remaining: balanceData.sick_remaining || 10 },
          vacation: { total: balanceData.vacation_total || 15, used: balanceData.vacation_used || 0, remaining: balanceData.vacation_remaining || 15 }
        })
      }

      // Load leave history
      const { data: leaveData } = await supabase
        .from('leaves')
        .select('*')
        .eq('employee_id', employeeId)
        .order('start_date', { ascending: false })
        .limit(10)

      setLeaveHistory(leaveData || [
        { id: 1, leave_type: 'PTO', start_date: '2024-03-10', end_date: '2024-03-10', days_taken: 1, status: 'Approved', reason: 'Personal' },
        { id: 2, leave_type: 'Sick', start_date: '2024-02-15', end_date: '2024-02-16', days_taken: 2, status: 'Approved', reason: 'Illness' },
        { id: 3, leave_type: 'Vacation', start_date: '2024-01-20', end_date: '2024-01-22', days_taken: 3, status: 'Approved', reason: 'Family trip' }
      ])
    } catch (error) {
      console.error('Error loading leave data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="em-tab-content">
        <div className="em-loading">Loading leave information...</div>
      </div>
    )
  }

  return (
    <div className="em-tab-content">
      <div className="em-tab-header">
        <h3>Leave Management</h3>
      </div>

      {/* Leave Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <LeaveCard
          icon={MdBeachAccess}
          title="Paid Time Off"
          total={leaveBalance.pto.total}
          used={leaveBalance.pto.used}
          remaining={leaveBalance.pto.remaining}
          color="#2563eb"
        />
        <LeaveCard
          icon={MdSick}
          title="Sick Leave"
          total={leaveBalance.sick.total}
          used={leaveBalance.sick.used}
          remaining={leaveBalance.sick.remaining}
          color="#dc2626"
        />
        <LeaveCard
          icon={MdFlight}
          title="Vacation"
          total={leaveBalance.vacation.total}
          used={leaveBalance.vacation.used}
          remaining={leaveBalance.vacation.remaining}
          color="#16a34a"
        />
      </div>

      {/* Leave History */}
      <h4 style={{ marginBottom: '12px', color: '#1a3a5c' }}>Leave History</h4>
      {leaveHistory.length === 0 ? (
        <div className="em-empty-state">
          <div className="em-empty-text">No leave history</div>
        </div>
      ) : (
        <div className="em-table-wrapper">
          <table className="em-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave) => (
                <tr key={leave.id}>
                  <td>
                    <span className="em-status-badge em-status-active">
                      {leave.leave_type}
                    </span>
                  </td>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td>{leave.days_taken}</td>
                  <td>
                    <span className={`em-status-badge ${
                      leave.status === 'Approved' ? 'em-status-active' :
                      leave.status === 'Pending' ? 'em-status-on-leave' : 'em-status-inactive'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>{leave.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const LeaveCard = ({ icon: Icon, title, total, used, remaining, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="neo-card"
    style={{ textAlign: 'center' }}
  >
    <div style={{
      width: '50px', height: '50px', borderRadius: '12px',
      background: color, margin: '0 auto 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon style={{ color: 'white', fontSize: '24px' }} />
    </div>
    <h4 style={{ fontWeight: '600', color: '#1a3a5c', marginBottom: '8px' }}>{title}</h4>
    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#666' }}>Total:</span>
        <span style={{ fontWeight: '600' }}>{total} days</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#666' }}>Used:</span>
        <span style={{ fontWeight: '600', color: '#dc2626' }}>{used} days</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: '#666' }}>Remaining:</span>
        <span style={{ fontWeight: '600', color: '#16a34a' }}>{remaining} days</span>
      </div>
    </div>
    <div style={{
      width: '100%', height: '6px', background: '#e5e7eb',
      borderRadius: '3px', marginTop: '12px', overflow: 'hidden'
    }}>
      <div style={{
        width: `${(used / total) * 100}%`,
        height: '100%',
        background: color,
        borderRadius: '3px',
        transition: 'width 0.5s'
      }} />
    </div>
  </motion.div>
)

export default LeaveManagement
