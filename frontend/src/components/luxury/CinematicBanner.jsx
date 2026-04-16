import { Link } from 'react-router-dom'
import { pexelsImages } from '../../constants/images'
import RevealOnScroll from './RevealOnScroll'

const CinematicBanner = () => {
  return (
    <section className='relative h-[72vh] min-h-[440px] overflow-hidden sm:h-[82vh]'>
      {/* Background image */}
      <img
        src={pexelsImages.womanDarkEditorial}
        alt='Campagne Elite — beauté éditoriale'
        className='absolute inset-0 h-full w-full object-cover'
        loading='lazy'
      />

      {/* Layered dark gradients */}
      <div className='absolute inset-0 bg-gradient-to-t from-[#1C1917]/85 via-[#1C1917]/35 to-[#1C1917]/15' />
      <div className='absolute inset-0 bg-gradient-to-r from-[#1C1917]/30 to-transparent' />

      {/* Content */}
      <RevealOnScroll>
        <div className='absolute inset-0 flex flex-col items-center justify-end pb-16 text-center sm:pb-20 md:pb-24'>
          <span className='text-[9px] uppercase tracking-[0.4em] text-[#A16207] sm:text-[10px]'>
            Collection exclusive
          </span>

          <h2
            className='mt-5 max-w-4xl font-display font-semibold leading-[0.88] text-[#FAFAF9]'
            style={{ fontSize: 'clamp(2.5rem, 7.5vw, 7rem)' }}
          >
            Le glamour
            <br />
            <em className='font-normal italic text-[#D6D3D1]/80'>au naturel.</em>
          </h2>

          <p className='mx-auto mt-6 max-w-sm text-[0.85rem] leading-[1.8] text-[#A8A29E] sm:max-w-md sm:text-[0.9rem]'>
            Des textures pensées pour se fondre, des couleurs pour s&apos;affirmer.
            La beauté qui s&apos;oublie sur vous, mais que les autres remarquent.
          </p>

          <div className='mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10'>
            <Link to='/collection' className='luxury-btn-outline-dark'>
              Découvrir la collection
            </Link>
            <Link
              to='/collection?new=1'
              className='inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#A8A29E] transition-colors hover:text-[#FAFAF9]'
            >
              <span>Nouveautés</span>
              <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3' />
              </svg>
            </Link>
          </div>
        </div>
      </RevealOnScroll>

      {/* Caption */}
      <div className='absolute bottom-5 right-6 flex items-center gap-2.5'>
        <div className='h-px w-6 bg-white/20' />
        <span className='text-[8px] uppercase tracking-[0.35em] text-white/25'>
          Elite Beauté — 2025
        </span>
      </div>
    </section>
  )
}

export default CinematicBanner
