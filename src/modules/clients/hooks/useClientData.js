import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../services/supabase'

export const useClientData = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    prospects: clients.filter(c => c.status === 'prospect').length,
    withContracts: clients.filter(c => c.contract_active).length,
    totalRevenue: clients.reduce((sum, c) => sum + (c.total_revenue || 0), 0)
  }

  const fetchClients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const createClient = async (clientData) => {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()

    if (error) throw error
    setClients(prev => [data[0], ...prev])
    return data[0]
  }

  const updateClient = async (id, updates) => {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    setClients(prev => prev.map(c => c.id === id ? data[0] : c))
  }

  const deleteClient = async (id) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error
    setClients(prev => prev.filter(c => c.id !== id))
  }

  return {
    clients, loading, error, stats,
    createClient, updateClient, deleteClient,
    refreshClients: fetchClients
  }
}
