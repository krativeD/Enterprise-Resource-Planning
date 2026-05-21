import React from 'react'
import { motion } from 'framer-motion'
import { MdLocationOn, MdTimer, MdPerson, MdCheckCircle, MdCancel, MdWarning, MdStar } from 'react-icons/md'

const JobList = ({ jobs, loading, onJobClick, onAssign, onComplete, onCancel, searchTerm, filters }) => {
  const filteredJobs = jobs.filter(job => {
    if (searchTerm && !job.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !job.job_id?.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (filters.status !== 'all' && job.status !== filters.status) return false
    if (filters.priority !== 'all' && job.priority !== filters.priority) return false
    if (filters.type !== 'all' && job.job_type !== filters.type) return false
    return true
  })

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return badges[status] || badges.pending
  }

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return badges[priority] || badges.medium
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border-b">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left text-sm font-medium">Job ID</th>
              <th className="p-4 text-left text-sm font-medium">Client</th>
              <th className="p-4 text-left text-sm font-medium">Type</th>
              <th className="p-4 text-left text-sm font-medium">Date/Time</th>
              <th className="p-4 text-left text-sm font-medium">Priority</th>
              <th className="p-4 text-left text-sm font-medium">Status</th>
              <th className="p-4 text-left text-sm font-medium">Assignees</th>
              <th className="p-4 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-gray-500">
                  No jobs found
                </td>
              </tr>
            ) : (
              filteredJobs.map((job, index) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => onJobClick(job)}
                >
                  <td className="p-4 font-mono text-sm text-blue-600">{job.job_id}</td>
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{job.client_name}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MdLocationOn className="mr-1" /> {job.address}
                    </div>
                  </td>
                  <td className="p-4 text-sm capitalize">{job.job_type?.replace(/_/g, ' ')}</td>
                  <td className="p-4 text-sm">
                    <div>{job.scheduled_date}</div>
                    <div className="text-gray-500">{job.scheduled_time}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadge(job.priority)}`}>
                      {job.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                      {job.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex -space-x-2">
                      {job.assignees?.slice(0, 3).map((a, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs">
                          {a.name?.[0] || '?'}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      {job.status === 'pending' && (
                        <button onClick={(e) => { e.stopPropagation(); onAssign(job.id) }}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs">Assign</button>
                      )}
                      {job.status === 'in_progress' && (
                        <button onClick={(e) => { e.stopPropagation(); onComplete(job.id) }}
                          className="px-3 py-1 bg-green-500 text-white rounded text-xs">Complete</button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default JobList
