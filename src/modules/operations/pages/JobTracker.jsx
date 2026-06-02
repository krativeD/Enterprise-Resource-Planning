import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar'
import useThemeStore from '../../../store/themeStore'
import { supabase } from '../../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { 
  Briefcase, Search, Calendar, Clock, MapPin, 
  Users, Building2, CheckCircle2, AlertCircle,
  ArrowLeft, Sun, Moon, Sparkles, RefreshCw,
  Eye, Filter, ChevronDown, ChevronUp, User,
  FileText, Phone, Info
} from 'lucide-react'

export default function JobTracker() {
  const { isDark, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobDetails, setJobDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    loadAllJobs()
  }, [statusFilter])

  const loadAllJobs = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('jobs')
        .select('id, title, job_number, status, priority, scheduled_date, scheduled_start_time, scheduled_end_time, site_address, site_city, notes, actual_start_time, actual_end_time, created_at, updated_at, clients(company_name, phone), job_categories(name, color)')
        .order('created_at', { ascending: false })
        .limit(100)

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data: jobs } = await query
      setAllJobs(jobs || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadJobDetails = async (jobId) => {
    setLoadingDetails(true)
    try {
      // Get full job details with timeline
      const { data: job } = await supabase
        .from('jobs')
        .select('*, clients(*), job_categories(*), job_assignments(*, employees(first_name, last_name)), job_photos(*), job_task_items(*), quality_inspections(*)')
        .eq('id', jobId)
        .single()

      if (job) {
        // Build timeline from job data
        const timeline = buildTimeline(job)
        setJobDetails({ ...job, timeline })
      }
    } catch (error) {
      console.error('Error loading details:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const buildTimeline = (job) => {
    const events = []

    // Job Created
    if (job.created_at) {
      events.push({
        date: job.created_at,
        icon: '📝',
        title: 'Job Created',
        description: 'Job was created in the system',
        status: 'created'
      })
    }

    // Job Scheduled
    if (job.scheduled_date) {
      events.push({
        date: job.scheduled_date + 'T' + (job.scheduled_start_time || '00:00'),
        icon: '📅',
        title: 'Job Scheduled',
        description: `Scheduled for ${new Date(job.scheduled_date).toLocaleDateString()} at ${job.scheduled_start_time?.slice(0,5) || 'N/A'}`,
        status: 'scheduled'
      })
    }

    // Job Started (from notes or actual_start_time)
    if (job.actual_start_time) {
      const cleanerName = extractNameFromNotes(job.notes, 'SELECTED BY:')
      events.push({
        date: job.actual_start_time,
        icon: '▶️',
        title: 'Job Started',
        description: cleanerName ? `Started by ${cleanerName}` : 'Job was started',
        status: 'in_progress'
      })
    }

    // Job Completed
    if (job.actual_end_time) {
      const cleanerName = extractNameFromNotes(job.notes, 'COMPLETED BY:') || extractNameFromNotes(job.notes, 'SELECTED BY:')
      events.push({
        date: job.actual_end_time,
        icon: '✅',
        title: 'Job Completed',
        description: cleanerName ? `Completed by ${cleanerName}` : 'Job was completed',
        status: 'completed'
      })
    }

    // Photos taken
    if (job.job_photos?.length > 0) {
      job.job_photos.forEach(photo => {
        events.push({
          date: photo.taken_at,
          icon: '📸',
          title: 'Photo Uploaded',
          description: `${photo.photo_type} photo${photo.caption ? ': ' + photo.caption : ''}`,
          status: 'photo'
        })
      })
    }

    // Tasks completed
    if (job.job_task_items?.filter(t => t.is_completed).length > 0) {
      events.push({
        date: job.job_task_items.find(t => t.is_completed)?.completed_at,
        icon: '📋',
        title: 'Tasks Completed',
        description: `${job.job_task_items.filter(t => t.is_completed).length} of ${job.job_task_items.length} tasks completed`,
        status: 'task'
      })
    }

    // Quality inspection
    if (job.quality_inspections?.length > 0) {
      job.quality_inspections.forEach(inspection => {
        events.push({
          date: inspection.inspection_date,
          icon: '🔍',
          title: 'Quality Inspection',
          description: `Rating: ${inspection.overall_rating}/5`,
          status: 'quality'
        })
      })
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    return events
  }

  const extractNameFromNotes = (notes, prefix) => {
    if (!notes) return null
    if (notes.includes(prefix)) {
      const name = notes.split(prefix)[1]?.split('at')[0]?.trim()
      if (name && name !== 'undefined') return name
    }
    return null
  }

  const handleViewJob = async (job) => {
    setSelectedJob(job)
    await loadJobDetails(job.id)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const formatTime = (time) => {
    if (!time) return 'N/A'
    return time.slice(0, 5)
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
      scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      on_hold: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      overdue: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    }
    return badges[status] || 'bg-slate-100 text-slate-700'
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'text-slate-500',
      medium: 'text-blue-600',
      high: 'text-amber-600',
      urgent: 'text-red-600 font-bold',
      emergency: 'text-red-600 font-bold animate-pulse',
    }
    return badges[priority] || 'text-slate-500'
  }

  const filteredJobs = allJobs.filter(job => {
    if (!search) return true
    const s = search.toLowerCase()
    return (job.title || '').toLowerCase().includes(s) ||
           (job.job_number || '').toLowerCase().includes(s) ||
           (job.clients?.company_name || '').toLowerCase().includes(s) ||
           (job.site_address || '').toLowerCase().includes(s)
  })

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className={`min-h-screen font-['Inter'] transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <Navbar />
      
      <div className="fixed top-20 right-4 z-30 flex items-center gap-4">
        <div className="neu-inset px-5 py-2 rounded-full flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold tracking-wide text-emerald-800 dark:text-emerald-200 hidden sm:inline">ERP</span>
        </div>
        <button onClick={toggleTheme} className="neu-raised neu-btn w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110">
          {isDark ? <Sun className="w-6 h-6 text-amber-400" /> : <Moon className="w-6 h-6 text-slate-600" />}
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Link to="/operations" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-emerald-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /><span className="text-sm">Back to Operations</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Search className="w-8 h-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Job Tracker</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 ml-11">
              Track complete job lifecycle - creation, assignment, progress, completion
            </p>
          </div>
          <button onClick={loadAllJobs} className="neu-raised neu-btn px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </motion.div>

        {/* Search & Filter */}
        <div className="neu-raised rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by job #, title, client, address..."
              className="w-full pl-10 pr-4 py-3 neu-inset rounded-xl text-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 neu-inset rounded-xl text-sm text-slate-700 dark:text-slate-300">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Jobs Table */}
        {loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div><p className="text-slate-500">Loading jobs...</p></div>
        ) : (
          <div className="neu-raised rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left py-3 px-3 text-slate-500">Job #</th>
                    <th className="text-left py-3 px-3 text-slate-500">Title</th>
                    <th className="text-left py-3 px-3 text-slate-500">Client</th>
                    <th className="text-left py-3 px-3 text-slate-500">Category</th>
                    <th className="text-left py-3 px-3 text-slate-500">Priority</th>
                    <th className="text-left py-3 px-3 text-slate-500">Date</th>
                    <th className="text-center py-3 px-3 text-slate-500">Status</th>
                    <th className="text-center py-3 px-3 text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map(job => (
                    <tr key={job.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer"
                      onClick={() => handleViewJob(job)}>
                      <td className="py-3 px-3 font-mono text-xs">{job.job_number}</td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-white">{job.title}</td>
                      <td className="py-3 px-3 text-xs text-slate-600">{job.clients?.company_name || 'N/A'}</td>
                      <td className="py-3 px-3">
                        {job.job_categories?.name && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{backgroundColor: job.job_categories.color + '20', color: job.job_categories.color}}>
                            {job.job_categories.name}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3"><span className={`text-xs font-medium ${getPriorityBadge(job.priority)}`}>{job.priority}</span></td>
                      <td className="py-3 px-3 text-xs text-slate-500">{formatDate(job.scheduled_date)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${getStatusBadge(job.status)}`}>
                          {job.status === 'in_progress' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mr-1 animate-pulse"></span>}
                          {(job.status || 'pending').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button className="p-2 rounded-lg hover:bg-emerald-100 text-slate-400 hover:text-emerald-600" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No jobs found</p>
              </div>
            )}
          </div>
        )}

        {/* JOB DETAIL MODAL */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto"
              onClick={() => { setSelectedJob(null); setJobDetails(null) }}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl my-8 shadow-2xl"
                onClick={e => e.stopPropagation()}>
                
                {/* Modal Header */}
                <div className="flex justify-between items-start p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10 rounded-t-2xl">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-slate-500">{selectedJob.job_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadge(selectedJob.status)}`}>
                        {(selectedJob.status || 'pending').replace('_', ' ')}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityBadge(selectedJob.priority)}`}>
                        {selectedJob.priority} priority
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selectedJob.title}</h2>
                  </div>
                  <button onClick={() => { setSelectedJob(null); setJobDetails(null) }}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">✕</button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  {loadingDetails ? (
                    <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div></div>
                  ) : jobDetails ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Job Info */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { icon: Building2, label: 'Client', value: selectedJob.clients?.company_name || 'N/A' },
                            { icon: MapPin, label: 'Location', value: selectedJob.site_address?.slice(0, 30) || 'N/A' },
                            { icon: Calendar, label: 'Scheduled', value: formatDate(selectedJob.scheduled_date) },
                            { icon: Clock, label: 'Time', value: `${formatTime(selectedJob.scheduled_start_time)} - ${formatTime(selectedJob.scheduled_end_time)}` },
                            { icon: Info, label: 'Created', value: formatDateTime(selectedJob.created_at) },
                            { icon: Info, label: 'Updated', value: formatDateTime(selectedJob.updated_at) },
                            { icon: Clock, label: 'Started', value: selectedJob.actual_start_time ? formatDateTime(selectedJob.actual_start_time) : 'Not started' },
                            { icon: CheckCircle2, label: 'Completed', value: selectedJob.actual_end_time ? formatDateTime(selectedJob.actual_end_time) : 'Not completed' },
                          ].map((item, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <item.icon className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[10px] text-slate-500">{item.label}</span>
                              </div>
                              <p className="text-xs font-medium text-slate-800 dark:text-white">{item.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Cleaner Info */}
                        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-600" />People
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-slate-500">Selected By:</span>
                              <span className="font-medium ml-2 text-slate-800 dark:text-white">
                                {extractNameFromNotes(selectedJob.notes, 'SELECTED BY:') || 'Not selected'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500">Completed By:</span>
                              <span className="font-medium ml-2 text-slate-800 dark:text-white">
                                {extractNameFromNotes(selectedJob.notes, 'COMPLETED BY:') || extractNameFromNotes(selectedJob.notes, 'SELECTED BY:') || 'Not completed'}
                              </span>
                            </div>
                            {selectedJob.clients?.phone && (
                              <div>
                                <span className="text-slate-500">Client Contact:</span>
                                <a href={`tel:${selectedJob.clients.phone}`} className="font-medium ml-2 text-blue-600 hover:underline">
                                  {selectedJob.clients.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Job Notes */}
                        {selectedJob.notes && (
                          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-emerald-600" />Notes
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{selectedJob.notes}</p>
                          </div>
                        )}

                        {/* Photos */}
                        {jobDetails.job_photos?.length > 0 && (
                          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Photos ({jobDetails.job_photos.length})</h3>
                            <div className="grid grid-cols-4 gap-2">
                              {jobDetails.job_photos.map(photo => (
                                <div key={photo.id} className="relative rounded-lg overflow-hidden cursor-pointer" onClick={() => window.open(photo.photo_url, '_blank')}>
                                  <img src={photo.photo_url} alt="" className="w-full h-24 object-cover" />
                                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full text-[9px] bg-black/50 text-white capitalize">{photo.photo_type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Timeline */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-600" />Job Timeline
                        </h3>
                        
                        {jobDetails.timeline?.length > 0 ? (
                          <div className="relative pl-6 border-l-2 border-emerald-200 dark:border-emerald-800 space-y-4">
                            {jobDetails.timeline.map((event, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-emerald-500 flex items-center justify-center">
                                  <span className="text-[8px]">{event.icon}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3">
                                  <p className="text-xs font-semibold text-slate-800 dark:text-white">{event.title}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">{event.description}</p>
                                  <p className="text-[9px] text-slate-400 mt-1">{formatDateTime(event.date)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">No timeline events available</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-8">Click a job to view details</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
