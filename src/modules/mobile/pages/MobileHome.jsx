import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../../store/authStore'
import useMobileStore from '../store/mobileStore'
import BottomNav from '../components/BottomNav'
import toast from 'react-hot-toast'
import { supabase } from '../../../lib/supabaseClient'
import { 
  Briefcase, Clock, CheckCircle2,
  Camera, AlertCircle, Package, LogOut,
  RefreshCw, ChevronDown
} from 'lucide-react'

export default function MobileHome() {
  const { user, profile, signOut } = useAuthStore()
  const { stats, fetchMobileStats, fetchMyProfile, myProfile } = useMobileStore()
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const touchStartY = useRef(0)
  const pullThreshold = 80

  const [myActiveJobs, setMyActiveJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [myCleanerName, setMyCleanerName] = useState('')

  useEffect(() => {
    initData()
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = currentTime.getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [currentTime])

  const initData = async () => {
    if (user?.id) await fetchMyProfile(user.id)
    if (profile?.id) {
      await fetchMobileStats(profile.id)
    }
    await setupEmployee()
  }

  const setupEmployee = async () => {
    try {
      let { data: emp } = await supabase.from('employees').select('id, first_name, last_name').eq('user_id', user?.id).single()
      if (emp) {
        setMyCleanerName(((emp.first_name || '') + ' ' + (emp.last_name || '')).trim() || user?.email?.split('@')[0] || 'Cleaner')
        loadMyJobs(((emp.first_name || '') + ' ' + (emp.last_name || '')).trim())
        return
      }

      const { data: empByEmail } = await supabase.from('employees').select('id, first_name, last_name').eq('email', user?.email).single()
      if (empByEmail) {
        await supabase.from('employees').update({ user_id: user?.id }).eq('id', empByEmail.id)
        setMyCleanerName(((empByEmail.first_name || '') + ' ' + (empByEmail.last_name || '')).trim() || user?.email?.split('@')[0] || 'Cleaner')
        loadMyJobs(((empByEmail.first_name || '') + ' ' + (empByEmail.last_name || '')).trim())
        return
      }

      const firstName = myProfile?.first_name || user?.email?.split('@')[0] || 'Cleaner'
      const { data: newEmp } = await supabase.from('employees').insert([{
        user_id: user?.id, first_name: firstName, last_name: '',
        email: user?.email, employment_status: 'active', department: 'Cleaning'
      }]).select('id, first_name').single()

      if (newEmp) {
        setMyCleanerName(newEmp.first_name || firstName)
        loadMyJobs(newEmp.first_name || firstName)
      }
    } catch (e) { console.error('Setup error:', e) }
  }

  const isMyJob = (job) => {
    if (!job?.notes || !myCleanerName) return false
    const notes = job.notes.toLowerCase()
    const myName = myCleanerName.toLowerCase()
    const myFirstName = myCleanerName.split(' ')[0]?.toLowerCase() || ''
    
    if (notes.includes('selected by:')) {
      const selectedPart = notes.split('selected by:')[1]?.split('at')[0]?.trim() || ''
      if (selectedPart.includes(myName) || (myFirstName && selectedPart.includes(myFirstName))) return true
    }
    if (notes.includes('assigned by management:')) {
      const assignedPart = notes.split('assigned by management:')[1]?.split('at')[0]?.trim() || ''
      if (assignedPart.includes(myName) || (myFirstName && assignedPart.includes(myFirstName))) return true
    }
    if (notes.includes(myName)) return true
    if (myFirstName && notes.includes(myFirstName)) return true
    return false
  }

  const loadMyJobs = async (cleanerName) => {
    setLoadingJobs(true)
    try {
      const { data: allActive } = await supabase
        .from('jobs')
        .select('id, title, job_number, status, scheduled_date, scheduled_start_time, scheduled_end_time, site_address, notes, clients(company_name, phone), job_categories(name, color)')
        .eq('status', 'in_progress')
        .order('scheduled_date', { ascending: true })
        .order('scheduled_start_time', { ascending: true })

      const nameToCheck = cleanerName || myCleanerName
      const myJobsOnly = (allActive || []).filter(job => {
        if (!job?.notes || !nameToCheck) return false
        return isMyJob(job)
      })
      
      setMyActiveJobs(myJobsOnly)
    } catch (error) { console.error('Error:', error) }
    finally { setLoadingJobs(false) }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await initData()
    await loadMyJobs(myCleanerName)
    setTimeout(() => setRefreshing(false), 500)
    toast.success('Refreshed!')
  }

  const handleTouchStart = (e) => {
    if (scrollRef.current?.scrollTop === 0) { touchStartY.current = e.touches[0].clientY; setIsPulling(true) }
  }
  const handleTouchMove = (e) => {
    if (!isPulling) return
    const d = e.touches[0].clientY - touchStartY.current
    if (d > 0) setPullDistance(Math.min(d * 0.5, pullThreshold))
  }
  const handleTouchEnd = async () => {
    if (pullDistance >= pullThreshold && !refreshing) await handleRefresh()
    setPullDistance(0); setIsPulling(false)
  }

  const handleSignOut = async () => { await signOut(); navigate('/login') }

  const formatTime = (date) => date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
  const formatDate = (date) => date.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })
  const formatDateShort = (date) => {
    if (!date) return ''
    const d = new Date(date + 'T00:00:00')
    return d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const hasActiveJob = myActiveJobs.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 font-['Inter'] pb-20"
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <AnimatePresence>
        {(pullDistance > 20 || refreshing) && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: pullDistance > 20 ? pullDistance : refreshing ? 50 : 0, opacity: 1 }}
            className="flex items-center justify-center text-white/80 overflow-hidden">
            {refreshing ? <RefreshCw className="w-5 h-5 animate-spin" /> : pullDistance >= pullThreshold ? <span className="text-sm font-medium">Release to refresh</span> : <ChevronDown className="w-5 h-5" />}
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <div className="px-5 pt-6 pb-6 text-white">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1">
              <p className="text-emerald-100 text-xs opacity-80">{formatDate(currentTime)}</p>
              <h1 className="text-xl font-bold mt-0.5">{greeting}, {myCleanerName || myProfile?.first_name || user?.email?.split('@')[0] || 'Cleaner'}!</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleRefresh} className="p-2 rounded-xl bg-white/20"><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /></button>
              <button onClick={handleSignOut} className="p-2 rounded-xl bg-white/20"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
          <p className="text-5xl font-bold text-center my-3 font-mono tracking-wider">{formatTime(currentTime)}</p>
          
          {/* Active Job Banner */}
          {hasActiveJob && (
            <div className="mt-2 bg-amber-400/20 border border-amber-400/30 rounded-xl p-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-300 flex-shrink-0" />
              <div>
                <p className="text-amber-200 text-sm font-semibold">Active Job: {myActiveJobs[0]?.title}</p>
                <p className="text-amber-300/70 text-xs">View details in Jobs tab below</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="px-5 -mt-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Briefcase, label: 'My Jobs', value: myActiveJobs.length, color: 'from-amber-400 to-amber-500' },
              { icon: Clock, label: 'Clock', value: stats.isClockedIn ? 'In' : 'Out', color: stats.isClockedIn ? 'from-green-400 to-green-500' : 'from-slate-400 to-slate-500' },
              { icon: CheckCircle2, label: 'Done Today', value: stats.completedJobs || 0, color: 'from-emerald-400 to-emerald-500' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={`bg-gradient-to-br ${s.color} rounded-2xl p-2.5 text-white text-center shadow-lg`}>
                <s.icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[9px] opacity-80 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mt-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Clock, label: 'Clock In/Out', path: '/mobile/clock', color: 'from-amber-400 to-orange-500' },
              { icon: Camera, label: 'Job Photos', path: '/mobile/photos', color: 'from-blue-400 to-indigo-500' },
              { icon: Package, label: 'Supplies', path: '/mobile/supplies', color: 'from-purple-400 to-violet-500' },
              { icon: AlertCircle, label: 'Incident', path: '/mobile/incident', color: 'from-red-400 to-rose-500' },
            ].map(action => (
              <button key={action.label} onClick={() => navigate(action.path)}
                className={`bg-gradient-to-r ${action.color} text-white rounded-2xl p-3.5 text-left hover:scale-[1.02] active:scale-95 transition-all shadow-lg`}>
                <action.icon className="w-7 h-7 mb-2" /><span className="text-sm font-bold block">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* My Active Jobs Summary */}
        <div className="px-5 mt-5 mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4" /> My Active Jobs
          </h2>

          {loadingJobs ? (
            <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div>
          ) : myActiveJobs.length > 0 ? (
            <div className="space-y-2">
              {myActiveJobs.map((job, i) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/mobile/jobs/${job.id}`)}
                  className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-l-amber-400 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-sm">{job.title}</h3>
                      <p className="text-xs text-slate-400">{job.job_number} · {job.clients?.company_name || 'Client'}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{job.scheduled_date === todayStr ? 'Today' : formatDateShort(job.scheduled_date)}</span>
                    <span className="mx-1">·</span>
                    <span>{job.scheduled_start_time?.slice(0,5)}-{job.scheduled_end_time?.slice(0,5)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{job.site_address?.slice(0, 40)}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white/10 backdrop-blur rounded-2xl">
              <Briefcase className="w-12 h-12 text-white/60 mx-auto mb-2" />
              <p className="text-white font-semibold">No active jobs</p>
              <p className="text-white/60 text-xs mt-1">Open jobs are available in the Jobs tab</p>
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>
      <BottomNav />
    </div>
  )
}
