import React from 'react'
import { Link } from 'react-router-dom'
import { pexelsImages } from '../../constants/images'
import RevealOnScroll from './RevealOnScroll'

const BrandStorySection = () => {
  return (
    <section id='brand-story' className='pt-20 sm:pt-24 md:pt-28'>
      <div className='grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center'>
        <RevealOnScroll>
          <div className='overflow-hidden rounded-3xl border border-[#ece2d9] bg-[#f5eee7]'>
            <img
              src={pexelsImages.womanPinkEyeshadowWide}
              alt='Portrait beaute elegant'
              className='h-full w-full object-cover'
              loading='lazy'
            />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <p className='luxury-eyebrow'>Notre identite</p>
          <h2 className='luxury-heading mt-3'>Une beaute naturelle, jamais excessive.</h2>
          <p className='mt-5 max-w-xl text-sm sm:text-base text-[#5f4d41] leading-relaxed'>
            Elite est nee pour les femmes qui veulent une beaute soignee sans surcharge. Chaque teinte, texture et
            fini est choisi pour accompagner votre journee, du matin discret a l'eclat du soir.
          </p>
          <p className='mt-3 max-w-xl text-sm sm:text-base text-[#5f4d41] leading-relaxed'>
            Le resultat: un rituel propre, sensuel et moderne, concu pour reveler votre confiance, pas pour la cacher.
          </p>

          <div className='mt-8'>
            <Link to='/about' className='luxury-link'>
              Lire notre histoire
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default BrandStorySection
