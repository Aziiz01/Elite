import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const PromoStrip = () => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className='relative z-50 bg-black text-white text-center text-xs sm:text-sm py-2 px-4'>
      <Link to='/collection' className='hover:opacity-90 transition-opacity'>
        Free delivery on orders over $50 — Shop now
      </Link>
      <button
        type='button'
        onClick={() => setDismissed(true)}
        aria-label='Dismiss'
        className='absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1'
      >
        ✕
      </button>
    </div>
  )
}

export default PromoStrip
