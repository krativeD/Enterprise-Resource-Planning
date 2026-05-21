import React from 'react'
import { MdStar, MdStarBorder } from 'react-icons/md'

const ClientFeedback = ({ client }) => {
  const feedbacks = [
    { id: 1, rating: 5, comment: 'Excellent service!', date: '2024-03-10', job: 'Office Cleaning' },
    { id: 2, rating: 4, comment: 'Very professional team', date: '2024-02-28', job: 'Deep Clean' },
    { id: 3, rating: 5, comment: 'Always on time', date: '2024-02-15', job: 'Window Cleaning' },
  ]

  return (
    <div className="space-y-4">
      {feedbacks.map(fb => (
        <div key={fb.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                i < fb.rating ? <MdStar key={i} className="text-yellow-400" /> : <MdStarBorder key={i} className="text-gray-300" />
              ))}
            </div>
            <span className="text-xs text-gray-500">{fb.date}</span>
          </div>
          <p className="text-sm text-gray-700">{fb.comment}</p>
          <p className="text-xs text-gray-400 mt-1">{fb.job}</p>
        </div>
      ))}
    </div>
  )
}

export default ClientFeedback
