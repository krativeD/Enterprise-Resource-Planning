import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../services/supabase'

export const useProcurementData = () => {
  const [purchaseRequests, setPurchaseRequests] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [supplierInvoices, setSupplierInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const stats = {
    totalRequests: purchaseRequests.length,
    pendingApprovals: purchaseRequests.filter(r => r.status === 'pending').length,
    activeOrders: purchaseOrders.filter(o => o.status === 'issued').length,
    totalSuppliers: suppliers.length,
    pendingDeliveries: deliveries.filter(d => d.status === 'in_transit').length,
    totalSpent: purchaseOrders.reduce((sum, po) => sum + (po.total_amount || 0), 0)
  }

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true)
      const [prRes, supRes, poRes, delRes, invRes] = await Promise.all([
        supabase.from('purchase_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('suppliers').select('*').order('company_name'),
        supabase.from('purchase_orders').select('*').order('created_at', { ascending: false }),
        supabase.from('deliveries').select('*').order('created_at', { ascending: false }),
        supabase.from('supplier_invoices').select('*').order('created_at', { ascending: false })
      ])

      setPurchaseRequests(prRes.data || [])
      setSuppliers(supRes.data || [])
      setPurchaseOrders(poRes.data || [])
      setDeliveries(delRes.data || [])
      setSupplierInvoices(invRes.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAllData() }, [fetchAllData])

  const createPurchaseRequest = async (data) => {
    const { data: newPR, error } = await supabase.from('purchase_requests').insert([data]).select()
    if (error) throw error
    setPurchaseRequests(prev => [newPR[0], ...prev])
    return newPR[0]
  }

  const updatePurchaseRequest = async (id, updates) => {
    const { data, error } = await supabase.from('purchase_requests').update(updates).eq('id', id).select()
    if (error) throw error
    setPurchaseRequests(prev => prev.map(r => r.id === id ? data[0] : r))
  }

  const deletePurchaseRequest = async (id) => {
    await supabase.from('purchase_requests').delete().eq('id', id)
    setPurchaseRequests(prev => prev.filter(r => r.id !== id))
  }

  const createPurchaseOrder = async (data) => {
    const { data: newPO, error } = await supabase.from('purchase_orders').insert([data]).select()
    if (error) throw error
    setPurchaseOrders(prev => [newPO[0], ...prev])
    return newPO[0]
  }

  const updatePurchaseOrder = async (id, updates) => {
    const { data, error } = await supabase.from('purchase_orders').update(updates).eq('id', id).select()
    if (error) throw error
    setPurchaseOrders(prev => prev.map(o => o.id === id ? data[0] : o))
  }

  const addSupplier = async (data) => {
    const { data: newSup, error } = await supabase.from('suppliers').insert([data]).select()
    if (error) throw error
    setSuppliers(prev => [...prev, newSup[0]])
    return newSup[0]
  }

  const updateSupplier = async (id, updates) => {
    const { data, error } = await supabase.from('suppliers').update(updates).eq('id', id).select()
    if (error) throw error
    setSuppliers(prev => prev.map(s => s.id === id ? data[0] : s))
  }

  const deleteSupplier = async (id) => {
    await supabase.from('suppliers').delete().eq('id', id)
    setSuppliers(prev => prev.filter(s => s.id !== id))
  }

  const recordDelivery = async (data) => {
    const { data: newDel, error } = await supabase.from('deliveries').insert([data]).select()
    if (error) throw error
    setDeliveries(prev => [newDel[0], ...prev])
    return newDel[0]
  }

  const recordSupplierInvoice = async (data) => {
    const { data: newInv, error } = await supabase.from('supplier_invoices').insert([data]).select()
    if (error) throw error
    setSupplierInvoices(prev => [newInv[0], ...prev])
    return newInv[0]
  }

  return {
    purchaseRequests, suppliers, purchaseOrders, deliveries, supplierInvoices,
    loading, error, stats,
    createPurchaseRequest, updatePurchaseRequest, deletePurchaseRequest,
    createPurchaseOrder, updatePurchaseOrder,
    addSupplier, updateSupplier, deleteSupplier,
    recordDelivery, recordSupplierInvoice,
    refreshData: fetchAllData
  }
}
