import React from 'react'

const SkeletonBook = () => {
  return (
    <div className="flex flex-col items-center  p-4 cursor-pointer">
        <div className="w-52 h-80 mb-2 rounded-lg bg-gray-300"></div>
        <div className="w-52 h-12 bg-gray-200 rounded-lg"></div>
        </div>
  )
}

export default SkeletonBook