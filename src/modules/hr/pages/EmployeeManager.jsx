import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../services/supabase'
import { useToast } from '../../../hooks/useToast'
import PayrollDashboard from './PayrollDashboard'
import TimeClockHistory from '../components/TimeClockHistory'
import PayrollHistory from '../components/PayrollHistory'
import PayrollDetailsView from '../components/PayrollDetailsView'
import SchedulingPanel from '../components/SchedulingPanel'
import LeaveManagement from '../components/LeaveManagement'
import EventsPanel from '../components/EventsPanel'
import IDCardGenerator from '../components/IDCardGenerator'
import './EmployeeManager.css'

const EmployeeManager = () => {
  // ============ STATE MANAGEMENT ============
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [activeTab, setActiveTab] = useState('general')
  const [showPayroll, setShowPayroll] = useState(false)
  const [showIDCard, setShowIDCard] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [archivedEmployees, setArchivedEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchId, setSearchId] = useState('')
  const [attachments, setAttachments] = useState([])
  const [employeeImage, setEmployeeImage] = useState('https://cdn-icons-png.flaticon.com/512/847/847969.png')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAllAttachments, setShowAllAttachments] = useState(false)
  
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const attachmentInputRef = useRef(null)
  const { showToast, ToastContainer } = useToast()

  // ============ FORM DATA ============
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
    position: '',
    department: '',
    hire_date: '',
    pay_type: 'Hourly',
    salary_frequency: 'Monthly',
    hourly_amount: '',
    overtime_amount: '',
    gender: 'Male',
    employee_id: ''
  })

  // ============ INITIAL LOAD ============
  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    if (selectedEmployee) {
      loadAttachments(selectedEmployee.id)
    }
  }, [selectedEmployee])

  // ============ EMPLOYEE CRUD OPERATIONS ============
  const loadEmployees = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .neq('status', 'Archived')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      if (data && data.length > 0) {
        setEmployees(data)
        if (!selectedEmployee) {
          setSelectedEmployee(data[0])
          populateForm(data[0])
          loadAttachments(data[0].id)
        }
      } else {
        setEmployees([])
      }
    } catch (error) {
      console.error('Error loading employees:', error)
      showToast('Error loading employees: ' + error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNew = () => {
    setSelectedEmployee(null)
    setEmployeeImage('https://cdn-icons-png.flaticon.com/512/847/847969.png')
    setAttachments([])
    setFormData({
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
      position: '',
      department: '',
      hire_date: '',
      pay_type: 'Hourly',
      salary_frequency: 'Monthly',
      hourly_amount: '',
      overtime_amount: '',
      gender: 'Male',
      employee_id: ''
    })
    showToast('Ready to add new employee', 'info')
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.first_name || !formData.last_name) {
      showToast('First Name and Last Name are required', 'warning')
      return
    }

    setIsSaving(true)
    try {
      // Generate employee ID if new
      const employeeData = {
        ...formData,
        image_url: employeeImage,
        employee_id: selectedEmployee?.employee_id || `EMP-${Date.now().toString(36).toUpperCase()}`,
        updated_at: new Date().toISOString()
      }

      let result
      if (selectedEmployee) {
        // Update existing employee
        const { data, error } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', selectedEmployee.id)
          .select()

        if (error) throw error
        result = data[0]
        showToast('Employee updated successfully!', 'success')
      } else {
        // Create new employee
        const { data, error } = await supabase
          .from('employees')
          .insert([{
            ...employeeData,
            created_at: new Date().toISOString()
          }])
          .select()

        if (error) throw error
        result = data[0]
        showToast('Employee created successfully!', 'success')
      }

      // Upload image if changed
      if (employeeImage && employeeImage.startsWith('data:')) {
        await uploadEmployeeImage(result.id, employeeImage)
      }

      await loadEmployees()
      setSelectedEmployee(result)
      populateForm(result)
    } catch (error) {
      console.error('Save error:', error)
      showToast('Error saving employee: ' + error.message, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // ============ IMAGE UPLOAD ============
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'warning')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'warning')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setEmployeeImage(event.target.result)
        showToast('Image ready to upload', 'info')
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadEmployeeImage = async (employeeId, base64Image) => {
    try {
      // Convert base64 to blob
      const response = await fetch(base64Image)
      const blob = await response.blob()
      
      const fileName = `employee-${employeeId}-${Date.now()}.jpg`
      const filePath = `employee-photos/${fileName}`

      const { data, error } = await supabase.storage
        .from('employee-documents')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(filePath)

      // Update employee record with image URL
      await supabase
        .from('employees')
        .update({ image_url: publicUrl })
        .eq('id', employeeId)

      setEmployeeImage(publicUrl)
      showToast('Image uploaded successfully!', 'success')
    } catch (error) {
      console.error('Image upload error:', error)
      showToast('Error uploading image', 'error')
    }
  }

  // ============ ATTACHMENT MANAGEMENT ============
  const loadAttachments = async (employeeId) => {
    if (!employeeId) return
    
    try {
      const { data, error } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAttachments(data || [])
    } catch (error) {
      console.error('Error loading attachments:', error)
      setAttachments([])
    }
  }

  const handleAddAttachment = () => {
    attachmentInputRef.current?.click()
  }

  const handleAttachmentUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !selectedEmployee) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size should be less than 10MB', 'warning')
      return
    }

    setIsLoading(true)
    try {
      const fileName = `${selectedEmployee.id}/${Date.now()}-${file.name}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(fileName)

      // Get file extension
      const fileExtension = file.name.split('.').pop().toUpperCase()
      
      // Determine thumbnail
      const thumbnailMap = {
        'PDF': '📄',
        'DOC': '📝',
        'DOCX': '📝',
        'XLS': '📊',
        'XLSX': '📊',
        'JPG': '🖼️',
        'JPEG': '🖼️',
        'PNG': '🖼️',
        'GIF': '🖼️',
        'TXT': '📃',
        'CSV': '📊'
      }

      // Save attachment record to database
      const { data: docData, error: docError } = await supabase
        .from('employee_documents')
        .insert([{
          employee_id: selectedEmployee.id,
          file_name: file.name,
          file_type: fileExtension,
          file_path: publicUrl,
          file_size: file.size,
          added_by: 'Current User',
          thumbnail: thumbnailMap[fileExtension] || '📎',
          created_at: new Date().toISOString()
        }])
        .select()

      if (docError) throw docError

      setAttachments(prev => [docData[0], ...prev])
      showToast('Attachment added successfully!', 'success')
    } catch (error) {
      console.error('Attachment upload error:', error)
      showToast('Error uploading attachment: ' + error.message, 'error')
    } finally {
      setIsLoading(false)
      // Reset file input
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = ''
      }
    }
  }

  const handleOpenAttachment = async (attachment) => {
    if (attachment.file_path) {
      window.open(attachment.file_path, '_blank')
    } else {
      showToast('File path not available', 'warning')
    }
  }

  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) return

    try {
      // Find attachment to get file path
      const attachment = attachments.find(a => a.id === attachmentId)
      
      // Delete from storage if path exists
      if (attachment?.file_path) {
        const urlParts = attachment.file_path.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const bucketPath = `employee-documents/${selectedEmployee.id}/${fileName}`
        
        // Try to delete from storage (may fail if file doesn't exist)
        try {
          await supabase.storage
            .from('employee-documents')
            .remove([`${selectedEmployee.id}/${fileName}`])
        } catch (storageError) {
          console.warn('Storage file may not exist:', storageError)
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', attachmentId)

      if (error) throw error

      setAttachments(prev => prev.filter(a => a.id !== attachmentId))
      showToast('Attachment deleted successfully!', 'success')
    } catch (error) {
      console.error('Delete attachment error:', error)
      showToast('Error deleting attachment', 'error')
    }
  }

  const handleShowAllAttachments = () => {
    setShowAllAttachments(!showAllAttachments)
  }

  // ============ ARCHIVE MANAGEMENT ============
  const handleArchive = async () => {
    setShowArchiveModal(true)
    await loadArchivedEmployees()
  }

  const loadArchivedEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'Archived')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setArchivedEmployees(data || [])
    } catch (error) {
      console.error('Error loading archived employees:', error)
      showToast('Error loading archived employees', 'error')
    }
  }

  const handleArchiveEmployee = async () => {
    if (!selectedEmployee) {
      showToast('Please select an employee to archive', 'warning')
      return
    }

    if (!window.confirm(`Are you sure you want to archive ${selectedEmployee.first_name} ${selectedEmployee.last_name}?`)) return

    try {
      const { error } = await supabase
        .from('employees')
        .update({ 
          status: 'Archived', 
          archived_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedEmployee.id)

      if (error) throw error

      showToast('Employee archived successfully!', 'success')
      setShowArchiveModal(false)
      setSelectedEmployee(null)
      await loadEmployees()
    } catch (error) {
      console.error('Archive error:', error)
      showToast('Error archiving employee', 'error')
    }
  }

  const handleRestoreEmployee = async (employeeId) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ 
          status: 'Active', 
          archived_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId)

      if (error) throw error

      showToast('Employee restored successfully!', 'success')
      await loadArchivedEmployees()
      await loadEmployees()
    } catch (error) {
      console.error('Restore error:', error)
      showToast('Error restoring employee', 'error')
    }
  }

  // ============ SEARCH FUNCTIONALITY ============
  const handleSearch = async () => {
    if (!searchTerm && !searchId) {
      await loadEmployees()
      return
    }

    setIsLoading(true)
    try {
      let query = supabase.from('employees').select('*').neq('status', 'Archived')
      
      if (searchTerm) {
        const terms = searchTerm.trim().split(' ')
        if (terms.length === 1) {
          query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%`)
        } else {
          query = query.or(`first_name.ilike.%${terms[0]}%,last_name.ilike.%${terms[1]}%`)
        }
      }
      
      if (searchId) {
        query = query.ilike('employee_id', `%${searchId}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        setEmployees(data)
        setSelectedEmployee(data[0])
        populateForm(data[0])
        loadAttachments(data[0].id)
        showToast(`Found ${data.length} employee(s)`, 'info')
      } else {
        setEmployees([])
        showToast('No employees found', 'warning')
      }
    } catch (error) {
      console.error('Search error:', error)
      showToast('Error searching employees', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // ============ ID CARD GENERATION ============
  const handleGenerateIDCard = () => {
    if (!selectedEmployee) {
      showToast('Please select an employee first', 'warning')
      return
    }
    setShowIDCard(true)
  }

  // ============ FORM HANDLING ============
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
      position: emp.position || '',
      department: emp.department || '',
      hire_date: emp.hire_date || '',
      pay_type: emp.pay_type || 'Hourly',
      salary_frequency: emp.salary_frequency || 'Monthly',
      hourly_amount: emp.hourly_amount || '',
      overtime_amount: emp.overtime_amount || '',
      gender: emp.gender || 'Male',
      employee_id: emp.employee_id || ''
    })
    if (emp.image_url) {
      setEmployeeImage(emp.image_url)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEmployeeSelect = (emp) => {
    setSelectedEmployee(emp)
    populateForm(emp)
    loadAttachments(emp.id)
  }

  // ============ TAB DEFINITIONS ============
  const tabs = [
    { id: 'general', label: 'General Info' },
    { id: 'timeclock', label: 'Time Clock History' },
    { id: 'payrollHistory', label: 'Payroll History' },
    { id: 'payrollDetails', label: 'Payroll & Details' },
    { id: 'scheduling', label: 'Scheduling' },
    { id: 'leave', label: 'Leave' },
    { id: 'events', label: 'Events' }
  ]

  // ============ RENDER TAB CONTENT ============
  const renderTabContent = () => {
    if (!selectedEmployee && activeTab !== 'general') {
      return (
        <div className="em-empty-state">
          <div className="em-empty-icon">👤</div>
          <div className="em-empty-text">No Employee Selected</div>
          <div className="em-empty-subtext">Please select an employee to view this information</div>
        </div>
      )
    }

    switch (activeTab) {
      case 'general':
        return renderGeneralInfo()
      case 'timeclock':
        return <TimeClockHistory employeeId={selectedEmployee?.id} />
      case 'payrollHistory':
        return <PayrollHistory employeeId={selectedEmployee?.id} />
      case 'payrollDetails':
        return <PayrollDetailsView employee={selectedEmployee} />
      case 'scheduling':
        return <SchedulingPanel employeeId={selectedEmployee?.id} />
      case 'leave':
        return <LeaveManagement employeeId={selectedEmployee?.id} />
      case 'events':
        return <EventsPanel employeeId={selectedEmployee?.id} />
      default:
        return null
    }
  }

  const renderGeneralInfo = () => {
    return (
      <>
        <div className="em-form-grid">
          <div className="em-cell em-label-cell">Last Name:</div>
          <div className="em-cell">
            <input name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Enter last name" />
          </div>
          <div className="em-cell em-label-cell">First Name:</div>
          <div className="em-cell">
            <input name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Enter first name" />
          </div>

          <div className="em-cell em-label-cell">Address:</div>
          <div className="em-cell" style={{ gridColumn: 'span 3' }}>
            <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter address" />
          </div>

          <div className="em-cell em-label-cell">City:</div>
          <div className="em-cell">
            <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
          </div>
          <div className="em-cell em-label-cell">State:</div>
          <div className="em-cell">
            <input name="state" value={formData.state} onChange={handleInputChange} placeholder="State" />
          </div>

          <div className="em-cell em-label-cell">Zip Code:</div>
          <div className="em-cell">
            <input name="zip_code" value={formData.zip_code} onChange={handleInputChange} placeholder="Zip code" />
          </div>
          <div className="em-cell em-label-cell">Email:</div>
          <div className="em-cell">
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" />
          </div>

          <div className="em-cell em-label-cell">Cell Phone:</div>
          <div className="em-cell">
            <input name="cell_phone" value={formData.cell_phone} onChange={handleInputChange} placeholder="Phone number" />
          </div>
          <div className="em-cell em-label-cell">Status:</div>
          <div className="em-cell">
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          <div className="em-cell em-label-cell">Other Phone:</div>
          <div className="em-cell">
            <input name="other_phone" value={formData.other_phone} onChange={handleInputChange} placeholder="Alternative phone" />
          </div>
          <div className="em-cell em-label-cell">Type / Position:</div>
          <div className="em-cell">
            <select name="position" value={formData.position} onChange={handleInputChange}>
              <option value="">Select Position</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Team Leader">Team Leader</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Admin">Admin</option>
              <option value="Accountant">Accountant</option>
              <option value="Driver">Driver</option>
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Procurement Officer">Procurement Officer</option>
            </select>
          </div>

          <div className="em-cell em-label-cell">Department:</div>
          <div className="em-cell">
            <select name="department" value={formData.department} onChange={handleInputChange}>
              <option value="">Select Department</option>
              <option value="Operations">Operations</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Admin">Admin</option>
              <option value="Sales">Sales</option>
              <option value="Procurement">Procurement</option>
            </select>
          </div>
          <div className="em-cell em-label-cell">Hire Date:</div>
          <div className="em-cell">
            <input name="hire_date" type="date" value={formData.hire_date} onChange={handleInputChange} />
          </div>

          <div className="em-cell em-label-cell">Gender:</div>
          <div className="em-cell">
            <select name="gender" value={formData.gender} onChange={handleInputChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="em-cell em-label-cell">Pay Type:</div>
          <div className="em-cell">
            <select name="pay_type" value={formData.pay_type} onChange={handleInputChange}>
              <option value="Hourly">Hourly</option>
              <option value="Salary">Salary</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="em-cell em-label-cell">Hourly Rate:</div>
          <div className="em-cell">
            <input name="hourly_amount" type="number" value={formData.hourly_amount} onChange={handleInputChange} placeholder="0.00" step="0.01" />
          </div>
          <div className="em-cell em-label-cell">OT Rate:</div>
          <div className="em-cell">
            <input name="overtime_amount" type="number" value={formData.overtime_amount} onChange={handleInputChange} placeholder="0.00" step="0.01" />
          </div>

          <div className="em-cell em-label-cell">Employee ID:</div>
          <div className="em-cell">
            <input 
              name="employee_id" 
              value={formData.employee_id} 
              onChange={handleInputChange} 
              placeholder="Auto-generated" 
              disabled={!!selectedEmployee}
              style={{ background: selectedEmployee ? '#e8e8e8' : '#fffde3' }}
            />
          </div>
          <div className="em-cell em-label-cell">Salary Freq:</div>
          <div className="em-cell">
            <select name="salary_frequency" value={formData.salary_frequency} onChange={handleInputChange}>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>
      </>
    )
  }

  // ============ PAYROLL NAVIGATION ============
  if (showPayroll) {
    return <PayrollDashboard onBack={() => setShowPayroll(false)} selectedEmployee={selectedEmployee} />
  }

  // ============ MAIN RENDER ============
  return (
    <div className="employee-manager-wrapper">
      <ToastContainer />

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
          onKeyDown={handleSearchKeyDown}
          placeholder="Search by name or position..."
        />

        <button className="em-neo-btn" onClick={handleAddNew}>
          ➕ Add New
        </button>
        <button className="em-neo-btn" onClick={handleArchive}>
          📦 Archive
        </button>

        <span className="em-label">Empl. ID:</span>
        <input 
          className="em-input em-id-input"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="EMP ID"
        />

        <button className="em-neo-btn" onClick={handleGenerateIDCard}>
          🪪 ID Cards
        </button>
        <button 
          className="em-neo-btn em-neo-btn-green"
          onClick={() => setShowPayroll(true)}
        >
          💰 Payroll
        </button>
        <button 
          className="em-neo-btn"
          onClick={handleSave}
          disabled={isSaving}
          style={{ opacity: isSaving ? 0.7 : 1 }}
        >
          {isSaving ? '⏳ Saving...' : '💾 Save'}
        </button>
        <button 
          className="em-neo-btn"
          onClick={handleSearch}
        >
          🔍 Search
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
        <div>
          {/* Loading Overlay */}
          {isLoading && (
            <div className="em-loading-overlay">
              <div className="neo-spinner"></div>
            </div>
          )}

          {/* Tab Content */}
          {renderTabContent()}

          {/* Attachments (only show on General Info tab) */}
          {activeTab === 'general' && (
            <div className="em-attachments">
              <div className="em-attachment-top">
                <input 
                  type="file" 
                  ref={attachmentInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleAttachmentUpload}
                />
                <button className="em-neo-btn" onClick={handleAddAttachment}>
                  📎 Add Att.
                </button>
                <button className="em-neo-btn" onClick={handleShowAllAttachments}>
                  👁 {showAllAttachments ? 'Hide All' : 'Show All Att.'}
                </button>
                <button className="em-neo-btn" onClick={() => {
                  if (attachments.length > 0) handleOpenAttachment(attachments[0])
                }}>
                  📂 Open Att.
                </button>
                <button className="em-neo-btn" onClick={() => {
                  if (attachments.length > 0) handleDeleteAttachment(attachments[0].id)
                }}>
                  ❌ Delete Att.
                </button>
              </div>

              {attachments.length === 0 ? (
                <div className="em-empty-attachments">
                  <p>No attachments for this employee</p>
                  <p className="em-empty-subtext">Click "Add Att." to upload documents</p>
                </div>
              ) : (
                <div className="em-table-wrapper" style={{ maxHeight: showAllAttachments ? '400px' : '200px', overflowY: 'auto' }}>
                  <table className="em-table">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>File Type</th>
                        <th>File Path</th>
                        <th>Added By</th>
                        <th>Added On</th>
                        <th>Thumbnail</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attachments.map((att, i) => (
                        <tr key={att.id || i}>
                          <td>
                            <span 
                              className="em-file-link"
                              onClick={() => handleOpenAttachment(att)}
                              title="Click to open"
                            >
                              {att.file_name}
                            </span>
                          </td>
                          <td>{att.file_type}</td>
                          <td className="em-file-path">{att.file_path?.substring(0, 40)}...</td>
                          <td>{att.added_by}</td>
                          <td>{att.added_on || new Date(att.created_at).toISOString().split('T')[0]}</td>
                          <td style={{ textAlign: 'center', fontSize: '20px' }}>{att.thumbnail || '📎'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button 
                                className="em-small-btn"
                                onClick={() => handleOpenAttachment(att)}
                                title="Open"
                              >
                                📂
                              </button>
                              <button 
                                className="em-small-btn em-small-btn-danger"
                                onClick={() => handleDeleteAttachment(att.id)}
                                title="Delete"
                              >
                                ❌
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
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
          {selectedEmployee && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
              ID: {selectedEmployee.employee_id}
            </div>
          )}
        </div>
      </div>

      {/* Employee List */}
      <div className="em-employee-list">
        <div className="em-list-header">
          <span>📋 Employee List ({employees.length})</span>
          <button className="em-neo-btn" onClick={loadEmployees}>
            🔄 Refresh
          </button>
        </div>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <table className="em-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                    {isLoading ? 'Loading...' : 'No employees found'}
                  </td>
                </tr>
              ) : (
                employees.map(emp => (
                  <tr 
                    key={emp.id} 
                    onClick={() => handleEmployeeSelect(emp)}
                    className={selectedEmployee?.id === emp.id ? 'em-selected-row' : ''}
                  >
                    <td>{emp.employee_id}</td>
                    <td>{emp.first_name} {emp.last_name}</td>
                    <td>{emp.position}</td>
                    <td>{emp.department}</td>
                    <td>
                      <span className={`em-status-badge em-status-${emp.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>{emp.cell_phone}</td>
                    <td>{emp.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archive Modal */}
      <AnimatePresence>
        {showArchiveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="em-modal-overlay"
            onClick={() => setShowArchiveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="em-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="em-modal-header">
                <h2>📦 Archived Employees</h2>
                <button onClick={() => setShowArchiveModal(false)} className="em-modal-close">✕</button>
              </div>
              <div className="em-modal-body">
                {selectedEmployee && (
                  <div className="em-archive-warning">
                    <p>Current employee: <strong>{selectedEmployee.first_name} {selectedEmployee.last_name}</strong></p>
                    <button 
                      className="em-neo-btn em-neo-btn-orange"
                      onClick={handleArchiveEmployee}
                    >
                      📦 Archive This Employee
                    </button>
                  </div>
                )}
                
                <h3>Archived Employees ({archivedEmployees.length})</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <table className="em-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Archived Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {archivedEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                            No archived employees
                          </td>
                        </tr>
                      ) : (
                        archivedEmployees.map(emp => (
                          <tr key={emp.id}>
                            <td>{emp.first_name} {emp.last_name}</td>
                            <td>{emp.position}</td>
                            <td>{emp.archived_at ? new Date(emp.archived_at).toLocaleDateString() : 'N/A'}</td>
                            <td>
                              <button 
                                className="em-neo-btn em-neo-btn-green"
                                onClick={() => handleRestoreEmployee(emp.id)}
                              >
                                ↩ Restore
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ID Card Modal */}
      <AnimatePresence>
        {showIDCard && selectedEmployee && (
          <IDCardGenerator
            employee={selectedEmployee}
            onClose={() => setShowIDCard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default EmployeeManager
