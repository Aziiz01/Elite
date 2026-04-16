/* eslint-disable react/prop-types */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import RevealOnScroll from './RevealOnScroll'

const PromotionsSection = ({ products }) => {
  const deals = useMemo(() => {
    const base = Array.isArray(products) ? products : []
    return base
      .filter(
        (p) =>
          p.newPrice != null &&
          p.newPrice !== '' &&
          Number(p.newPrice) < Number(p.price) &&
          p.inStock
      )
      .slice(0, 12)
  }, [products])

  if (deals.length < 3) return null

  const marqueeItems = [...deals, ...deals]

  return (
    <section className='bg-[#1C1917]'>
      {/* Marquee ticker */}
      <div className='overflow-hidden border-t border-white/10 py-4 sm:py-5'>
        <div className='animate-marquee flex w-max gap-5 sm:gap-7'>
          {marqueeItems.map((item, i) => (
            <Link
              key={`${item._id}-${i}`}
              to={`/product/${item._id}`}
              className='group flex shrink-0 items-center gap-3 sm:gap-4'
            >
              <div className='h-12 w-12 shrink-0 overflow-hidden bg-white/10 sm:h-14 sm:w-14'>
                <img
                  src={item.image?.[0]}
                  alt={item.name}
                  className='h-full w-full object-contain transition-transform duration-500 group-hover:scale-110'
                  loading='lazy'
                />
              </div>
              <div className='flex flex-col'>
                <span className='max-w-[110px] text-[10px] leading-tight text-[#D6D3D1] line-clamp-1 sm:max-w-[140px] sm:text-[11px]'>
                  {item.name}
                </span>
                <div className='mt-0.5 flex items-baseline gap-1.5'>
                  <span className='text-[9px] text-[#57534E] line-through'>
                    {item.price} TND
                  </span>
                  <span className='text-[11px] font-medium text-[#A16207]'>
                    {item.newPrice} TND
                  </span>
                </div>
              </div>
              <span className='ml-2 h-1 w-1 shrink-0 rounded-full bg-white/15' />
            </Link>
          ))}
        </div>
      </div>

      {/* Big editorial promo block */}
      <div className='border-t border-white/10'>
        <RevealOnScroll>
          <div className='mx-auto max-w-[1280px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <div className='py-20 text-center sm:py-24 md:py-28'>
              <span className='luxury-eyebrow opacity-80'>Offre en cours</span>

              <h2
                className='mx-auto mt-5 max-w-4xl font-display font-semibold leading-[0.88] text-[#FAFAF9]'
                style={{ fontSize: 'clamp(2.4rem, 8vw, 7.5rem)' }}
              >
                Jusqu&apos;à{' '}
                <em className='font-normal italic text-[#A16207]'>-40%</em>
                <br />
                sur la sélection
              </h2>

              <p className='mx-auto mt-6 max-w-md text-[0.9rem] leading-[1.75] text-[#A8A29E] sm:mt-8 sm:text-[0.95rem]'>
                Des produits que nous aimons, à des prix qui n&apos;arrivent pas souvent.
                Quantités limitées, choix illimité.
              </p>

              <div className='mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10'>
                <Link to='/collection' className='luxury-btn-outline-dark'>
                  Voir les promotions
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default PromotionsSection
