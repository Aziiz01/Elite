import { Link } from 'react-router-dom'
import { pexelsImages } from '../../constants/images'
import RevealOnScroll from './RevealOnScroll'

const BrandStorySection = () => {
  return (
    <section id='brand-story' className='relative overflow-hidden bg-[#F0EDE8]'>
      <div className='mx-auto max-w-[1280px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <div className='grid gap-12 py-20 sm:py-24 md:py-28 lg:grid-cols-2 lg:gap-16 xl:gap-24'>

          {/* Left: Images */}
          <RevealOnScroll>
            <div className='relative lg:-ml-[2vw]'>
              {/* Main tall image */}
              <div className='aspect-[4/5] overflow-hidden'>
                <img
                  src={pexelsImages.womanPinkEyeshadowWide}
                  alt='Beauté Elite — portrait éditorial'
                  className='h-full w-full object-cover'
                  loading='lazy'
                />
              </div>

              {/* Floating accent image */}
              <div className='absolute -bottom-6 -right-4 w-[42%] sm:-right-6 sm:w-[38%] border-4 border-[#F0EDE8] overflow-hidden aspect-[3/4] shadow-2xl'>
                <img
                  src={pexelsImages.womanRedLips}
                  alt='Lèvres Elite — détail éditorial'
                  className='h-full w-full object-cover'
                  loading='lazy'
                />
              </div>

              <div className='mt-10 flex items-center gap-3'>
                <div className='h-px flex-1 bg-[#D6D3D1]' />
                <span className='text-[9px] uppercase tracking-[0.3em] text-[#A8A29E]'>
                  Campagne printemps 2025
                </span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Right: Text */}
          <RevealOnScroll delay={150}>
            <div className='flex flex-col justify-center lg:py-12'>
              <span className='luxury-eyebrow'>Notre philosophie</span>

              <h2
                className='mt-5 font-display leading-[0.92] text-[#1C1917]'
                style={{ fontSize: 'clamp(1.9rem, 4vw, 3.4rem)' }}
              >
                Beauté naturelle,
                <br />
                <em className='font-normal italic text-[#A8A29E]'>jamais excessive.</em>
              </h2>

              <div className='mt-7 h-px w-10 bg-[#A16207]' />

              <p className='mt-7 max-w-[42ch] text-[0.9rem] leading-[1.8] text-[#57534E] sm:text-[0.95rem]'>
                Elite est née pour les femmes qui veulent une beauté soignée sans
                surcharge. Chaque teinte, texture et fini est choisi pour
                accompagner votre journée, du matin discret à l&apos;éclat du soir.
              </p>

              <p className='mt-4 max-w-[42ch] text-[0.9rem] leading-[1.8] text-[#57534E] sm:text-[0.95rem]'>
                Le résultat : un rituel propre, sensuel et moderne, conçu pour
                révéler votre confiance, pas pour la cacher.
              </p>

              {/* Stats */}
              <div className='mt-10 grid grid-cols-3 gap-6 sm:gap-10'>
                {[
                  { value: '100+', label: 'Teintes' },
                  { value: '4.8', label: 'Note moyenne' },
                  { value: '3K+', label: 'Clientes' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p
                      className='font-display font-semibold text-[#A16207]'
                      style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.6rem)' }}
                    >
                      {value}
                    </p>
                    <p className='mt-1 text-[9px] uppercase tracking-[0.22em] text-[#A8A29E] sm:text-[10px]'>
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div className='mt-10'>
                <Link to='/about' className='luxury-link group'>
                  <span>Lire notre histoire</span>
                  <svg
                    className='h-3 w-3 transition-transform duration-300 group-hover:translate-x-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    strokeWidth={1.8}
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3' />
                  </svg>
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}

export default BrandStorySection
