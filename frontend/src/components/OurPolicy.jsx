import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <section className='py-16 sm:py-20 border-b border-gray-200' aria-label='Store policies'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-8 lg:gap-12 text-center text-sm text-gray-700'>
      <div>
        <img src={assets.exchange_icon} className='w-11 h-11 m-auto mb-4 object-contain' alt="" />
        <p className='font-semibold text-gray-900'>Easy Exchange</p>
        <p className='text-gray-500 mt-1'>Hassle-free exchange policy</p>
      </div>
      <div>
        <img src={assets.quality_icon} className='w-11 h-11 m-auto mb-4 object-contain' alt="" />
        <p className='font-semibold text-gray-900'>7-Day Returns</p>
        <p className='text-gray-500 mt-1'>Free return within 7 days</p>
      </div>
      <div>
        <img src={assets.support_img} className='w-11 h-11 m-auto mb-4 object-contain' alt="" />
        <p className='font-semibold text-gray-900'>Customer Support</p>
        <p className='text-gray-500 mt-1'>We're here to help</p>
      </div>
      </div>
      </div>
    </section>
  )
}

export default OurPolicy
