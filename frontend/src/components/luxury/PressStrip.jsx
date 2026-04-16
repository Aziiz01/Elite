import React from 'react'
import RevealOnScroll from './RevealOnScroll'

const publications = [
  'VOGUE',
  'ELLE',
  'MARIE CLAIRE',
  'GLAMOUR',
  'COSMOPOLITAN',
]

const PressStrip = () => {
  return (
    <section className='py-16 sm:py-20 md:py-24'>
      <div className='mx-auto max-w-[1280px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <RevealOnScroll>
          <p className='mb-8 text-center text-[9px] uppercase tracking-[0.3em] text-[#b5a99a] sm:mb-10 sm:text-[10px]'>
            Vu dans la presse
          </p>

          <div className='flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12 md:gap-x-16 lg:gap-x-20'>
            {publications.map((name, i) => (
              <React.Fragment key={name}>
                <span
                  className='font-display select-none cursor-default italic font-light text-[#c5b8ab] transition-colors duration-300 hover:text-[#7a6e65]'
                  style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}
                  aria-label={name}
                >
                  {name}
                </span>
                {i < publications.length - 1 && (
                  <span className='hidden h-3.5 w-px flex-shrink-0 bg-[#d8cfc6] sm:block' />
                )}
              </React.Fragment>
            ))}
          </div>

          <p className='mt-8 text-center text-[9px] uppercase tracking-[0.3em] text-[#c5b8ab] sm:mt-10'>
            Nos produits favoris des rédactrices beauté
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default PressStrip
