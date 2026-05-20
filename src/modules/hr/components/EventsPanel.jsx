import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdEvent, MdTraining, MdWarning, MdNote } from 'react-icons/md'

const EventsPanel = ({ employeeId }) => {
  const [events] = useState([
    {
      id: 1,
      type: 'Training',
      date: '2024-03-15',
      title: 'Safety Training Workshop',
      description: 'Annual workplace safety certification',
      icon: MdTraining,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'Disciplinary',
      date: '2024-02-20',
      title: 'Performance Review',
      description: 'Quarterly performance evaluation meeting',
      icon: MdWarning,
      color: 'bg-yellow-500'
    },
    {
      id: 3,
      type: 'Meeting',
      date: '2024-01-10',
      title: 'Team Building Event',
      description: 'Department team building activity',
      icon: MdEvent,
      color: 'bg-green-500'
    },
    {
      id: 4,
      type: 'Note',
      date: '2024-03-01',
      title: 'Promotion Announcement',
      description: 'Promoted to Senior Supervisor position',
      icon: MdNote,
      color: 'bg-purple-500'
    }
  ])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Employee Events</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Event
        </motion.button>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const Icon = event.icon
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 ${event.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {event.type}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">{event.date}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default EventsPanel
