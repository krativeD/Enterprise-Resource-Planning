import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdEdit, MdSave, MdCancel } from 'react-icons/md'
import { supabase } from '../../../services/supabase'
import { useToast } from '../../../hooks/useToast'

const SchedulingPanel = ({ employeeId }) => {
  const [editing, setEditing] = useState(false)
  const [schedule, setSchedule] = useState({
    Monday: { shift: 'Morning', hours: '08:00 - 17:00', status: 'Working' },
    Tuesday: { shift: 'Morning', hours: '08:00 - 17:00', status: 'Working' },
    Wednesday: { shift: 'Morning', hours: '08:00 - 17:00', status: 'Working' },
    Thursday: { shift: 'Morning', hours: '08:00 - 17:00', status: 'Working' },
    Friday: { shift: 'Morning', hours: '08:00 - 16:00', status: 'Working' },
    Saturday: { shift: 'Off', hours: '--', status: 'Off Day' },
    Sunday: { shift: 'Off', hours: '--', status: 'Off Day' }
  })
  const [loading, setLoading] = useState(true)
  const { showToast, ToastContainer } = useToast()

  useEffect(() => {
    if (employeeId) {
      loadSchedule()
    }
  }, [employeeId])

  const loadSchedule = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('employee_schedules')
        .select('*')
        .eq('employee_id', employeeId)

      if (error) throw error

      if (data && data.length > 0) {
        const scheduleData = { ...schedule }
        data.forEach(day => {
          if (scheduleData[day.day_of_week]) {
            scheduleData[day.day_of_week] = {
              shift: day.shift_type || 'Morning',
              hours: `${day.shift_start || '08:00'} - ${day.shift_end || '17:00'}`,
              status: day.status || 'Working'
            }
          }
        })
        setSchedule(scheduleData)
      }
    } catch (error) {
      console.error('Error loading schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Delete existing schedule
      await supabase
        .from('employee_schedules')
        .delete()
        .eq('employee_id', employeeId)

      // Insert new schedule
      const scheduleEntries = Object.entries(schedule).map(([day, details]) => ({
        employee_id: employeeId,
        day_of_week: day,
        shift_type: details.shift,
        shift_start: details.hours.split(' - ')[0] || '08:00',
        shift_end: details.hours.split(' - ')[1] || '17:00',
        status: details.status
      }))

      const { error } = await supabase
        .from('employee_schedules')
        .insert(scheduleEntries)

      if (error) throw error

      showToast('Schedule saved successfully!', 'success')
      setEditing(false)
    } catch (error) {
      console.error('Error saving schedule:', error)
      showToast('Error saving schedule', 'error')
    }
  }

  const updateDay = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }))
  }

  const workingDays = Object.values(schedule).filter(d => d.status === 'Working').length
  const totalHours = Object.values(schedule)
    .filter(d => d.status === 'Working')
    .reduce((sum, d) => {
      const [start, end] = d.hours.split(' - ')
      if (start && end) {
        const [sH, sM] = start.split(':').map(Number)
        const [eH, eM] = end.split(':').map(Number)
        return sum + (eH + eM/60) - (sH + sM/60)
      }
      return sum
    }, 0)

  if (loading) {
    return (
      <div className="em-tab-content">
        <div className="em-loading">Loading schedule...</div>
      </div>
    )
  }

  return (
    <div className="em-tab-content">
      <ToastContainer />
      
      <div className="em-tab-header">
        <h3>Weekly Schedule</h3>
        {!editing ? (
          <button className="em-neo-btn" onClick={() => setEditing(true)}>
            <MdEdit style={{ display: 'inline', marginRight: '5px' }} /> Edit Schedule
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="em-neo-btn em-neo-btn-green" onClick={handleSave}>
              <MdSave style={{ display: 'inline', marginRight: '5px' }} /> Save
            </button>
            <button className="em-neo-btn" onClick={() => setEditing(false)}>
              <MdCancel style={{ display: 'inline', marginRight: '5px' }} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {Object.entries(schedule).map(([day, details], index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="neo-card"
            style={{ 
              textAlign: 'center',
              background: details.status === 'Working' ? '#e8f5e9' : '#f5f5f5'
            }}
          >
            <p style={{ fontWeight: '600', fontSize: '13px', marginBottom: '8px', color: '#1a3a5c' }}>{day}</p>
            
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <select
                  value={details.status}
                  onChange={(e) => updateDay(day, 'status', e.target.value)}
                  className="neo-input"
                  style={{ fontSize: '11px', width: '100%' }}
                >
                  <option value="Working">Working</option>
                  <option value="Off Day">Off Day</option>
                  <option value="Holiday">Holiday</option>
                </select>
                {details.status === 'Working' && (
                  <>
                    <select
                      value={details.shift}
                      onChange={(e) => updateDay(day, 'shift', e.target.value)}
                      className="neo-input"
                      style={{ fontSize: '11px', width: '100%' }}
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Night">Night</option>
                    </select>
                    <input
                      type="text"
                      value={details.hours}
                      onChange={(e) => updateDay(day, 'hours', e.target.value)}
                      className="neo-input"
                      style={{ fontSize: '11px', width: '100%' }}
                      placeholder="08:00 - 17:00"
                    />
                  </>
                )}
              </div>
            ) : (
              <>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{details.shift}</p>
                <p style={{ fontSize: '11px', color: '#888' }}>{details.hours}</p>
                <span className={`em-status-badge ${
                  details.status === 'Working' ? 'em-status-active' : 'em-status-inactive'
                }`} style={{ marginTop: '8px', display: 'inline-block' }}>
                  {details.status}
                </span>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Schedule Summary */}
      <div className="neo-card" style={{ background: '#f0f4f8' }}>
        <h4 style={{ marginBottom: '12px', color: '#1a3a5c' }}>Schedule Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#666' }}>Working Days</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{workingDays}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#666' }}>Total Hours</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{totalHours.toFixed(1)}h</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#666' }}>Off Days</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9333ea' }}>{7 - workingDays}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchedulingPanel
