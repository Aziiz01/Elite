import React, { useMemo, useRef } from 'react'
import ProductItem from './ProductItem'

const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const CategoryCarousel = ({ title, products = [], categoryName = '', keywords = [], maxItems = 10 }) => {
  const scrollerRef = useRef(null)

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return []
    const normalizedCategory = normalize(categoryName)
    if (normalizedCategory) {
      const byCategory = products.filter((product) => normalize(product.category).includes(normalizedCategory))
      if (byCategory.length > 0) return byCategory.slice(0, maxItems)
    }

    const normalizedKeywords = keywords.map(normalize).filter(Boolean)
    if (normalizedKeywords.length === 0) return products.slice(0, maxItems)

    const match = products.filter((product) => {
      const content = normalize(
        `${product.name || ''} ${product.category || ''} ${product.subCategory || ''} ${product.description || ''}`
      )
      return normalizedKeywords.some((keyword) => content.includes(keyword))
    })

    return (match.length > 0 ? match : products).slice(0, maxItems)
  }, [categoryName, keywords, maxItems, products])

  const scrollByAmount = (direction) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.85))
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  if (filteredProducts.length === 0) return null

  return (
    <section className='py-3 sm:py-4'>
      <div className='grid grid-cols-[1fr_auto_1fr] items-center mb-3 sm:mb-4'>
        <div />
        <h2 className='justify-self-center text-xl sm:text-2xl font-display font-semibold text-black tracking-tight'>
          {title}
        </h2>
        <div className='justify-self-end flex items-center gap-2'>
          <button
            type='button'
            onClick={() => scrollByAmount(-1)}
            aria-label={`Scroll ${title} left`}
            className='w-8 h-8 inline-flex items-center justify-center text-gray-500 hover:text-black transition-colors'
          >
            ←
          </button>
          <button
            type='button'
            onClick={() => scrollByAmount(1)}
            aria-label={`Scroll ${title} right`}
            className='w-8 h-8 inline-flex items-center justify-center text-gray-500 hover:text-black transition-colors'
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className='flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-2'
      >
        {filteredProducts.map((product) => (
          <div key={product._id} className='w-[180px] sm:w-[220px] md:w-[260px] flex-shrink-0 snap-start'>
            <ProductItem
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              newPrice={product.newPrice}
              colors={product.colors}
              inStock={product.inStock}
              date={product.date}
              isNew={product.isNew}
              subCategory={product.subCategory}
              category={product.category}
              rating={product.avgRating}
              reviewCount={product.reviewCount}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategoryCarousel
