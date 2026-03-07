import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='relative flex flex-col sm:flex-row min-h-[320px] sm:min-h-[380px] border-b border-gray-200 overflow-hidden'>
      <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0 px-6 bg-gray-50'>
        <div className='text-gray-800 text-center sm:text-left max-w-md'>
          <div className='flex items-center justify-center sm:justify-start gap-2'>
            <span className='w-8 md:w-11 h-[2px] bg-gray-800' />
            <span className='font-medium text-xs md:text-sm tracking-widest'>OUR BESTSELLERS</span>
          </div>
          <h1 className='prata-regular text-3xl sm:text-4xl lg:text-5xl leading-tight py-4'>Latest Arrivals</h1>
          <p className='text-gray-600 text-sm mb-6'>Discover curated fashion and style for everyone.</p>
          <Link
            to='/collection'
            className='inline-flex items-center gap-2 font-medium text-sm border border-gray-800 px-6 py-3 hover:bg-gray-800 hover:text-white transition-colors'
          >
            SHOP NOW
            <span className='w-6 h-[1px] bg-current' />
          </Link>
        </div>
      </div>
      <div className='w-full sm:w-1/2 h-64 sm:h-auto min-h-[200px]'>
        <video
          className='w-full h-full object-cover'
          src={assets.hero_video}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  )
}

export default Hero
