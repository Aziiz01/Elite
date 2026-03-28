import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import RevealOnScroll from './RevealOnScroll'
import ProductItem from '../ProductItem'

const FeaturedShowcase = ({ products }) => {
  const { featuredProducts, categoryRows } = useMemo(() => {
    const base = Array.isArray(products) ? products : []
    const best = base.filter((item) => item?.bestseller)
    const latest = base.slice(0, 10)
    const featured = (best.length >= 6 ? best : latest).slice(0, 10)

    const categoryMap = new Map()
    for (const product of base) {
      const key = String(product?.category || '').trim()
      if (!key) continue
      if (!categoryMap.has(key)) categoryMap.set(key, [])
      categoryMap.get(key).push(product)
    }

    const rows = [...categoryMap.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([category, items]) => ({
        category,
        items: items.slice(0, 4),
      }))

    return { featuredProducts: featured, categoryRows: rows }
  }, [products])

  return (
    <section className='pt-20 sm:pt-24 md:pt-28'>
      <RevealOnScroll>
        <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <p className='luxury-eyebrow'>Collection phare</p>
            <h2 className='luxury-heading mt-3'>Des pieces pensees pour etre admirees de pres.</h2>
          </div>
          <Link to='/collection' className='luxury-link'>
            Voir toute la collection
          </Link>
        </div>
      </RevealOnScroll>

      <RevealOnScroll>
        <div className='mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
          {featuredProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              newPrice={item.newPrice}
              colors={item.colors}
              inStock={item.inStock}
              date={item.date}
              isNew={item.isNew}
              subCategory={item.subCategory}
              category={item.category}
              rating={item.avgRating}
              reviewCount={item.reviewCount}
            />
          ))}
        </div>
      </RevealOnScroll>

      {categoryRows.map((row, rowIndex) => (
        <div key={row.category} className='mt-14'>
          <RevealOnScroll delay={rowIndex * 70}>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='font-display text-2xl sm:text-3xl text-[#2f2721]'>{row.category}</h3>
              <Link to={`/collection?category=${encodeURIComponent(row.category)}`} className='luxury-link'>
                Voir tout
              </Link>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={rowIndex * 90}>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6'>
              {row.items.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  newPrice={item.newPrice}
                  colors={item.colors}
                  inStock={item.inStock}
                  date={item.date}
                  isNew={item.isNew}
                  subCategory={item.subCategory}
                  category={item.category}
                  rating={item.avgRating}
                  reviewCount={item.reviewCount}
                />
              ))}
            </div>
          </RevealOnScroll>
        </div>
      ))}
    </section>
  )
}

export default FeaturedShowcase
