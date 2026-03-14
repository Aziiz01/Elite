import React, { useState, useEffect } from 'react'

const BackToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type='button'
      onClick={scrollToTop}
      aria-label='Back to top'
      className='fixed bottom-6 right-6 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'
    >
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M5 10l7-7m0 0l7 7m-7-7v18' />
      </svg>
    </button>
  )
}

export default BackToTop
