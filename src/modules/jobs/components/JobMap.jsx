import React from 'react'
import { MdMap, MdLocationOn } from 'react-icons/md'

const JobMap = ({ jobs, onJobClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MdMap className="mr-2 text-blue-500" /> Job Locations Map
        </h3>
        <span className="text-sm text-gray-500">{jobs.length} jobs</span>
      </div>
      
      <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <MdLocationOn className="text-6xl mx-auto mb-2" />
          <p>Map view ready for Google Maps integration</p>
          <p className="text-sm mt-1">{jobs.length} job locations available</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {jobs.slice(0, 5).map(job => (
          <div key={job.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => onJobClick(job)}>
            <div className="flex items-center space-x-3">
              <MdLocationOn className="text-red-500" />
              <div>
                <p className="text-sm font-medium">{job.client_name}</p>
                <p className="text-xs text-gray-500">{job.address}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">{job.scheduled_time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobMap
