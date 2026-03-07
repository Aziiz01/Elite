import React from 'react'
import { pexelsVideoEmbed } from '../constants/images'

const VideoSection = () => {
  const isMp4 = pexelsVideoEmbed?.endsWith('.mp4')

  return (
    <section className='py-14 sm:py-20 border-b border-gray-200 overflow-hidden'>
      <div className='text-center mb-8'>
        <p className='text-xs font-medium tracking-widest text-gray-500 mb-2'>BRAND STORY</p>
        <h2 className='text-2xl sm:text-3xl font-medium text-gray-900'>The Art of Beauty</h2>
        <p className='text-gray-500 text-sm sm:text-base mt-2 max-w-xl mx-auto'>
          Discover our approach to makeup—elegant, effortless, and empowering. Watch how we bring beauty to life.
        </p>
      </div>
      <div className='relative w-screen left-1/2 -translate-x-1/2 aspect-video bg-gray-100'>
        {isMp4 ? (
          <video
            src={pexelsVideoEmbed}
            className='absolute inset-0 w-full h-full object-cover'
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <iframe
            src={`${pexelsVideoEmbed}${pexelsVideoEmbed.includes('?') ? '&' : '?'}autoplay=1&muted=1&loop=1`}
            title='Beauty & makeup brand video'
            className='absolute inset-0 w-full h-full'
            allowFullScreen
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          />
        )}
      </div>
    </section>
  )
}

export default VideoSection
