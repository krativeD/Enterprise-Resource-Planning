import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../../../store/authStore'
import useMobileStore from '../store/mobileStore'
import BottomNav from '../components/BottomNav'
import toast from 'react-hot-toast'
import { supabase } from '../../../lib/supabaseClient'
import { 
  Briefcase, MapPin, Clock, Calendar, 
  Search, Hand, Play, CheckCircle2,
  Camera, Package, AlertCircle, RefreshCw,
  ChevronDown, User, Users, List, Lock
} from 'lucide-react'

export default function MyJobs() {
  const { user, profile } = useAuthStore()
  const { fetchMyJobs, fetchMobileStats } = useMobileStore()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('mine')
  const [openJobs, setOpenJobs] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobSearch, setJobSearch] = useState('')
  const [updatingJob, setUpdatingJob] = useState(null)
  const [myEmployeeId, setMyEmployeeId] = useState(null)
  const [myCleanerName, setMyCleanerName] = useState('')

  useEffect(() => {
    setupAndLoad()
  }, [])

  const setupAndLoad = async () => {
    await findEmployee()
    await loadAllJobs()
  }

  const findEmployee = async () => {
    try {
      // Try by user_id
      let { data: emp } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .eq('user_id', user?.id)
        .single()

      if (emp) { 
        const fullName = ((emp.first_name || '') + ' ' + (emp.last_name || '')).trim()
        console.log('✅ Found employee by user_id:', emp.id, 'Name:', fullName)
        setMyEmployeeId(emp.id)
        setMyCleanerName(fullName)
        return 
      }
      
      // Try by email
      const { data: empByEmail } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .eq('email', user?.email)
        .single()

      if (empByEmail) { 
        await supabase.from('employees').update({ user_id: user?.id }).eq('id', empByEmail.id)
        const fullName = ((empByEmail.first_name || '') + ' ' + (empByEmail.last_name || '')).trim()
        console.log('✅ Found employee by email:', empByEmail.id, 'Name:', fullName)
        setMyEmployeeId(empByEmail.id)
        setMyCleanerName(fullName)
        return 
      }

      // Create new
      const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Cleaner'
      const lastName = profile?.full_name?.split(' ').slice(1).join(' ') || ''
      const { data: newEmp } = await supabase.from('employees').insert([{
        user_id: user?.id, first_name: firstName, last_name: lastName,
        email: user?.email, employment_status: 'active', department: 'Cleaning'
      }]).select('id, first_name, last_name').single()
      
      if (newEmp) {
        const fullName = ((newEmp.first_name || '') + ' ' + (newEmp.last_name || '')).trim()
        console.log('✅ Created new employee:', newEmp.id, 'Name:', fullName)
        setMyEmployeeId(newEmp.id)
        setMyCleanerName(fullName)
      }
    } catch (e) {
      console.error('❌ Employee setup error:', e)
    }
  }

  const loadAllJobs = async () => {
    setLoading(true)
    try {
      // OPEN JOBS
      const { data: open } = await supabase
        .from('jobs')
        .select('id, title, job_number, status, scheduled_date, scheduled_start_time, scheduled_end_time, site_address, notes, clients(company_name, phone), job_categories(name, color)')
        .in('status', ['pending', 'scheduled'])
        .order('scheduled_date', { ascending: true })
        .order('scheduled_start_time', { ascending: true })

      setOpenJobs(open || [])
      console.log('📋 Open Pool loaded:', open?.length || 0)

      // ALL ACTIVE JOBS - load all first, then filter
      const { data: allActive } = await supabase
        .from('jobs')
        .select('id, title, job_number, status, scheduled_date, scheduled_start_time, scheduled_end_time, site_address, notes, clients(company_name, phone), job_categories(name, color)')
        .eq('status', 'in_progress')
        .order('scheduled_date', { ascending: true })
        .order('scheduled_start_time', { ascending: true })

      console.log('📊 All active jobs loaded:', allActive?.length || 0)
      
      if (allActive && allActive.length > 0) {
        console.log('📝 Active job notes:')
        allActive.forEach(j => console.log('  -', j.job_number, j.title, '| Notes:', j.notes?.substring(0, 80)))
      }

      // Filter by cleaner name - use multiple matching strategies
      const myName = myCleanerName || profile?.full_name || user?.email?.split('@')[0] || ''
      const myFirstName = myName.split(' ')[0] || ''
      
      console.log('🔍 Filtering for cleaner:', { myName, myFirstName, myCleanerName })
      
      const myJobsOnly = (allActive || []).filter(job => {
        if (!job.notes) return false
        
        const notes = job.notes
        
        // Strategy 1: Check for "SELECTED BY: Name"
        if (notes.includes('SELECTED BY:')) {
          const selectedName = notes.split('SELECTED BY:')[1]?.split('at')[0]?.trim() || ''
          if (selectedName.toLowerCase().includes(myName.toLowerCase()) ||
              selectedName.toLowerCase().includes(myFirstName.toLowerCase())) {
            console.log('✅ MATCH (SELECTED):', job.job_number, '| Selected:', selectedName, '| Me:', myName)
            return true
          }
        }
        
        // Strategy 2: Check for "ASSIGNED BY MANAGEMENT: Name"
        if (notes.includes('ASSIGNED BY MANAGEMENT:')) {
          const assignedName = notes.split('ASSIGNED BY MANAGEMENT:')[1]?.split('at')[0]?.trim() || ''
          if (assignedName.toLowerCase().includes(myName.toLowerCase()) ||
              assignedName.toLowerCase().includes(myFirstName.toLowerCase())) {
            console.log('✅ MATCH (ASSIGNED):', job.job_number, '| Assigned:', assignedName, '| Me:', myName)
            return true
          }
        }
        
        // Strategy 3: Check for "COMPLETED BY: Name"
        if (notes.includes('COMPLETED BY:')) {
          const completedName = notes.split('COMPLETED BY:')[1]?.split('at')[0]?.trim() || ''
          if (completedName.toLowerCase().includes(myName.toLowerCase()) ||
              completedName.toLowerCase().includes(myFirstName.toLowerCase())) {
            console.log('✅ MATCH (COMPLETED):', job.job_number, '| Completed:', completedName, '| Me:', myName)
            return true
          }
        }
        
        return false
      })

      console.log('👤 My filtered jobs:', myJobsOnly.length)
      setMyJobs(myJobsOnly)

    } catch (error) { 
      console.error('❌ Error loading jobs:', error) 
    }
    finally { setLoading(false) }
  }

  const handleSelectJob = async (jobId) => {
    if (!myEmployeeId) { toast.error('Profile not ready'); return }
    if (myJobs.length > 0) { 
      toast.error('You already have an active job. Complete it first.')
      setActiveTab('mine')
      return 
    }
    setUpdatingJob(jobId)
    try {
      const cleanerName = myCleanerName || profile?.full_name || user?.email?.split('@')[0] || 'Cleaner'
      const { error } = await supabase.from('jobs').update({ 
        status: 'in_progress', actual_start_time: new Date().toISOString(), updated_at: new Date().toISOString(),
        notes: 'SELECTED BY: ' + cleanerName + ' at ' + new Date().toLocaleString()
      }).eq('id', jobId)
      if (error) { toast.error('Failed'); return }
      toast.success('Job selected!')
      loadAllJobs()
      setActiveTab('mine')
    } catch { toast.error('Failed') }
    finally { setUpdatingJob(null) }
  }

  const handleStartJob = async (jobId) => {
    setUpdatingJob(jobId)
    try {
      await supabase.from('jobs').update({ status: 'in_progress', actual_start_time: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', jobId)
      toast.success('Job started!')
      loadAllJobs()
    } catch { toast.error('Failed') }
    finally { setUpdatingJob(null) }
  }

  const handleCompleteJob = async (jobId) => {
    if (!window.confirm('Mark as completed?')) return
    setUpdatingJob(jobId)
    try {
      const cleanerName = myCleanerName || profile?.full_name || user?.email?.split('@')[0] || 'Cleaner'
      await supabase.from('jobs').update({ 
        status: 'completed', updated_at: new Date().toISOString(),
        notes: 'COMPLETED BY: ' + cleanerName + ' at ' + new Date().toLocaleString()
      }).eq('id', jobId)
      toast.success('Completed!')
      loadAllJobs()
      setActiveTab('open')
    } catch { toast.error('Failed') }
    finally { setUpdatingJob(null) }
  }

  const formatDateShort = (date) => {
    if (!date) return ''
    return new Date(date + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })
  }
  const todayStr = new Date().toISOString().split('T')[0]
  const hasActiveJob = myJobs.length > 0

  const filteredOpen = openJobs.filter(j => {
    if (!jobSearch) return true
    const s = jobSearch.toLowerCase()
    return (j.title || '').toLowerCase().includes(s) || (j.job_number || '').toLowerCase().includes(s) ||
           (j.clients?.company_name || '').toLowerCase().includes(s) || (j.site_address || '').toLowerCase().includes(s)
  })

  const filteredMine = myJobs.filter(j => {
    if (!jobSearch) return true
    const s = jobSearch.toLowerCase()
    return (j.title || '').toLowerCase().includes(s) || (j.job_number || '').toLowerCase().includes(s) ||
           (j.clients?.company_name || '').toLowerCase().includes(s) || (j.site_address || '').toLowerCase().includes(s)
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 font-['Inter'] pb-20">
      <div className="px-5 pt-8 pb-5 text-white">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <p className="text-blue-100 text-sm mt-1">{hasActiveJob ? 'You have an active job' : 'Select a job to start working'}</p>
        {hasActiveJob && (
          <div className="mt-3 bg-amber-400/20 border border-amber-400/30 rounded-xl p-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-300 flex-shrink-0" />
            <div><p className="text-amber-200 text-sm font-semibold">Active Job: {myJobs[0]?.title}</p><p className="text-amber-300/70 text-xs">Complete this job before selecting a new one</p></div>
          </div>
        )}
      </div>

      <div className="px-5 -mt-2">
        <div className="flex gap-2 bg-white/10 rounded-2xl p-1">
          <button onClick={() => setActiveTab('open')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'open' ? 'bg-white text-blue-700 shadow-lg' : 'text-white/70'}`}>
            <List className="w-4 h-4" /> Open Pool ({filteredOpen.length})
          </button>
          <button onClick={() => setActiveTab('mine')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'mine' ? 'bg-white text-amber-700 shadow-lg' : 'text-white/70'}`}>
            <User className="w-4 h-4" /> My Jobs ({filteredMine.length})
          </button>
        </div>
      </div>

      <div className="px-5 mt-3 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input type="text" value={jobSearch} onChange={e => setJobSearch(e.target.value)}
            placeholder="Search jobs..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/15 text-white placeholder-white/40 text-sm border border-white/10" />
        </div>
      </div>

      <div className="px-5">
        {loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div>
        ) : activeTab === 'open' ? (
          filteredOpen.length > 0 ? (
            <div className="space-y-2.5">
              {filteredOpen.map((job, i) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={`bg-white rounded-2xl p-4 shadow-md border-l-4 ${hasActiveJob ? 'border-l-slate-300 opacity-60' : 'border-l-blue-400'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1"><h3 className="font-semibold text-slate-800 text-sm">{job.title}</h3><p className="text-xs text-slate-400">{job.job_number} · {job.clients?.company_name || 'Client'}</p></div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">Open</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2"><Calendar className="w-3 h-3" /><span>{job.scheduled_date === todayStr ? 'Today' : formatDateShort(job.scheduled_date)}</span><span className="mx-1">·</span><Clock className="w-3 h-3" />{job.scheduled_start_time?.slice(0,5)}-{job.scheduled_end_time?.slice(0,5)}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><MapPin className="w-3 h-3" />{job.site_address?.slice(0, 40)}</div>
                  {hasActiveJob ? (
                    <div className="w-full py-2.5 bg-slate-400 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed"><Lock className="w-4 h-4" /> Complete current job first</div>
                  ) : (
                    <button onClick={() => handleSelectJob(job.id)} disabled={updatingJob === job.id}
                      className="w-full py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-sm"><Hand className="w-4 h-4" /> Select Job</button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/10 rounded-2xl"><Briefcase className="w-12 h-12 text-white/50 mx-auto mb-2" /><p className="text-white font-semibold">No open jobs available</p></div>
          )
        ) : (
          filteredMine.length > 0 ? (
            <div className="space-y-2.5">
              {filteredMine.map((job, i) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-l-amber-400">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-sm">{job.title}</h3>
                      <p className="text-xs text-slate-400">{job.job_number} · {job.clients?.company_name || 'Client'}</p>
                      {job.notes?.includes('ASSIGNED BY MANAGEMENT:') && (
                        <p className="text-[10px] text-indigo-500 mt-0.5">📋 Assigned by management</p>
                      )}
                      {job.notes?.includes('SELECTED BY:') && (
                        <p className="text-[10px] text-emerald-500 mt-0.5">✅ Self-selected</p>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">My Job</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2"><Calendar className="w-3 h-3" /><span>{job.scheduled_date === todayStr ? 'Today' : formatDateShort(job.scheduled_date)}</span><span className="mx-1">·</span><Clock className="w-3 h-3" />{job.scheduled_start_time?.slice(0,5)}-{job.scheduled_end_time?.slice(0,5)}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3"><MapPin className="w-3 h-3" />{job.site_address?.slice(0, 40)}</div>
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => handleStartJob(job.id)} disabled={updatingJob === job.id}
                      className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 shadow-sm"><Play className="w-3.5 h-3.5" /> Start Job</button>
                    <button onClick={() => handleCompleteJob(job.id)} disabled={updatingJob === job.id}
                      className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5" /> Complete</button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button onClick={() => navigate('/mobile/photos')} className="py-2 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1"><Camera className="w-3 h-3" /> Photos</button>
                    <button onClick={() => navigate('/mobile/supplies')} className="py-2 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1"><Package className="w-3 h-3" /> Supplies</button>
                    <button onClick={() => navigate('/mobile/incident')} className="py-2 bg-red-50 text-red-700 rounded-lg text-[10px] font-medium flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> Incident</button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/10 rounded-2xl">
              <User className="w-12 h-12 text-white/50 mx-auto mb-2" />
              <p className="text-white font-semibold">No jobs assigned to you</p>
              <p className="text-white/50 text-xs mt-1">Select a job from Open Pool or wait for management assignment</p>
            </div>
          )
        )}
      </div>

      <BottomNav active="jobs" />
    </div>
  )
}
