import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHeroSlides } from '../api/client'
import { assets } from '../assets/assets'
import { pexelsImages } from '../constants/images'

const DEFAULT_SLIDES = [
  { _id: 'd1', type: 'video', src: assets.hero_video, title: 'Essentiels nouvelle saison', subtitle: 'Mode et beauté pour une confiance au quotidien.', ctaLabel: 'Découvrir', ctaTo: '/collection' },
  { _id: 'd2', type: 'image', src: pexelsImages.womanPinkEyeshadowWide, title: 'L\'Édit Beauté', subtitle: 'Maquillage, soins et parfums soigneusement sélectionnés.', ctaLabel: 'Découvrir', ctaTo: '/collection' },
  { _id: 'd3', type: 'image', src: pexelsImages.cosmeticProductsWide, title: 'Sélections Premium', subtitle: 'Meilleures ventes choisies par nos experts.', ctaLabel: 'Voir la collection', ctaTo: '/collection' },
]

const HeroCarousel = () => {
  const [slides, setSlides] = useState(DEFAULT_SLIDES)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    getHeroSlides()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : []
        if (data.length > 0) setSlides(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  return (
    <section
      aria-label='Carrousel principal'
      className='relative w-screen left-1/2 -translate-x-1/2 overflow-hidden border-b border-gray-200'
    >
      <div className='relative h-[65vh] min-h-[400px] max-h-[720px]'>
        {slides.map((slide, index) => {
          const isActive = index === currentIndex
          return (
            <div
              key={slide._id || slide.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {slide.type === 'video' ? (
                <video
                  className='w-full h-full object-cover'
                  src={slide.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img src={slide.src} alt={slide.title} className='w-full h-full object-cover' />
              )}
              <div className='absolute inset-0 flex items-center'>
                <div className='max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12'>
                  <div className='max-w-xl text-white'>
                    <h1 className='font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight'>
                      {slide.title}
                    </h1>
                    <p className='mt-3 sm:mt-4 text-sm sm:text-base text-white/90'>
                      {slide.subtitle}
                    </p>
                    {slide.ctaLabel?.trim() && slide.ctaTo?.trim() && (
                      <Link
                        to={slide.ctaTo}
                        className='inline-flex items-center gap-2 mt-6 bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-100 transition-colors'
                      >
                        {slide.ctaLabel}
                        <span aria-hidden>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <button
          type='button'
          aria-label='Diapositive précédente'
          onClick={goPrev}
          className='absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-gray-900 hover:bg-white transition-colors'
        >
          ←
        </button>
        <button
          type='button'
          aria-label='Diapositive suivante'
          onClick={goNext}
          className='absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-gray-900 hover:bg-white transition-colors'
        >
          →
        </button>

        <div className='absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2'>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type='button'
              aria-label={`Aller à la diapositive ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroCarousel
