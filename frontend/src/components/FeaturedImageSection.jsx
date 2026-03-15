import React from 'react'
import { Link } from 'react-router-dom'
import { pexelsImages } from '../constants/images'

const FeaturedImageSection = () => {
  return (
    <section className='py-16 sm:py-20 md:py-24 border-b border-gray-200' aria-labelledby='brand-highlight-heading'>
      <div className='max-w-7xl mx-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-0'>
        <div className='relative min-h-[300px] sm:min-h-[400px] order-2 md:order-1'>
          <img
            src={pexelsImages.cosmeticProductsWide}
            alt="Premium beauty and fashion collection"
            className='absolute inset-0 w-full h-full object-cover'
            loading='lazy'
          />
        </div>
        <div className='flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 order-1 md:order-2 bg-gray-50'>
          <p className='text-xs font-medium tracking-widest text-gray-500 mb-3'>CURATED FOR YOU</p>
          <h2 className='font-display text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight'>
            Premium Fashion & Beauty
          </h2>
          <p className='text-gray-600 mt-4 text-sm sm:text-base'>
            Discover our handpicked selection of elegant fashion and beauty essentials. From everyday staples to statement pieces—find what speaks to you.
          </p>
          <Link
            to='/collection'
            className='inline-flex items-center gap-2 mt-6 text-sm font-medium text-gray-900 border-b border-gray-900 pb-1 w-fit hover:opacity-70 transition-opacity'
          >
            Explore collection
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
      </div>
    </section>
  )
}

export default FeaturedImageSection
