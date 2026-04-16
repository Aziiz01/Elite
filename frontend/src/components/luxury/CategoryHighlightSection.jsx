/* eslint-disable react/prop-types */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import RevealOnScroll from './RevealOnScroll'

const categoryMeta = {
  lèvres: { tagline: 'Pigments veloutés, confort satiné.' },
  levres: { tagline: 'Pigments veloutés, confort satiné.' },
  teint: { tagline: 'Éclat naturel, couvrance impeccable.' },
  yeux: { tagline: 'Profondeur, définition, intensité douce.' },
}

const normalize = (v) => String(v || '').trim().toLowerCase()

const CategoryHighlightSection = ({ products }) => {
  const categories = useMemo(() => {
    const map = new Map()
    for (const item of products || []) {
      const key = normalize(item?.category)
      if (!key) continue
      if (!map.has(key)) {
        map.set(key, {
          label: String(item.category),
          image: item?.image?.[0],
          count: 0,
        })
      }
      map.get(key).count += 1
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 3)
  }, [products])

  if (!categories.length) return null

  return (
    <section className='bg-[#FAFAF9] py-20 sm:py-24 md:py-28'>
      <div className='mx-auto max-w-[1280px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <RevealOnScroll>
          <div className='mb-10 flex items-end justify-between sm:mb-14'>
            <div className='max-w-lg'>
              <span className='luxury-eyebrow'>Par catégorie</span>
              <h2
                className='mt-4 font-display leading-[0.92] text-[#1C1917]'
                style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.8rem)' }}
              >
                Trouvez votre
                <br />
                <em className='font-normal italic text-[#A8A29E]'>expression.</em>
              </h2>
            </div>
            <Link to='/collection' className='luxury-link group shrink-0 self-end'>
              <span>Tout voir</span>
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
        </RevealOnScroll>

        {/* Grid: 1 col mobile, 2 col sm, 3 col lg */}
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr]'>
          {categories.map((cat, i) => (
            <RevealOnScroll key={cat.label} delay={i * 100}>
              <Link
                to={`/collection?category=${encodeURIComponent(cat.label)}`}
                className={`group relative block overflow-hidden bg-[#D6D3D1] transition-shadow duration-500 hover:shadow-[0_12px_40px_rgba(28,25,23,0.12)] ${
                  i === 0
                    ? 'aspect-[4/5] sm:col-span-2 sm:aspect-[16/9] lg:col-span-1 lg:row-span-2 lg:aspect-auto lg:h-full'
                    : 'aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:h-full'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className='absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]'
                  loading='lazy'
                />

                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/20 to-transparent' />

                {/* Content */}
                <div className='absolute inset-x-0 bottom-0 p-5 sm:p-7'>
                  <p className='text-[9px] uppercase tracking-[0.3em] text-[#A16207]'>
                    {categoryMeta[normalize(cat.label)]?.tagline || `${cat.count} produits`}
                  </p>
                  <h3
                    className='mt-2 font-display text-[#FAFAF9]'
                    style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2.4rem)' }}
                  >
                    {cat.label}
                  </h3>
                  <div className='mt-3 h-px w-0 bg-[#A16207] transition-all duration-500 ease-out group-hover:w-10' />
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryHighlightSection
