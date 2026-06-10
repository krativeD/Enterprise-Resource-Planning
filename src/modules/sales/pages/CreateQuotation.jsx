import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../../components/Navbar'
import useSalesStore from '../store/salesStore'
import useCRMStore from '../../crm/store/crmStore'
import useThemeStore from '../../../store/themeStore'
import toast from 'react-hot-toast'
import html2pdf from 'html2pdf.js'
import { 
  FileText, Plus, Trash2, Download, Eye, Printer,
  Sun, Moon, Sparkles, ChevronRight, ArrowLeft,
  Save, Send, Calculator
} from 'lucide-react'

// A4 Quotation Template
function QuotationTemplate({ quotation, items, companyInfo }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount || 0)
  }
  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price * (1 - (item.discount_percent || 0) / 100)), 0)
  const taxAmount = subtotal * 0.15
  const total = subtotal + taxAmount

  return (
    <div style={{
      width: '210mm', minHeight: '297mm', padding: '15mm 20mm',
      backgroundColor: 'white', fontFamily: 'Arial, sans-serif',
      color: '#1e293b', boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '3px solid #2563eb', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '65px', height: '65px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #dbeafe' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '85%', height: '85%', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-size:22px;font-weight:bold;color:#2563eb">NG</span>' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', margin: '0' }}>NDANDULENI GROUP</h1>
            <p style={{ fontSize: '9px', color: '#64748b', margin: '2px 0' }}>Professional Cleaning & Hygiene Services</p>
            <p style={{ fontSize: '8px', color: '#94a3b8', margin: '0' }}>123 Main Street, Johannesburg | +27 11 234 5678</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e3a5f', margin: '0', letterSpacing: '2px' }}>QUOTATION</h2>
          <p style={{ fontSize: '15px', color: '#2563eb', margin: '2px 0', fontWeight: 'bold' }}>#{quotation?.quotation_number || 'DRAFT'}</p>
          <div style={{ marginTop: '6px', fontSize: '9px', color: '#64748b' }}>
            <p style={{ margin: '1px 0' }}>Date: {formatDate(quotation?.quotation_date) || formatDate(new Date())}</p>
            <p style={{ margin: '1px 0' }}>Valid Until: {formatDate(quotation?.valid_until) || '30 days'}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Bill To:</h3>
        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: '0' }}>{quotation?.client_name || 'Client'}</p>
        {quotation?.client_email && <p style={{ fontSize: '10px', color: '#64748b', margin: '2px 0' }}>{quotation.client_email}</p>}
        <p style={{ fontSize: '10px', color: '#64748b', margin: '2px 0' }}>{quotation?.client_address || ''}</p>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e40af', color: 'white' }}>
            <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: '10px', fontWeight: 'bold' }}>#</th>
            <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: '10px', fontWeight: 'bold' }}>Description</th>
            <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: '10px', fontWeight: 'bold' }}>Qty</th>
            <th style={{ padding: '8px 10px', textAlign: 'right', fontSize: '10px', fontWeight: 'bold' }}>Unit Price</th>
            <th style={{ padding: '8px 10px', textAlign: 'right', fontSize: '10px', fontWeight: 'bold' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px 10px', fontSize: '10px', color: '#64748b' }}>{i + 1}</td>
              <td style={{ padding: '8px 10px', fontSize: '10px', color: '#1e293b', fontWeight: '500' }}>{item.description || 'Service'}</td>
              <td style={{ padding: '8px 10px', fontSize: '10px', color: '#1e293b', textAlign: 'center' }}>{item.quantity || 1}</td>
              <td style={{ padding: '8px 10px', fontSize: '10px', color: '#1e293b', textAlign: 'right' }}>{formatCurrency(item.unit_price || 0)}</td>
              <td style={{ padding: '8px 10px', fontSize: '10px', color: '#1e293b', textAlign: 'right', fontWeight: '600' }}>{formatCurrency((item.quantity || 1) * (item.unit_price || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <div style={{ width: '260px', border: '1px solid #e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '10px', backgroundColor: '#f8fafc' }}>
            <span style={{ color: '#64748b' }}>Subtotal:</span><span style={{ color: '#1e293b', fontWeight: '600' }}>{formatCurrency(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid #e2e8f0', fontSize: '10px', backgroundColor: '#f8fafc' }}>
            <span style={{ color: '#64748b' }}>VAT (15%):</span><span style={{ color: '#1e293b' }}>{formatCurrency(taxAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>
            <span style={{ color: '#1e40af' }}>TOTAL:</span><span style={{ color: '#1e40af', fontSize: '16px' }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '2px solid #2563eb', paddingTop: '10px', textAlign: 'center' }}>
        <p style={{ fontSize: '8px', color: '#94a3b8', margin: '0' }}>Ndanduleni Group (Pty) Ltd | Reg: 2020/123456/07 | VAT: 4567890123</p>
        <p style={{ fontSize: '11px', color: '#2563eb', margin: '6px 0 0 0', fontWeight: 'bold' }}>Thank you for your business!</p>
      </div>
    </div>
  )
}

export default function CreateQuotation() {
  const { createQuotation, fetchProductsServices, productsServices, loading } = useSalesStore()
  const { clients, fetchClients } = useCRMStore()
  const { isDark, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const pdfRef = useRef(null)

  const [quotationData, setQuotationData] = useState({
    client_id: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_terms: '30 Days',
    tax_rate: 15,
    discount_type: 'none',
    discount_value: 0,
    notes: '',
    terms_and_conditions: '',
    status: 'draft'
  })

  const [items, setItems] = useState([
    { description: '', quantity: 1, unit: 'per_hour', unit_price: 0, tax_percent: 15, discount_percent: 0 }
  ])

  useEffect(() => {
    fetchClients({ status: 'active' })
    fetchProductsServices()
  }, [])

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.id === clientId)
    if (client) {
      setQuotationData({
        ...quotationData,
        client_id: client.id,
        client_name: client.company_name,
        client_email: client.email || '',
        client_phone: client.phone || '',
        client_address: `${client.address_line1 || ''}, ${client.city || ''}, ${client.postal_code || ''}`
      })
    }
  }

  const handleProductSelect = (index, productId) => {
    const product = productsServices.find(p => p.id === productId)
    if (product) {
      const newItems = [...items]
      newItems[index] = { ...newItems[index], description: product.name, unit: product.unit, unit_price: product.unit_price, tax_percent: product.tax_rate }
      setItems(newItems)
    }
  }

  const addItem = () => setItems([...items, { description: '', quantity: 1, unit: 'each', unit_price: 0, tax_percent: 15, discount_percent: 0 }])
  const removeItem = (index) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)) }
  const updateItem = (index, field, value) => { const newItems = [...items]; newItems[index] = { ...newItems[index], [field]: value }; setItems(newItems) }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price * (1 - (item.discount_percent || 0) / 100)), 0)
    let discountAmount = 0
    if (quotationData.discount_type === 'percentage') discountAmount = subtotal * (quotationData.discount_value / 100)
    else if (quotationData.discount_type === 'fixed') discountAmount = quotationData.discount_value
    const taxAmount = (subtotal - discountAmount) * (quotationData.tax_rate / 100)
    const total = subtotal - discountAmount + taxAmount
    return { subtotal, discountAmount, taxAmount, total }
  }

  const totals = calculateTotals()

  const handleSave = async (status = 'draft') => {
    // Remove quotation_number - let database handle it
    const dataToSave = { ...quotationData, ...totals, status }
    delete dataToSave.quotation_number
    
    const result = await createQuotation(dataToSave, items)
    if (result.error) { toast.error('Failed to save quotation'); return }
    toast.success(status === 'sent' ? 'Quotation sent!' : 'Quotation saved!')
    navigate(`/sales/quotations/${result.data.id}`)
  }

  // DOWNLOAD PDF
  const downloadPDF = () => {
    const element = document.getElementById('quotation-pdf-download')
    if (!element) { toast.error('Could not find quotation element'); return }

    const opt = {
      margin: [5, 5, 5, 5],
      filename: `Quotation_${quotationData.quotation_number || 'draft'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    }

    html2pdf().set(opt).from(element).save().then(() => {
      toast.success('PDF downloaded!')
    }).catch(() => {
      toast.error('Failed to download PDF')
    })
  }

  const formatCurrency = (amount) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount || 0)

  return (
    <div className={`min-h-screen font-['Inter'] transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <Navbar />
      <div className="fixed top-20 right-4 z-30 flex items-center gap-4">
        <div className="neu-inset px-5 py-2 rounded-full flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold tracking-wide text-emerald-800 dark:text-emerald-200 hidden sm:inline">ERP</span>
        </div>
        <button onClick={toggleTheme} className="neu-raised neu-btn w-12 h-12 rounded-2xl flex items-center justify-center">
          {isDark ? <Sun className="w-6 h-6 text-amber-400" /> : <Moon className="w-6 h-6 text-slate-600" />}
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/sales" className="text-slate-500 hover:text-emerald-600">Sales</Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <Link to="/sales/quotations" className="text-slate-500 hover:text-emerald-600">Quotations</Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-800 dark:text-white font-medium">New Quotation</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3"><FileText className="w-8 h-8 text-emerald-600" />Create Quotation</h1>
          <div className="flex gap-3">
            <button onClick={downloadPDF} className="neu-raised neu-btn px-4 py-2 rounded-xl flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"><Download className="w-4 h-4" /><span>Download PDF</span></button>
            <button onClick={() => handleSave('draft')} className="neu-raised neu-btn px-4 py-2 rounded-xl flex items-center gap-2 bg-slate-600 text-white hover:bg-slate-700"><Save className="w-4 h-4" /><span>Save Draft</span></button>
            <button onClick={() => handleSave('sent')} className="neu-raised neu-btn px-4 py-2 rounded-xl flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700"><Send className="w-4 h-4" /><span>Save & Send</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="neu-raised rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Client Information</h2>
              <div className="space-y-4">
                <select value={quotationData.client_id} onChange={(e) => handleClientSelect(e.target.value)} className="w-full p-3 neu-inset rounded-xl text-slate-700 dark:text-slate-300">
                  <option value="">Select Client</option>
                  {clients.map(client => (<option key={client.id} value={client.id}>{client.company_name}</option>))}
                </select>
                <input type="text" value={quotationData.client_name} onChange={(e) => setQuotationData({...quotationData, client_name: e.target.value})} placeholder="Client Name" className="w-full p-3 neu-inset rounded-xl" />
                <input type="email" value={quotationData.client_email} onChange={(e) => setQuotationData({...quotationData, client_email: e.target.value})} placeholder="Email" className="w-full p-3 neu-inset rounded-xl" />
                <textarea value={quotationData.client_address} onChange={(e) => setQuotationData({...quotationData, client_address: e.target.value})} placeholder="Address" rows={2} className="w-full p-3 neu-inset rounded-xl" />
              </div>
            </div>

            <div className="neu-raised rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Items/Services</h2><button onClick={addItem} className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm"><Plus className="w-4 h-4" /> Add Item</button></div>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 space-y-3">
                    <div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">Item {index + 1}</span><button onClick={() => removeItem(index)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
                    <select onChange={(e) => handleProductSelect(index, e.target.value)} className="w-full p-2 neu-inset rounded-lg text-sm"><option value="">Select Product/Service</option>{productsServices.map(ps => (<option key={ps.id} value={ps.id}>{ps.name} - {formatCurrency(ps.unit_price)}/{ps.unit}</option>))}</select>
                    <input type="text" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Description" className="w-full p-2 neu-inset rounded-lg text-sm" />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)} placeholder="Qty" className="p-2 neu-inset rounded-lg text-sm" />
                      <select value={item.unit} onChange={(e) => updateItem(index, 'unit', e.target.value)} className="p-2 neu-inset rounded-lg text-sm"><option value="each">Each</option><option value="per_hour">Per Hour</option><option value="per_sqm">Per m²</option><option value="per_month">Per Month</option><option value="per_service">Per Service</option></select>
                      <input type="number" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)} placeholder="Price" className="p-2 neu-inset rounded-lg text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="neu-raised rounded-3xl p-6">
              <h2 className="text-lg font-semibold mb-4">Terms & Notes</h2>
              <div className="space-y-4">
                <div><label className="text-sm text-slate-500">Valid Until</label><input type="date" value={quotationData.valid_until} onChange={(e) => setQuotationData({...quotationData, valid_until: e.target.value})} className="w-full p-3 neu-inset rounded-xl mt-1" /></div>
                <textarea value={quotationData.notes} onChange={(e) => setQuotationData({...quotationData, notes: e.target.value})} placeholder="Additional notes..." rows={3} className="w-full p-3 neu-inset rounded-xl" />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="neu-raised rounded-3xl p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-emerald-600" />Preview</h2>
              <div className="bg-white rounded-xl overflow-hidden border" style={{ maxHeight: '500px', overflow: 'auto' }}>
                <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%' }}>
                  <div id="quotation-pdf-download">
                    <QuotationTemplate quotation={quotationData} items={items} />
                  </div>
                </div>
              </div>
            </div>

            <div className="neu-raised rounded-3xl p-6 mt-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Totals</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal:</span><span>{formatCurrency(totals.subtotal)}</span></div>
                <div className="flex justify-between pt-2 border-t font-bold text-lg"><span className="text-emerald-600">Total:</span><span className="text-emerald-600">{formatCurrency(totals.total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
