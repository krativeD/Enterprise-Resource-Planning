import React from 'react'
import { motion } from 'framer-motion'
import { MdEdit, MdSave, MdCancel } from 'react-icons/md'

const EmployeeForm = ({ employee, editing, setEditing, onSave }) => {
  const [formData, setFormData] = React.useState({
    first_name: employee?.first_name || '',
    last_name: employee?.last_name || '',
    address: employee?.address || '',
    city: employee?.city || '',
    state: employee?.state || '',
    zip_code: employee?.zip_code || '',
    email: employee?.email || '',
    cell_phone: employee?.cell_phone || '',
    other_phone: employee?.other_phone || '',
    gender: employee?.gender || 'Male',
    position: employee?.position || '',
    hire_date: employee?.hire_date || '',
    status: employee?.status || 'Active',
    employee_id: employee?.employee_id || '',
    department: employee?.department || '',
    pay_type: employee?.pay_type || 'Salary',
    salary_frequency: employee?.salary_frequency || 'Monthly',
    hourly_amount: employee?.hourly_amount || '',
    overtime_amount: employee?.overtime_amount || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Employee Information</h3>
        {!editing ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditing(true)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg 
                     hover:bg-blue-600 transition-colors"
          >
            <MdEdit /> <span>Edit</span>
          </motion.button>
        ) : (
          <div className="flex space-x-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg 
                       hover:bg-green-600 transition-colors"
            >
              <MdSave /> <span>Save</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(false)}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg 
                       hover:bg-gray-600 transition-colors"
            >
              <MdCancel /> <span>Cancel</span>
            </motion.button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} disabled={!editing} />
        <FormField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} disabled={!editing} />
        <FormField label="Employee ID" name="employee_id" value={formData.employee_id} onChange={handleChange} disabled={!editing} />
        <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={!editing} />
        <FormField label="Cell Phone" name="cell_phone" value={formData.cell_phone} onChange={handleChange} disabled={!editing} />
        <FormField label="Other Phone" name="other_phone" value={formData.other_phone} onChange={handleChange} disabled={!editing} />
        <FormField label="Address" name="address" value={formData.address} onChange={handleChange} disabled={!editing} />
        <div className="grid grid-cols-3 gap-2">
          <FormField label="City" name="city" value={formData.city} onChange={handleChange} disabled={!editing} />
          <FormField label="State" name="state" value={formData.state} onChange={handleChange} disabled={!editing} />
          <FormField label="Zip Code" name="zip_code" value={formData.zip_code} onChange={handleChange} disabled={!editing} />
        </div>
        <FormSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} disabled={!editing} options={['Male', 'Female', 'Other']} />
        <FormSelect label="Status" name="status" value={formData.status} onChange={handleChange} disabled={!editing} options={['Active', 'Inactive', 'On Leave']} />
        <FormField label="Position" name="position" value={formData.position} onChange={handleChange} disabled={!editing} />
        <FormField label="Department" name="department" value={formData.department} onChange={handleChange} disabled={!editing} />
        <FormField label="Hire Date" name="hire_date" type="date" value={formData.hire_date} onChange={handleChange} disabled={!editing} />
        <FormSelect label="Pay Type" name="pay_type" value={formData.pay_type} onChange={handleChange} disabled={!editing} options={['Salary', 'Hourly', 'Contract']} />
        <FormSelect label="Salary Frequency" name="salary_frequency" value={formData.salary_frequency} onChange={handleChange} disabled={!editing} options={['Weekly', 'Bi-Weekly', 'Monthly']} />
        <FormField label="Hourly Amount" name="hourly_amount" type="number" value={formData.hourly_amount} onChange={handleChange} disabled={!editing} />
        <FormField label="Overtime Amount" name="overtime_amount" type="number" value={formData.overtime_amount} onChange={handleChange} disabled={!editing} />
      </div>
    </form>
  )
}

const FormField = ({ label, name, type = 'text', value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent
               disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
)

const FormSelect = ({ label, name, value, onChange, disabled, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent
               disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
)

export default EmployeeForm
