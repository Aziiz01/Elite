import React from 'react'
import { Link } from 'react-router-dom'
import { pexelsImages } from '../constants/images'

const CATEGORIES = [
  { label: 'Promotions', to: '/collection', query: '', image: pexelsImages.cosmeticProducts },
  { label: 'Women', to: '/collection', query: '?category=Women', image: pexelsImages.cosmeticProducts },
  { label: 'Men', to: '/collection', query: '?category=Men', image: pexelsImages.womanPinkEyeshadow },
  { label: 'Kids', to: '/collection', query: '?category=Kids', image: pexelsImages.cosmeticProducts },
  { label: 'Topwear', to: '/collection', query: '?subCategory=Topwear', image: pexelsImages.cosmeticProducts },
  { label: 'Winterwear', to: '/collection', query: '?subCategory=Winterwear', image: pexelsImages.womanPinkEyeshadow },
]

const CategoryStrip = () => {
  return (
    <section className='py-8 sm:py-12 border-b border-gray-200'>
      <p className='text-center text-xs font-medium tracking-widest text-gray-500 mb-6'>DISCOVER</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            to={cat.query ? `${cat.to}${cat.query}` : cat.to}
            className='group flex flex-col overflow-hidden'
          >
            <div className='aspect-square overflow-hidden bg-gray-100 mb-2'>
              <img
                src={cat.image}
                alt={cat.label}
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                loading='lazy'
              />
            </div>
            <span className='text-center text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors'>
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryStrip
