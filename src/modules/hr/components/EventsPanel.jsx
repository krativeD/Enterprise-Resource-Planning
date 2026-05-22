import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdEvent, MdSchool, MdWarning, MdNote, MdAdd } from 'react-icons/md'
import { supabase } from '../../../services/supabase'

const EventsPanel = ({ employeeId }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    event_type: 'Meeting',
    event_title: '',
    event_description: '',
    event_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (employeeId) {
      loadEvents()
    }
  }, [employeeId])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('employee_events')
        .select('*')
        .eq('employee_id', employeeId)
        .order('event_date', { ascending: false })

      if (error) throw error
      
      if (data && data.length > 0) {
        setEvents(data)
      } else {
        // Demo data
        setEvents([
          { id: 1, event_type: 'Training', event_title: 'Safety Training Workshop', event_description: 'Annual workplace safety certification', event_date: '2024-03-15' },
          { id: 2, event_type: 'Disciplinary', event_title: 'Performance Review', event_description: 'Quarterly performance evaluation meeting', event_date: '2024-02-20' },
          { id: 3, event_type: 'Meeting', event_title: 'Team Building Event', event_description: 'Department team building activity', event_date: '2024-01-10' },
          { id: 4, event_type: 'Note', event_title: 'Promotion Announcement', event_description: 'Promoted to Senior Supervisor position', event_date: '2024-03-01' }
        ])
      }
    } catch (error) {
      console.error('Error loading events:', error)
      // Fallback demo data
      setEvents([
        { id: 1, event_type: 'Training', event_title: 'Safety Training Workshop', event_description: 'Annual workplace safety certification', event_date: '2024-03-15' },
        { id: 2, event_type: 'Disciplinary', event_title: 'Performance Review', event_description: 'Quarterly performance evaluation meeting', event_date: '2024-02-20' },
        { id: 3, event_type: 'Meeting', event_title: 'Team Building Event', event_description: 'Department team building activity', event_date: '2024-01-10' },
        { id: 4, event_type: 'Note', event_title: 'Promotion Announcement', event_description: 'Promoted to Senior Supervisor position', event_date: '2024-03-01' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async () => {
    if (!newEvent.event_title) return

    try {
      const { data, error } = await supabase
        .from('employee_events')
        .insert([{
          employee_id: employeeId,
          ...newEvent,
          created_by: 'Current User'
        }])
        .select()

      if (error) throw error
      if (data) {
        setEvents(prev => [data[0], ...prev])
      }
      setShowAddForm(false)
      setNewEvent({
        event_type: 'Meeting',
        event_title: '',
        event_description: '',
        event_date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Error adding event:', error)
      // Add locally if DB fails
      const localEvent = {
        id: Date.now(),
        ...newEvent,
        created_at: new Date().toISOString()
      }
      setEvents(prev => [localEvent, ...prev])
      setShowAddForm(false)
      setNewEvent({
        event_type: 'Meeting',
        event_title: '',
        event_description: '',
        event_date: new Date().toISOString().split('T')[0]
      })
    }
  }

  // Fixed: Use MdSchool instead of MdTraining
  const getEventIcon = (type) => {
    switch(type) {
      case 'Training': return MdSchool
      case 'Disciplinary': return MdWarning
      case 'Meeting': return MdEvent
      case 'Note': return MdNote
      default: return MdEvent
    }
  }

  const getEventColor = (type) => {
    switch(type) {
      case 'Training': return '#2563eb'
      case 'Disciplinary': return '#f59e0b'
      case 'Meeting': return '#16a34a'
      case 'Note': return '#9333ea'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div className="em-tab-content">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading events...</div>
      </div>
    )
  }

  return (
    <div className="em-tab-content">
      <div className="em-tab-header">
        <h3>Employee Events</h3>
        <button className="em-neo-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <MdAdd style={{ display: 'inline', marginRight: '5px' }} /> Add Event
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="neo-card" style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '12px', color: '#1a3a5c' }}>Add New Event</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Event Type</label>
              <select
                value={newEvent.event_type}
                onChange={(e) => setNewEvent(prev => ({ ...prev, event_type: e.target.value }))}
                className="neo-input"
                style={{ width: '100%' }}
              >
                <option value="Meeting">Meeting</option>
                <option value="Training">Training</option>
                <option value="Disciplinary">Disciplinary</option>
                <option value="Note">Note</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, event_date: e.target.value }))}
                className="neo-input"
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Title</label>
              <input
                type="text"
                value={newEvent.event_title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, event_title: e.target.value }))}
                className="neo-input"
                style={{ width: '100%' }}
                placeholder="Event title"
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Description</label>
              <textarea
                value={newEvent.event_description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, event_description: e.target.value }))}
                className="neo-input"
                style={{ width: '100%', minHeight: '60px' }}
                placeholder="Event description"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button className="em-neo-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button className="em-neo-btn em-neo-btn-green" onClick={handleAddEvent}>Save Event</button>
          </div>
        </div>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📅</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>No Events</div>
          <div style={{ fontSize: '13px', color: '#999' }}>No events recorded for this employee</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((event, index) => {
            const Icon = getEventIcon(event.event_type)
            const color = getEventColor(event.event_type)
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="neo-card"
                style={{ display: 'flex', alignItems: 'start', gap: '15px' }}
              >
                <div style={{
                  width: '45px', height: '45px', borderRadius: '12px',
                  background: color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon style={{ color: 'white', fontSize: '20px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h4 style={{ fontWeight: '600', color: '#1a3a5c', margin: '0 0 4px 0' }}>{event.event_title}</h4>
                      <p style={{ fontSize: '13px', color: '#666', margin: '0' }}>{event.event_description}</p>
                    </div>
                    <span className="em-status-badge em-status-active" style={{ flexShrink: 0, marginLeft: '10px' }}>
                      {event.event_type}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>{event.event_date}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EventsPanel
