import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import RevealOnScroll from './RevealOnScroll'

const categoryMessages = {
  levres: 'Pigments veloutes, confort satine.',
  teint: 'Eclat naturel et couvrance impeccable.',
  yeux: 'Profondeur, definition et intensite douce.',
}

const normalize = (value) => String(value || '').trim().toLowerCase()

const CategoryHighlightSection = ({ products }) => {
  const categoryCards = useMemo(() => {
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
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 4)
  }, [products])

  return (
    <section className='pt-20 sm:pt-24 md:pt-28'>
      <RevealOnScroll>
        <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='luxury-eyebrow'>Campagnes par categorie</p>
            <h2 className='luxury-heading mt-3'>Une collection pour chaque expression.</h2>
          </div>
          <Link to='/collection' className='luxury-link'>
            Acheter par categorie
          </Link>
        </div>
      </RevealOnScroll>

      <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {categoryCards.map((category, index) => (
          <RevealOnScroll key={category.label} delay={index * 80}>
            <Link
              to={`/collection?category=${encodeURIComponent(category.label)}`}
              className='group relative block overflow-hidden rounded-[1.7rem] border border-[#eadfd6] bg-[#f8f1eb]'
            >
              <div className='aspect-[3/4] overflow-hidden'>
                <img
                  src={category.image}
                  alt={category.label}
                  className='h-full w-full object-cover transition duration-700 group-hover:scale-105'
                  loading='lazy'
                />
              </div>
              <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f1a16]/75 to-transparent p-5 text-[#f8efe8]'>
                <h3 className='font-display text-2xl'>{category.label}</h3>
                <p className='mt-1 text-xs uppercase tracking-[0.16em] text-[#f2ddd0]/85'>
                  {categoryMessages[normalize(category.label)] || 'Essentiels saisonniers soigneusement choisis.'}
                </p>
              </div>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}

export default CategoryHighlightSection
