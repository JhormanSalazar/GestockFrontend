import React from 'react'

export default function Banner({ title = 'Gestock' }) {
  return (
    <div className="flex justify-center mb-6">
      <span className="text-4xl font-bold text-blue-600 dark:text-blue-500">{title}</span>
    </div>
  )
}
