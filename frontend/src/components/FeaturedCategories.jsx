import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../api/client'
import { pexelsImages } from '../constants/images'

const PLACEHOLDER_IMAGE = pexelsImages.cosmeticProducts

const FeaturedCategories = ({ categoryNames = ['Women', 'Men', 'Kids'] }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.categories)) {
          const names = categoryNames.slice(0, 3)
          const matched = names
            .map((name) => res.data.categories.find((c) => c.name === name))
            .filter(Boolean)
          setCategories(matched)
        }
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [categoryNames])

  if (loading) {
    return (
      <section className='py-14 sm:py-20 border-b border-gray-200'>
        <div className='space-y-16 sm:space-y-24'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='grid grid-cols-1 md:grid-cols-2 gap-0'>
              <div className='min-h-[200px] sm:min-h-[280px] bg-gray-100 animate-pulse' />
              <div className='min-h-[200px] sm:min-h-[280px] bg-gray-50' />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  return (
    <section className='py-14 sm:py-20 border-b border-gray-200'>
      <div className='space-y-16 sm:space-y-24'>
        {categories.map((cat, index) => {
          const imageLeft = index % 2 === 0
          return (
            <div key={cat._id} className='grid grid-cols-1 md:grid-cols-2 gap-0'>
              <div
                className={`relative min-h-[280px] sm:min-h-[360px] ${imageLeft ? 'order-2 md:order-1' : 'order-2 md:order-2'}`}
              >
                <Link to={`/collection?category=${encodeURIComponent(cat.name)}`} className='block h-full'>
                  <img
                    src={cat.image || PLACEHOLDER_IMAGE}
                    alt={cat.name}
                    className='absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                    loading='lazy'
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
                  />
                </Link>
              </div>
              <div
                className={`flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 bg-gray-50 ${imageLeft ? 'order-1 md:order-2' : 'order-1 md:order-1'}`}
              >
                <p className='text-xs font-medium tracking-widest text-gray-500 mb-3'>DISCOVER</p>
                <h2 className='text-2xl sm:text-3xl font-medium text-gray-900 leading-tight'>
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className='text-gray-600 mt-4 text-sm sm:text-base'>
                    {cat.description}
                  </p>
                )}
                <Link
                  to={`/collection?category=${encodeURIComponent(cat.name)}`}
                  className='inline-flex items-center gap-2 mt-6 text-sm font-medium text-gray-900 border-b border-gray-900 pb-1 w-fit hover:opacity-70 transition-opacity'
                >
                  Shop {cat.name}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FeaturedCategories
