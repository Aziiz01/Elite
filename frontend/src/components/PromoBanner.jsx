import React from 'react'
import { Link } from 'react-router-dom'
import { pexelsImages } from '../constants/images'

const PROMOS = [
  {
    title: 'Up to 20% off',
    subtitle: 'Selected items',
    cta: 'Shop sale',
    to: '/collection',
    image: pexelsImages.cosmeticProductsWide,
  },
  {
    title: 'Free delivery',
    subtitle: 'On orders over 50 Dt',
    cta: 'Shop now',
    to: '/collection',
    image: pexelsImages.womanPinkEyeshadowWide,
  },
]

const PromoBanner = () => {
  return (
    <section className='pt-6 sm:pt-8 pb-4 border-b border-gray-200'>
      <p className='text-center text-xs font-medium tracking-widest text-gray-500 mb-6'>OFFERS</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {PROMOS.map((promo, i) => (
          <Link
            key={i}
            to={promo.to}
            className='group relative block min-h-[140px] sm:min-h-[180px] overflow-hidden rounded-sm'
          >
            <img
              src={promo.image}
              alt=""
              className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
              loading='lazy'
            />
            <div className='absolute inset-0 bg-black/40 group-hover:bg-black/35 transition-colors' />
            <div className='relative h-full min-h-[140px] sm:min-h-[180px] flex flex-col justify-center px-6 sm:px-8 text-white'>
              <p className='text-xs font-medium tracking-widest opacity-95'>{promo.subtitle}</p>
              <p className='text-lg sm:text-xl font-medium mt-1'>{promo.title}</p>
              <span className='text-sm font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all'>
                {promo.cta}
                <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default PromoBanner
