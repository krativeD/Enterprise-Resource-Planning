import { useState, useEffect } from 'react'
import { supabase } from '../../../services/supabase'

export const useEmployeeData = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmployees(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addEmployee = async (employeeData) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()

      if (error) throw error
      setEmployees(prev => [data[0], ...prev])
      return data[0]
    } catch (err) {
      throw err
    }
  }

  const updateEmployee = async (id, employeeData) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', id)
        .select()

      if (error) throw error
      setEmployees(prev => prev.map(emp => emp.id === id ? data[0] : emp))
      return data[0]
    } catch (err) {
      throw err
    }
  }

  const archiveEmployee = async (id) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ status: 'archived', archived_at: new Date() })
        .eq('id', id)

      if (error) throw error
      setEmployees(prev => prev.filter(emp => emp.id !== id))
    } catch (err) {
      throw err
    }
  }

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    archiveEmployee,
    refreshEmployees: fetchEmployees
  }
}
