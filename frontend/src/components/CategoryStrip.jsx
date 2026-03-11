import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../api/client'
import { pexelsImages } from '../constants/images'

const PLACEHOLDER_IMAGE = pexelsImages.cosmeticProducts

const CategoryStrip = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories)
        }
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className='py-8 sm:py-12 border-b border-gray-200'>
        <p className='text-center text-xs font-medium tracking-widest text-gray-500 mb-6'>DISCOVER</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className='aspect-square bg-gray-100 animate-pulse rounded' />
          ))}
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  return (
    <section className='py-8 sm:py-12 border-b border-gray-200'>
      <p className='text-center text-xs font-medium tracking-widest text-gray-500 mb-6'>DISCOVER</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/collection?category=${encodeURIComponent(cat.name)}`}
            className='group flex flex-col overflow-hidden'
          >
            <div className='aspect-square overflow-hidden bg-gray-100 mb-2'>
              <img
                src={cat.image || PLACEHOLDER_IMAGE}
                alt={cat.name}
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                loading='lazy'
                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
              />
            </div>
            <span className='text-center text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors'>
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryStrip
