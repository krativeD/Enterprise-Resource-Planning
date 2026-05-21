import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MdPeople, MdAdd, MdArchive, MdBadge, MdAttachFile,
  MdVisibility, MdFolderOpen, MdDelete, MdAddAPhoto
} from 'react-icons/md'
import { supabase } from '../../../services/supabase'
import PayrollDashboard from './PayrollDashboard'
import './EmployeeManager.css'

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [activeTab, setActiveTab] = useState('general')
  const [showPayroll, setShowPayroll] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchId, setSearchId] = useState('')
  const [attachments, setAttachments] = useState([])
  const [employeeImage, setEmployeeImage] = useState('https://cdn-icons-png.flaticon.com/512/847/847969.png')
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  // Form data
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    email: '',
    cell_phone: '',
    status: 'Active',
    other_phone: '',
    position: ''
  })

  useEffect(() => {
    loadEmployees()
    loadAttachments()
  }, [])

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data && data.length > 0) {
        setEmployees(data)
        setSelectedEmployee(data[0])
        populateForm(data[0])
      }
    } catch (error) {
      console.error('Error loading employees:', error)
    }
  }

  const loadAttachments = () => {
    setAttachments([
      { file_name: 'contract_2024.pdf', file_type: 'PDF', file_path: 'C:/documents/hr/', added_by: 'Admin', added_on: '2026-05-21', thumbnail: '📄' },
      { file_name: 'id_document.pdf', file_type: 'PDF', file_path: 'C:/documents/hr/', added_by: 'HR Manager', added_on: '2026-05-20', thumbnail: '📄' },
      { file_name: 'certification.pdf', file_type: 'PDF', file_path: 'C:/documents/hr/', added_by: 'Admin', added_on: '2026-05-19', thumbnail: '📄' },
      { file_name: 'training_record.pdf', file_type: 'PDF', file_path: 'C:/documents/hr/', added_by: 'Supervisor', added_on: '2026-05-18', thumbnail: '📄' },
      { file_name: 'performance_review.pdf', file_type: 'PDF', file_path: 'C:/documents/hr/', added_by: 'Admin', added_on: '2026-05-17', thumbnail: '📄' }
    ])
  }

  const populateForm = (emp) => {
    setFormData({
      last_name: emp.last_name || '',
      first_name: emp.first_name || '',
      address: emp.address || '',
      city: emp.city || '',
      state: emp.state || '',
      zip_code: emp.zip_code || '',
      email: emp.email || '',
      cell_phone: emp.cell_phone || '',
      status: emp.status || 'Active',
      other_phone: emp.other_phone || '',
      position: emp.position || ''
    })
    if (emp.image_url) {
      setEmployeeImage(emp.image_url)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = async () => {
    if (!searchTerm && !searchId) {
      loadEmployees()
      return
    }
    try {
      let query = supabase.from('employees').select('*')
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
      }
      if (searchId) {
        query = query.eq('employee_id', searchId)
      }
      const { data } = await query
      if (data && data.length > 0) {
        setEmployees(data)
        setSelectedEmployee(data[0])
        populateForm(data[0])
      }
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const handleAddNew = () => {
    setSelectedEmployee(null)
    setFormData({
      last_name: '', first_name: '', address: '', city: '', state: '',
      zip_code: '', email: '', cell_phone: '', status: 'Active',
      other_phone: '', position: ''
    })
    setEmployeeImage('https://cdn-icons-png.flaticon.com/512/847/847969.png')
  }

  const handleSave = async () => {
    try {
      if (selectedEmployee) {
        await supabase.from('employees').update(formData).eq('id', selectedEmployee.id)
      } else {
        await supabase.from('employees').insert([{
          ...formData,
          employee_id: `EMP-${Date.now().toString(36).toUpperCase()}`,
          image_url: employeeImage
        }])
      }
      loadEmployees()
      alert('Employee saved successfully!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving employee')
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setEmployeeImage(event.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAddAttachment = () => {
    const newAttachment = {
      file_name: `new_document_${Date.now()}.pdf`,
      file_type: 'PDF',
      file_path: 'C:/documents/hr/',
      added_by: 'Current User',
      added_on: new Date().toISOString().split('T')[0],
      thumbnail: '📄'
    }
    setAttachments(prev => [...prev, newAttachment])
  }

  const tabs = [
    { id: 'general', label: 'General Info' },
    { id: 'timeclock', label: 'Time Clock History' },
    { id: 'payrollHistory', label: 'Payroll History' },
    { id: 'payrollDetails', label: 'Payroll & Details' },
    { id: 'scheduling', label: 'Scheduling' },
    { id: 'leave', label: 'Leave' },
    { id: 'events', label: 'Events' }
  ]

  if (showPayroll) {
    return <PayrollDashboard onBack={() => setShowPayroll(false)} />
  }

  return (
    <div className="employee-manager-wrapper">
      {/* Title */}
      <div className="em-top-title">
        <div className="em-users-icon">👥</div>
        <h1>Employee Manager</h1>
      </div>

      {/* Top Bar */}
      <div className="em-top-bar">
        <span className="em-label">Employee:</span>
        <input 
          className="em-input em-employee-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by name..."
        />

        <button className="em-neo-btn" onClick={handleAddNew}>
          ➕ Add New
        </button>
        <button className="em-neo-btn" onClick={() => loadEmployees()}>
          📦 Archive
        </button>

        <span className="em-label">Empl. ID:</span>
        <input 
          className="em-input em-id-input"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="EMP ID"
        />

        <button className="em-neo-btn">🪪 ID Cards</button>
        <button 
          className="em-neo-btn"
          onClick={() => setShowPayroll(true)}
          style={{ background: 'linear-gradient(to bottom,#2d8f4e,#1a5c32)' }}
        >
          💰 Payroll
        </button>
        <button className="em-neo-btn" onClick={handleSave}>
          💾 Save
        </button>
      </div>

      {/* Tabs */}
      <div className="em-tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`em-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="em-content">
        {/* Form Grid */}
        <div>
          <div className="em-form-grid">
            <div className="em-cell em-label-cell">Last Name:</div>
            <div className="em-cell">
              <input name="last_name" value={formData.last_name} onChange={handleInputChange} />
            </div>
            <div className="em-cell em-label-cell">First Name:</div>
            <div className="em-cell">
              <input name="first_name" value={formData.first_name} onChange={handleInputChange} />
            </div>

            <div className="em-cell em-label-cell">Address:</div>
            <div className="em-cell" style={{ gridColumn: 'span 3' }}>
              <input name="address" value={formData.address} onChange={handleInputChange} />
            </div>

            <div className="em-cell em-label-cell">City:</div>
            <div className="em-cell">
              <input name="city" value={formData.city} onChange={handleInputChange} />
            </div>
            <div className="em-cell em-label-cell">State:</div>
            <div className="em-cell">
              <input name="state" value={formData.state} onChange={handleInputChange} />
            </div>

            <div className="em-cell em-label-cell">Zip Code:</div>
            <div className="em-cell">
              <input name="zip_code" value={formData.zip_code} onChange={handleInputChange} />
            </div>
            <div className="em-cell em-label-cell">Email:</div>
            <div className="em-cell">
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>

            <div className="em-cell em-label-cell">Cell Phone:</div>
            <div className="em-cell">
              <input name="cell_phone" value={formData.cell_phone} onChange={handleInputChange} />
            </div>
            <div className="em-cell em-label-cell">Status:</div>
            <div className="em-cell">
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option>Active</option>
                <option>Inactive</option>
                <option>On Leave</option>
                <option>Terminated</option>
              </select>
            </div>

            <div className="em-cell em-label-cell">Other Phone:</div>
            <div className="em-cell">
              <input name="other_phone" value={formData.other_phone} onChange={handleInputChange} />
            </div>
            <div className="em-cell em-label-cell">Type / Position:</div>
            <div className="em-cell">
              <select name="position" value={formData.position} onChange={handleInputChange}>
                <option value="">Select Position</option>
                <option>Cleaner</option>
                <option>Supervisor</option>
                <option>HR Manager</option>
                <option>Admin</option>
                <option>Accountant</option>
                <option>Driver</option>
                <option>Team Leader</option>
              </select>
            </div>
          </div>

          {/* Attachments */}
          <div className="em-attachments">
            <div className="em-attachment-top">
              <button className="em-neo-btn" onClick={handleAddAttachment}>📎 Add Att.</button>
              <button className="em-neo-btn">👁 Show All Att.</button>
              <button className="em-neo-btn">📂 Open Att.</button>
              <button className="em-neo-btn">❌ Delete Att.</button>
            </div>

            <table className="em-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>File Path</th>
                  <th>Added By</th>
                  <th>Added On</th>
                  <th>Thumbnail</th>
                </tr>
              </thead>
              <tbody>
                {attachments.map((att, i) => (
                  <tr key={i}>
                    <td>{att.file_name}</td>
                    <td>{att.file_type}</td>
                    <td>{att.file_path}</td>
                    <td>{att.added_by}</td>
                    <td>{att.added_on}</td>
                    <td>{att.thumbnail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Photo Panel */}
        <div className="em-photo-panel">
          <div className="em-photo-box">
            <img src={employeeImage} alt="Employee" />
          </div>
          <input 
            type="file" 
            ref={imageInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div 
            className="em-add-picture"
            onClick={() => imageInputRef.current?.click()}
          >
            ➕ Add Picture
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div style={{ marginTop: '15px', border: '1px solid #2f73b8', background: 'white', maxHeight: '200px', overflowY: 'auto' }}>
        <table className="em-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr 
                key={emp.id} 
                onClick={() => { setSelectedEmployee(emp); populateForm(emp) }}
                style={{ 
                  cursor: 'pointer',
                  background: selectedEmployee?.id === emp.id ? '#fffde3' : 'white'
                }}
              >
                <td>{emp.employee_id}</td>
                <td>{emp.first_name} {emp.last_name}</td>
                <td>{emp.position}</td>
                <td>{emp.status}</td>
                <td>{emp.cell_phone}</td>
                <td>{emp.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeManager
