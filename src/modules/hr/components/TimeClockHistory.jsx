import React, { useState, useEffect } from 'react'
import { supabase } from '../../../services/supabase'
import { useToast } from '../../../hooks/useToast'

const TimeClockHistory = ({ employeeId }) => {
  const [timeRecords, setTimeRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { showToast } = useToast()

  useEffect(() => {
    if (employeeId) {
      loadTimeRecords()
    }
  }, [employeeId, filter])

  const loadTimeRecords = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .order('check_in', { ascending: false })

      if (filter === 'thisMonth') {
        const now = new Date()
        query = query
          .gte('check_in', new Date(now.getFullYear(), now.getMonth(), 1).toISOString())
      } else if (filter === 'lastMonth') {
        const now = new Date()
        query = query
          .gte('check_in', new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString())
          .lt('check_in', new Date(now.getFullYear(), now.getMonth(), 1).toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      setTimeRecords(data || [])
    } catch (error) {
      console.error('Error loading time records:', error)
      showToast('Error loading time clock history', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '--'
    return new Date(dateStr).toLocaleString()
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return '--'
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '--'
    const diff = new Date(checkOut) - new Date(checkIn)
    return (diff / (1000 * 60 * 60)).toFixed(2)
  }

  return (
    <div className="em-tab-content">
      <div className="em-tab-header">
        <h3>Time Clock History</h3>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="em-filter-select"
        >
          <option value="all">All Records</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      {loading ? (
        <div className="em-loading">Loading time records...</div>
      ) : timeRecords.length === 0 ? (
        <div className="em-empty-state">
          <div className="em-empty-icon">🕐</div>
          <div className="em-empty-text">No Time Records</div>
          <div className="em-empty-subtext">No clock in/out records found for this employee</div>
        </div>
      ) : (
        <div className="em-table-wrapper">
          <table className="em-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Hours Worked</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {timeRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.check_in ? new Date(record.check_in).toLocaleDateString() : '--'}</td>
                  <td>{formatTime(record.check_in)}</td>
                  <td>{formatTime(record.check_out)}</td>
                  <td>{calculateHours(record.check_in, record.check_out)} hrs</td>
                  <td>
                    <span className={`em-status-badge em-status-${record.status?.toLowerCase()}`}>
                      {record.status || 'Present'}
                    </span>
                  </td>
                  <td>{record.location ? '📍 GPS Tracked' : '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {timeRecords.length > 0 && (
        <div className="em-summary-bar">
          <div>
            <span>Total Records: </span>
            <strong>{timeRecords.length}</strong>
          </div>
          <div>
            <span>Total Hours: </span>
            <strong>
              {timeRecords
                .reduce((sum, r) => sum + parseFloat(calculateHours(r.check_in, r.check_out) || 0), 0)
                .toFixed(2)} hrs
            </strong>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeClockHistory
