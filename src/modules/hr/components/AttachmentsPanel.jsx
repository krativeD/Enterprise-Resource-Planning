import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdDelete, MdOpenInNew, MdFileDownload, MdImage } from 'react-icons/md'
import { supabase } from '../../../services/supabase'

const AttachmentsPanel = ({ employeeId }) => {
  const [attachments, setAttachments] = useState([
    {
      id: 1,
      file_name: 'contract_2024.pdf',
      file_type: 'PDF',
      file_path: '/documents/contracts/',
      added_by: 'Admin',
      added_on: '2024-01-15',
      thumbnail: '📄'
    },
    {
      id: 2,
      file_name: 'id_card.png',
      file_type: 'Image',
      file_path: '/documents/images/',
      added_by: 'HR Manager',
      added_on: '2024-01-10',
      thumbnail: '🖼️'
    },
    {
      id: 3,
      file_name: 'certification.pdf',
      file_type: 'PDF',
      file_path: '/documents/certifications/',
      added_by: 'Supervisor',
      added_on: '2024-02-01',
      thumbnail: '📄'
    }
  ])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('employee-documents')
          .upload(`${employeeId}/${file.name}`, file)

        if (error) throw error

        // Add to attachments list
        const newAttachment = {
          id: Date.now(),
          file_name: file.name,
          file_type: file.name.split('.').pop().toUpperCase(),
          file_path: `/documents/${employeeId}/`,
          added_by: 'Current User',
          added_on: new Date().toISOString().split('T')[0],
          thumbnail: file.type.startsWith('image/') ? '🖼️' : '📄'
        }
        
        setAttachments(prev => [...prev, newAttachment])
      } catch (error) {
        console.error('Upload error:', error)
      }
    }
  }

  return (
    <div className="mt-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">File Attachments</h3>
        <div className="flex space-x-2">
          <input type="file" id="fileUpload" className="hidden" onChange={handleFileUpload} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('fileUpload').click()}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
          >
            <MdAdd className="inline mr-1" /> Add Att.
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
          >
            <MdOpenInNew className="inline mr-1" /> Open
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
          >
            <MdDelete className="inline mr-1" /> Delete
          </motion.button>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-b-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 text-sm font-medium text-gray-600">File Name</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">File Type</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">File Path</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Added By</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Added On</th>
              <th className="text-center p-3 text-sm font-medium text-gray-600">Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            {attachments.map((att, index) => (
              <motion.tr
                key={att.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 text-sm">{att.file_name}</td>
                <td className="p-3 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {att.file_type}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-600">{att.file_path}</td>
                <td className="p-3 text-sm">{att.added_by}</td>
                <td className="p-3 text-sm">{att.added_on}</td>
                <td className="p-3 text-center text-xl">{att.thumbnail}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttachmentsPanel
