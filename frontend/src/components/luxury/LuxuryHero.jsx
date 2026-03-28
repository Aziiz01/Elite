import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import RevealOnScroll from './RevealOnScroll'

const LuxuryHero = () => {
  return (
    <section className='relative overflow-hidden rounded-[2rem] border border-[#e8dfd8] bg-[#f6f1ec] min-h-[78svh] mt-6 md:mt-10'>
      <video
        className='absolute inset-0 h-full w-full object-cover'
        src={assets.hero_video}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className='absolute inset-0 bg-gradient-to-r from-[#1f1a16]/75 via-[#1f1a16]/40 to-[#1f1a16]/15' />
      <div className='absolute inset-0 bg-gradient-to-t from-[#1f1a16]/30 via-transparent to-transparent' />

      <div className='relative z-10 flex h-full min-h-[78svh] items-end px-6 pb-10 pt-28 sm:px-10 sm:pb-14 md:px-16'>
        <RevealOnScroll className='max-w-2xl text-[#f8f2ec]'>
          <p className='uppercase tracking-[0.22em] text-[11px] sm:text-xs text-[#f5e6da]/90'>
            Sublimer la beaute au quotidien
          </p>
          <h1 className='mt-4 font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl'>
            Luxe discret
            <br />
            a chaque geste
          </h1>
          <p className='mt-5 max-w-xl text-sm sm:text-base text-[#f4e8de]/90 leading-relaxed'>
            Une garde-robe beaute pensee pour un teint lumineux, une confiance douce et une elegance intemporelle.
          </p>

          <div className='mt-8 flex flex-wrap gap-3 sm:gap-4'>
            <Link to='/collection' className='luxury-btn-primary'>
              Explorer la collection
            </Link>
            <a href='#brand-story' className='luxury-btn-secondary'>
              Decouvrir la maison
            </a>
          </div>

          <div className='mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-[#f2dfd0]/90'>
            <span>Formules clean</span>
            <span>Adapte aux peaux sensibles</span>
            <span>Livraison rapide en Tunisie</span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default LuxuryHero
