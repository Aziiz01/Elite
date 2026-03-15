import React from 'react'

const Title = ({ text1, text2, as: Tag = 'div' }) => {
  return (
    <Tag className='inline-flex flex-wrap gap-x-2 gap-y-1 items-baseline'>
      <span className='text-xs sm:text-sm font-medium tracking-widest text-gray-500 uppercase'>{text1}</span>
      <span className='font-display text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight'>{text2}</span>
      <span className='w-8 sm:w-12 h-[2px] bg-gray-300 flex-shrink-0' aria-hidden />
    </Tag>
  )
}

export default Title
