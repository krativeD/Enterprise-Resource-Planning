import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../services/supabase'

export const useFinanceData = () => {
  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [payments, setPayments] = useState([])
  const [financialData, setFinancialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true)
      
      const [invRes, expRes, payRes] = await Promise.all([
        supabase.from('invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('payments').select('*').order('payment_date', { ascending: false })
      ])

      if (invRes.error) throw invRes.error
      if (expRes.error) throw expRes.error
      if (payRes.error) throw payRes.error

      setInvoices(invRes.data || [])
      setExpenses(expRes.data || [])
      setPayments(payRes.data || [])

      // Calculate financial summary
      const totalRevenue = invRes.data?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0
      const totalExpenses = expRes.data?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0
      const totalPayments = payRes.data?.reduce((sum, pay) => sum + (pay.amount || 0), 0) || 0
      const outstandingInvoices = invRes.data?.filter(inv => inv.payment_status !== 'paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0) || 0

      setFinancialData({
        totalRevenue,
        totalExpenses,
        totalPayments,
        outstandingInvoices,
        netProfit: totalRevenue - totalExpenses,
        cashInBank: totalPayments - totalExpenses
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const createInvoice = async (data) => {
    const { data: newInv, error } = await supabase
      .from('invoices')
      .insert([data])
      .select()
    if (error) throw error
    setInvoices(prev => [newInv[0], ...prev])
    return newInv[0]
  }

  const updateInvoice = async (id, updates) => {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw error
    setInvoices(prev => prev.map(inv => inv.id === id ? data[0] : inv))
  }

  const deleteInvoice = async (id) => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
    if (error) throw error
    setInvoices(prev => prev.filter(inv => inv.id !== id))
  }

  const addExpense = async (data) => {
    const { data: newExp, error } = await supabase
      .from('expenses')
      .insert([data])
      .select()
    if (error) throw error
    setExpenses(prev => [newExp[0], ...prev])
    return newExp[0]
  }

  const recordPayment = async (data) => {
    const { data: newPay, error } = await supabase
      .from('payments')
      .insert([data])
      .select()
    if (error) throw error
    setPayments(prev => [newPay[0], ...prev])

    // Update invoice payment status
    if (data.invoice_id) {
      await supabase
        .from('invoices')
        .update({ 
          paid_amount: supabase.raw(`paid_amount + ${data.amount}`),
          payment_status: 'paid'
        })
        .eq('id', data.invoice_id)
    }
    
    return newPay[0]
  }

  return {
    invoices,
    expenses,
    payments,
    financialData,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    addExpense,
    recordPayment,
    refreshData: fetchAllData
  }
}
