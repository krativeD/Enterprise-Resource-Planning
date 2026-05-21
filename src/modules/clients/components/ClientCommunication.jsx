import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSend, MdEmail, MdPhone, MdChat } from 'react-icons/md'

const ClientCommunication = ({ client }) => {
  const [messages] = useState([
    { id: 1, type: 'email', subject: 'Service Update', date: '2024-03-15', direction: 'outgoing' },
    { id: 2, type: 'call', subject: 'Follow-up Call', date: '2024-03-10', direction: 'incoming' },
    { id: 3, type: 'email', subject: 'Invoice Sent', date: '2024-03-05', direction: 'outgoing' },
  ])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Communication History</h2>
      <div className="space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              {msg.type === 'email' ? <MdEmail className="text-blue-500" /> :
               msg.type === 'call' ? <MdPhone className="text-green-500" /> :
               <MdChat className="text-purple-500" />}
              <div>
                <p className="font-medium text-sm">{msg.subject}</p>
                <p className="text-xs text-gray-500">{msg.date}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              msg.direction === 'outgoing' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
              {msg.direction}
            </span>
          </div>
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="mt-4 w-full px-4 py-3 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-2">
        <MdSend /> <span>New Message</span>
      </motion.button>
    </div>
  )
}

export default ClientCommunication
