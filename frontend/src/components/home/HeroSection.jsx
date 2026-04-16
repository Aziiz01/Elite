import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pexelsImages } from '../../constants/images'

const slides = [
  {
    badge: "JUSQU'À -40%",
    title: 'Soldes',
    em: 'Printemps',
    desc: 'Votre nouvelle version vous attend déjà. Des formules pensées pour révéler votre éclat naturel.',
    cta: { label: 'Voir les offres', to: '/collection?deal=1' },
    cta2: { label: 'Tout voir', to: '/collection' },
    image: pexelsImages.womanGoldMakeup,
  },
  {
    badge: 'NOUVEAUTÉS',
    title: 'Collection',
    em: '2025',
    desc: 'Découvrez les nouvelles teintes de la saison. Pigments veloutés, formules légères, résultat couture.',
    cta: { label: 'Explorer', to: '/collection' },
    cta2: { label: 'Bestsellers', to: '/collection' },
    image: pexelsImages.womanPinkEyeshadow,
  },
  {
    badge: 'EXCLUSIVITÉ',
    title: 'Les essentiels',
    em: 'Maquillage',
    desc: 'Une sélection intemporelle pour un maquillage parfait au quotidien. Simple, élégant, efficace.',
    cta: { label: 'Découvrir', to: '/collection' },
    cta2: { label: 'Promotions', to: '/collection?deal=1' },
    image: pexelsImages.makeupFlatlay,
  },
]

const HeroSection = () => {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[active]

  return (
    <div className='bleed-x relative flex h-[420px] overflow-hidden bg-[#1C1917] sm:h-[480px] md:h-[520px]'>
      {/* Right: lifestyle image (desktop) */}
      <div className='absolute inset-y-0 right-0 hidden w-[58%] md:block'>
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.title}
          className='h-full w-full object-cover'
          loading='eager'
        />
        {/* Blend edge into dark left panel */}
        <div className='absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#1C1917] to-transparent' />
      </div>

      {/* Mobile: dim background image */}
      <div className='absolute inset-0 md:hidden'>
        <img
          key={`m-${slide.image}`}
          src={slide.image}
          alt=''
          aria-hidden='true'
          className='h-full w-full object-cover opacity-20'
          loading='eager'
        />
      </div>

      {/* Left: text content */}
      <div className='relative z-10 flex h-full w-full flex-col justify-center px-8 sm:px-12 md:w-[46%] md:px-14 lg:px-20'>
        {/* Sale badge */}
        <span className='inline-block w-fit bg-[#e02020] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white'>
          {slide.badge}
        </span>

        {/* Heading */}
        <h1
          className='mt-5 font-display font-semibold leading-[0.88] text-[#FAFAF9]'
          style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
        >
          {slide.title}
          <br />
          <em className='font-normal italic text-[#A16207]'>{slide.em}</em>
        </h1>

        {/* Divider */}
        <div className='mt-5 h-px w-10 bg-[#A16207]' />

        {/* Description */}
        <p className='mt-4 max-w-[32ch] text-[0.85rem] leading-[1.75] text-[#A8A29E]'>
          {slide.desc}
        </p>

        {/* CTAs */}
        <div className='mt-7 flex flex-wrap items-center gap-3'>
          <Link
            to={slide.cta.to}
            className='inline-flex h-10 cursor-pointer items-center bg-white px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1C1917] transition-colors hover:bg-[#FAFAF9]'
          >
            {slide.cta.label}
          </Link>
          <Link
            to={slide.cta2.to}
            className='inline-flex h-10 cursor-pointer items-center border border-white/25 px-5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/70 transition-all hover:border-white/60 hover:text-white'
          >
            {slide.cta2.label}
          </Link>
        </div>
      </div>

      {/* Dot navigation */}
      <div className='absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2'>
        {slides.map((_, i) => (
          <button
            key={i}
            type='button'
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`cursor-pointer transition-all duration-300 ${
              i === active
                ? 'h-1.5 w-6 bg-[#A16207]'
                : 'h-1.5 w-1.5 bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className='absolute bottom-5 right-6 z-20 hidden items-center gap-1.5 sm:flex'>
        <span className='text-[11px] font-medium text-white'>{active + 1}</span>
        <span className='text-[#57534E]'>/</span>
        <span className='text-[11px] text-[#57534E]'>{slides.length}</span>
      </div>
    </div>
  )
}

export default HeroSection
