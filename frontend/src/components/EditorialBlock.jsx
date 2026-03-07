import React from 'react'
import { Link } from 'react-router-dom'
import { pexelsImages } from '../constants/images'

const CARDS = [
  {
    title: 'Find your style',
    description: 'Explore our collection and find pieces that match your personality.',
    to: '/collection',
    label: 'Shop collection',
    image: pexelsImages.cosmeticProducts,
  },
  {
    title: 'Easy returns',
    description: '7-day return policy. No hassle, no questions.',
    to: '/about',
    label: 'Learn more',
    image: pexelsImages.cosmeticProducts,
  },
  {
    title: 'Gift guide',
    description: 'Perfect picks for every occasion.',
    to: '/collection',
    label: 'Discover',
    image: pexelsImages.womanPinkEyeshadow,
  },
]

const EditorialBlock = () => {
  return (
    <section className='my-10 sm:my-14 py-10 border-y border-gray-200'>
      <p className='text-center text-xs font-medium tracking-widest text-gray-500 mb-8'>FOR YOU</p>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {CARDS.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className='group block overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300'
          >
            <div className='aspect-[4/3] overflow-hidden bg-gray-100'>
              <img
                src={card.image}
                alt=""
                className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                loading='lazy'
              />
            </div>
            <div className='p-5'>
              <h3 className='font-medium text-gray-900 group-hover:underline'>{card.title}</h3>
              <p className='text-sm text-gray-500 mt-2'>{card.description}</p>
              <span className='inline-block mt-4 text-sm font-medium text-gray-700 group-hover:text-gray-900'>
                {card.label} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default EditorialBlock
