import { Link } from 'react-router-dom'
import { pexelsImages } from '../../constants/images'
import RevealOnScroll from './RevealOnScroll'

const panels = [
  {
    image: pexelsImages.womanGoldMakeup,
    label: 'Teint',
    title: 'Éclat doré',
    span: 'tall',
  },
  {
    image: pexelsImages.luxuryPerfume,
    label: 'Soins',
    title: 'Rituel du soir',
    span: 'normal',
  },
  {
    image: pexelsImages.makeupBrushes,
    label: 'Yeux',
    title: 'Regard profond',
    span: 'normal',
  },
]

const LookbookSection = () => {
  return (
    <section className='border-t border-[#D6D3D1] bg-white py-20 sm:py-24 md:py-28'>
      <div className='mx-auto max-w-[1280px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <RevealOnScroll>
          <div className='mb-10 flex items-end justify-between sm:mb-14'>
            <div>
              <span className='luxury-eyebrow'>Lookbook</span>
              <h2
                className='mt-4 font-display leading-[0.92] text-[#1C1917]'
                style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.8rem)' }}
              >
                La collection
                <br />
                <em className='font-normal italic text-[#A8A29E]'>printemps 2025.</em>
              </h2>
            </div>
            <Link to='/collection' className='luxury-link group shrink-0 self-end'>
              <span>Explorer</span>
              <svg className='h-3 w-3 transition-transform duration-300 group-hover:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.8}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3' />
              </svg>
            </Link>
          </div>
        </RevealOnScroll>

        {/* Asymmetric editorial grid */}
        <div className='grid gap-3 sm:gap-3 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.15fr_1fr]'>
          {/* Left: tall panel */}
          <RevealOnScroll>
            <Link
              to={`/collection?category=${encodeURIComponent(panels[0].label)}`}
              className='group relative block overflow-hidden bg-[#D6D3D1]'
              style={{ aspectRatio: '4/5' }}
            >
              <img
                src={panels[0].image}
                alt={panels[0].title}
                className='absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-[#1C1917]/75 via-[#1C1917]/15 to-transparent' />
              <div className='absolute inset-x-0 bottom-0 p-6 sm:p-8'>
                <span className='text-[9px] uppercase tracking-[0.35em] text-[#A16207]'>
                  {panels[0].label}
                </span>
                <h3
                  className='mt-2 font-display text-[#FAFAF9]'
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)' }}
                >
                  {panels[0].title}
                </h3>
                <div className='mt-3 flex items-center gap-2 text-[#FAFAF9]/75 opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0'>
                  <span className='text-[9px] uppercase tracking-[0.25em]'>Découvrir</span>
                  <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3' />
                  </svg>
                </div>
              </div>
            </Link>
          </RevealOnScroll>

          {/* Right: two stacked panels */}
          <div className='flex flex-col gap-3'>
            {panels.slice(1).map((panel, i) => (
              <RevealOnScroll key={panel.label} delay={i * 120}>
                <Link
                  to={`/collection?category=${encodeURIComponent(panel.label)}`}
                  className='group relative block overflow-hidden bg-[#D6D3D1]'
                  style={{ aspectRatio: '4/3' }}
                >
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className='absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]'
                    loading='lazy'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/15 to-transparent' />
                  <div className='absolute inset-x-0 bottom-0 p-5 sm:p-6'>
                    <span className='text-[9px] uppercase tracking-[0.35em] text-[#A16207]'>
                      {panel.label}
                    </span>
                    <h3
                      className='mt-1.5 font-display text-[#FAFAF9]'
                      style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.2rem)' }}
                    >
                      {panel.title}
                    </h3>
                    <div className='mt-2.5 h-px w-0 bg-[#A16207] transition-all duration-500 ease-out group-hover:w-10' />
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LookbookSection
