import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { pexelsImages } from '../constants/images'

const NewsletterBox = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail('')
    toast.success('Thank you for subscribing!')
  }

  return (
    <section className='relative py-20 sm:py-24 md:py-28 min-h-[340px] flex items-center justify-center overflow-hidden' aria-label='Newsletter signup'>
      <img
        src={pexelsImages.womanPinkEyeshadowWide}
        alt=""
        className='absolute inset-0 w-full h-full object-cover'
        loading='lazy'
      />
      <div className='absolute inset-0 bg-black/50' />
      <div className='relative text-center max-w-xl mx-auto px-4'>
        {submitted ? (
          <>
            <p className='text-xl sm:text-2xl font-medium text-white'>Thank you for subscribing!</p>
            <p className='text-gray-200 mt-2 text-sm'>
              We'll send you exclusive offers and style tips.
            </p>
          </>
        ) : (
          <>
            <p className='text-xl sm:text-2xl font-medium text-white'>Subscribe & get 20% off</p>
            <p className='text-gray-200 mt-2 text-sm'>
              New arrivals, exclusive offers, and style tips—delivered to your inbox.
            </p>
            <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row gap-3 mt-6'>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='flex-1 border border-gray-300 rounded py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-white/95'
                type="email"
                placeholder='Enter your email'
                required
              />
              <button type='submit' className='bg-white text-gray-900 text-sm font-medium px-6 py-3 hover:bg-gray-100 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent'>
                SUBSCRIBE
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

export default NewsletterBox
