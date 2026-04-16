/* eslint-disable react/prop-types */
import { useRef } from 'react'
import { pexelsImages } from '../../constants/images'

const reviews = [
  {
    quote: 'La texture est incroyable. On dirait un soin avec une couleur couture. Je ne peux plus m\'en passer au quotidien.',
    reviewer: { name: 'Nour A.', initial: 'N', role: 'Cliente', rating: 5, date: '10 avr. 2026' },
    product: { name: 'Rouge à Lèvres Velours', type: 'Lèvres', image: pexelsImages.womanLipstick },
  },
  {
    quote: 'Enfin un maquillage qui paraît luxueux et reste facile à porter tous les jours. Je recommande !',
    reviewer: { name: 'Salma K.', initial: 'S', role: 'Cliente fidèle', rating: 5, date: '8 avr. 2026' },
    product: { name: 'Fond de Teint Éclat', type: 'Teint', image: pexelsImages.womanPinkEyeshadow },
  },
  {
    quote: 'Des teintes élégantes, un fini propre. Le mascara tient toute la journée, c\'est rare.',
    reviewer: { name: 'Meriem B.', initial: 'M', role: 'Maquilleuse', rating: 5, date: '5 avr. 2026' },
    product: { name: 'Mascara Volumisant', type: 'Yeux', image: pexelsImages.cosmeticProducts },
  },
  {
    quote: 'Livraison rapide, produit conforme à la description. Le packaging est soigné. Je reviendrai !',
    reviewer: { name: 'Yasmine H.', initial: 'Y', role: 'Cliente', rating: 4, date: '2 avr. 2026' },
    product: { name: 'Palette Yeux Nude', type: 'Yeux', image: pexelsImages.makeupBrushes },
  },
]

/* ─── Star row ─── */
const Stars = ({ n }) => (
  <span className='flex gap-0.5'>
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`text-[10px] leading-none ${i <= n ? 'text-[#A16207]' : 'text-[#D6D3D1]'}`}
        aria-hidden='true'
      >
        ★
      </span>
    ))}
  </span>
)

/* ─── Arrow icon ─── */
const Arrow = ({ dir }) => (
  <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
    />
  </svg>
)

/* ─── Review card ─── */
const ReviewCard = ({ review }) => (
  <article className='flex w-[260px] flex-shrink-0 flex-col border border-[#E5E5E5] bg-white p-5 sm:w-[280px]'>
    {/* Product thumbnail */}
    <div className='mb-4 flex items-center gap-3'>
      <img
        src={review.product.image}
        alt={review.product.name}
        className='h-12 w-12 flex-shrink-0 bg-[#F5F5F5] object-cover'
        loading='lazy'
      />
      <div className='min-w-0'>
        <p className='line-clamp-1 text-[12px] font-medium text-[#1C1917]'>
          {review.product.name}
        </p>
        <p className='text-[10px] uppercase tracking-[0.12em] text-[#A8A29E]'>
          {review.product.type}
        </p>
      </div>
    </div>

    {/* Opening quote */}
    <span
      className='-mb-3 font-display text-[5rem] leading-none text-[#F0EDE8] select-none'
      aria-hidden='true'
    >
      &ldquo;
    </span>

    {/* Quote text */}
    <p className='mt-2 line-clamp-3 flex-1 text-[13px] leading-[1.65] text-[#57534E]'>
      {review.quote}
    </p>

    {/* Reviewer */}
    <div className='mt-5 flex items-center gap-3'>
      <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1C1917] text-[11px] font-bold text-white'>
        {review.reviewer.initial}
      </div>
      <div className='min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='text-[12px] font-semibold text-[#1C1917]'>{review.reviewer.name}</span>
          <Stars n={review.reviewer.rating} />
        </div>
        <p className='text-[10px] text-[#A8A29E]'>{review.reviewer.date}</p>
      </div>
    </div>
  </article>
)

/* ─── Section ─── */
const ReviewsSection = () => {
  const scrollRef = useRef(null)

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <section className='border-t border-[#E5E5E5] py-8 sm:py-10'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-[18px] font-bold text-[#1C1917] sm:text-[22px]'>
          Avis de nos clientes
        </h2>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => scrollBy(-1)}
            aria-label='Précédent'
            className='flex h-8 w-8 cursor-pointer items-center justify-center border border-[#D6D3D1] text-[#57534E] transition-colors hover:border-[#1C1917] hover:text-[#1C1917]'
          >
            <Arrow dir='left' />
          </button>
          <button
            type='button'
            onClick={() => scrollBy(1)}
            aria-label='Suivant'
            className='flex h-8 w-8 cursor-pointer items-center justify-center border border-[#D6D3D1] text-[#57534E] transition-colors hover:border-[#1C1917] hover:text-[#1C1917]'
          >
            <Arrow dir='right' />
          </button>
        </div>
      </div>

      {/* Cards row */}
      <div
        ref={scrollRef}
        className='flex gap-3 overflow-x-auto pb-2 sm:gap-4'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </section>
  )
}

export default ReviewsSection
