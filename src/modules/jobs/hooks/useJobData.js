import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../services/supabase'

export const useJobData = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    inProgress: jobs.filter(j => j.status === 'in_progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    urgent: jobs.filter(j => j.priority === 'urgent').length,
    todayTotal: jobs.filter(j => j.scheduled_date === new Date().toISOString().split('T')[0]).length
  }

  const fetchJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobs(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('jobs-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' },
        () => fetchJobs()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchJobs])

  const createJob = async (jobData) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...jobData, job_id: `JOB-${Date.now()}`, status: 'pending' }])
      .select()

    if (error) throw error
    setJobs(prev => [data[0], ...prev])
    return data[0]
  }

  const updateJob = async (id, updates) => {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    setJobs(prev => prev.map(j => j.id === id ? data[0] : j))
  }

  const assignJob = async (jobId, cleanerIds) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        assigned_to: cleanerIds, 
        status: 'assigned',
        assigned_at: new Date()
      })
      .eq('id', jobId)
      .select()

    if (error) throw error
    setJobs(prev => prev.map(j => j.id === jobId ? data[0] : j))
  }

  const completeJob = async (jobId) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        status: 'completed', 
        completed_at: new Date() 
      })
      .eq('id', jobId)
      .select()

    if (error) throw error
    setJobs(prev => prev.map(j => j.id === jobId ? data[0] : j))
  }

  const cancelJob = async (jobId, reason) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        status: 'cancelled', 
        cancellation_reason: reason,
        cancelled_at: new Date() 
      })
      .eq('id', jobId)
      .select()

    if (error) throw error
    setJobs(prev => prev.map(j => j.id === jobId ? data[0] : j))
  }

  return {
    jobs,
    loading,
    error,
    stats,
    createJob,
    updateJob,
    assignJob,
    completeJob,
    cancelJob,
    refreshJobs: fetchJobs
  }
}
