import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MdChevronLeft, MdChevronRight, MdToday,
  MdEvent, MdCircle
} from 'react-icons/md'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

const JobCalendar = ({ jobs, onJobClick, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // month, week, day

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getJobsForDate = (date) => {
    return jobs.filter(job => isSameDay(new Date(job.scheduled_date), date))
  }

  const getPriorityDot = (priority) => {
    const colors = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    }
    return colors[priority] || 'bg-gray-500'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-1">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg">
              <MdChevronLeft className="text-xl" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentDate(new Date())}
              className="p-2 hover:bg-gray-100 rounded-lg">
              <MdToday className="text-xl" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg">
              <MdChevronRight className="text-xl" />
            </motion.button>
          </div>
        </div>
        <div className="flex space-x-1">
          {['month', 'week', 'day'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize
                ${view === v ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const dayJobs = getJobsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.01 }}
              onClick={() => onDateClick(day)}
              className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-all
                ${isCurrentMonth ? 'bg-white hover:bg-blue-50' : 'bg-gray-50'}
                ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}`}
            >
              <span className={`text-sm font-medium mb-2 block
                ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                ${isToday ? 'text-blue-600' : ''}`}
              >
                {format(day, 'd')}
              </span>
              
              <div className="space-y-1">
                {dayJobs.slice(0, 3).map(job => (
                  <div key={job.id}
                    onClick={(e) => { e.stopPropagation(); onJobClick(job) }}
                    className="text-xs p-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 truncate cursor-pointer">
                    <span className={`inline-block w-2 h-2 rounded-full ${getPriorityDot(job.priority)} mr-1`}></span>
                    {job.client_name}
                  </div>
                ))}
                {dayJobs.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{dayJobs.length - 3} more
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Job Count Summary */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
        <span>{jobs.length} total jobs this month</span>
        <div className="flex items-center space-x-4">
          <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Urgent</span>
          <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-orange-500 mr-1"></span> High</span>
          <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span> Medium</span>
          <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span> Low</span>
        </div>
      </div>
    </div>
  )
}

export default JobCalendar
