import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdWork, MdSchedule, MdMap, MdDirections, MdPerson, MdGroup,
  MdAdd, MdSearch, MdFilterList, MdRefresh, MdWarning,
  MdCheckCircle, MdCancel, MdTimer, MdLocationOn, MdAssignment,
  MdBuild, MdStar, MdPriorityHigh, MdEvent, MdToday,
  MdViewModule, MdViewList, MdCalendarViewMonth, MdTimeline,
  MdLocalShipping, MdCleaningServices, MdHome, MdBusiness
} from 'react-icons/md'
import JobList from '../components/JobList'
import JobForm from '../components/JobForm'
import JobDetails from '../components/JobDetails'
import JobCalendar from '../components/JobCalendar'
import JobMap from '../components/JobMap'
import DispatchBoard from '../components/DispatchBoard'
import JobKanban from '../components/JobKanban'
import JobStats from '../components/JobStats'
import QuickAssign from '../components/QuickAssign'
import EmergencyJob from '../components/EmergencyJob'
import { useJobData } from '../hooks/useJobData'
import { useToast } from '../../../hooks/useToast'

const JobScheduling = () => {
  const [activeView, setActiveView] = useState('board') // board, list, calendar, map
  const [selectedJob, setSelectedJob] = useState(null)
  const [showJobForm, setShowJobForm] = useState(false)
  const [showEmergencyForm, setShowEmergencyForm] = useState(false)
  const [showQuickAssign, setShowQuickAssign] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    date: 'today',
    type: 'all',
    assignedTo: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')

  const {
    jobs,
    loading,
    error,
    stats,
    createJob,
    updateJob,
    assignJob,
    completeJob,
    cancelJob,
    refreshJobs
  } = useJobData()

  const { showToast } = useToast()

  // Auto-refresh jobs every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshJobs, 30000)
    return () => clearInterval(interval)
  }, [])

  const views = [
    { id: 'board', label: 'Dispatch Board', icon: MdViewModule },
    { id: 'kanban', label: 'Kanban Board', icon: MdTimeline },
    { id: 'list', label: 'Job List', icon: MdViewList },
    { id: 'calendar', label: 'Calendar', icon: MdCalendarViewMonth },
    { id: 'map', label: 'Map View', icon: MdMap }
  ]

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData)
      showToast('Job created successfully', 'success')
      setShowJobForm(false)
    } catch (error) {
      showToast('Error creating job', 'error')
    }
  }

  const handleAssignJob = async (jobId, cleanerIds) => {
    try {
      await assignJob(jobId, cleanerIds)
      showToast('Job assigned successfully', 'success')
      setShowQuickAssign(false)
    } catch (error) {
      showToast('Error assigning job', 'error')
    }
  }

  const handleCompleteJob = async (jobId) => {
    try {
      await completeJob(jobId)
      showToast('Job completed successfully', 'success')
    } catch (error) {
      showToast('Error completing job', 'error')
    }
  }

  const handleCancelJob = async (jobId, reason) => {
    try {
      await cancelJob(jobId, reason)
      showToast('Job cancelled', 'success')
    } catch (error) {
      showToast('Error cancelling job', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <MdWork className="text-4xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Job Scheduling & Dispatch</h1>
                <p className="text-blue-200 mt-1">
                  Manage cleaning jobs, assign teams, and track progress in real-time
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmergencyForm(true)}
                className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 
                         transition-colors font-medium flex items-center space-x-2 shadow-lg"
              >
                <MdWarning /> <span>Emergency Job</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowJobForm(true)}
                className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 
                         transition-colors font-medium flex items-center space-x-2 shadow-lg"
              >
                <MdAdd /> <span>Create Job</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* View Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {views.map((view) => {
              const Icon = view.icon
              return (
                <motion.button
                  key={view.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-t-xl transition-all
                    ${activeView === view.id
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'bg-transparent text-blue-100 hover:bg-white/10'}`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden md:inline">{view.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-4">
        <JobStats stats={stats} />
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search jobs by client, address, or job ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">All Priority</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white"
            >
              <option value="all">All Types</option>
              <option value="office">Office Cleaning</option>
              <option value="residential">Residential</option>
              <option value="deep_clean">Deep Clean</option>
              <option value="carpet">Carpet</option>
              <option value="window">Window</option>
              <option value="sanitization">Sanitization</option>
              <option value="pest_control">Pest Control</option>
              <option value="garden">Garden Services</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshJobs}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                       transition-colors flex items-center space-x-2"
            >
              <MdRefresh className={loading ? 'animate-spin' : ''} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <AnimatePresence mode="wait">
          {activeView === 'board' && (
            <motion.div
              key="board"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DispatchBoard
                jobs={jobs}
                loading={loading}
                onJobClick={setSelectedJob}
                onAssign={(jobId) => { setSelectedJob(jobs.find(j => j.id === jobId)); setShowQuickAssign(true) }}
                onComplete={handleCompleteJob}
                onCancel={handleCancelJob}
              />
            </motion.div>
          )}

          {activeView === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <JobKanban
                jobs={jobs}
                loading={loading}
                onJobClick={setSelectedJob}
                onStatusChange={updateJob}
              />
            </motion.div>
          )}

          {activeView === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <JobList
                jobs={jobs}
                loading={loading}
                onJobClick={setSelectedJob}
                onAssign={(jobId) => handleAssignJob(jobId)}
                onComplete={handleCompleteJob}
                onCancel={handleCancelJob}
                searchTerm={searchTerm}
                filters={filters}
              />
            </motion.div>
          )}

          {activeView === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <JobCalendar
                jobs={jobs}
                onJobClick={setSelectedJob}
                onDateClick={(date) => {
                  setShowJobForm(true)
                }}
              />
            </motion.div>
          )}

          {activeView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <JobMap
                jobs={jobs}
                onJobClick={setSelectedJob}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Job Form Modal */}
      <AnimatePresence>
        {showJobForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Create New Job</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowJobForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-6">
                <JobForm
                  onSubmit={handleCreateJob}
                  onCancel={() => setShowJobForm(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Job Modal */}
      <AnimatePresence>
        {showEmergencyForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-red-50 border-b border-red-200 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold text-red-800 flex items-center">
                  <MdWarning className="mr-2" /> Emergency Job Request
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEmergencyForm(false)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-6">
                <EmergencyJob
                  onSubmit={(data) => {
                    handleCreateJob({ ...data, priority: 'urgent', is_emergency: true })
                    setShowEmergencyForm(false)
                  }}
                  onCancel={() => setShowEmergencyForm(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Assign Modal */}
      <AnimatePresence>
        {showQuickAssign && selectedJob && (
          <QuickAssign
            job={selectedJob}
            onAssign={(cleanerIds) => handleAssignJob(selectedJob.id, cleanerIds)}
            onClose={() => { setShowQuickAssign(false); setSelectedJob(null) }}
          />
        )}
      </AnimatePresence>

      {/* Job Details Side Panel */}
      <AnimatePresence>
        {selectedJob && !showQuickAssign && activeView !== 'board' && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-40 overflow-y-auto"
          >
            <JobDetails
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onAssign={() => setShowQuickAssign(true)}
              onComplete={() => handleCompleteJob(selectedJob.id)}
              onCancel={(reason) => handleCancelJob(selectedJob.id, reason)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default JobScheduling
