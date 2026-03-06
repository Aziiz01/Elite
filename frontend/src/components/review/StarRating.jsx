import React from 'react'
import { assets } from '../../assets/assets'

const StarRating = ({ rating, size = 'sm' }) => {
  const r = Math.min(5, Math.max(0, Number(rating) || 0))
  const sizeClass = size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'

  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((i) => (
        <img
          key={i}
          src={i <= r ? assets.star_icon : assets.star_dull_icon}
          alt=''
          className={sizeClass}
        />
      ))}
    </div>
  )
}

export default StarRating
