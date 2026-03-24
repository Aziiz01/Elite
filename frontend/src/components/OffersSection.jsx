import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { pexelsImages } from '../constants/images'

const fallbackImages = [
  pexelsImages.cosmeticProductsWide,
  pexelsImages.womanPinkEyeshadowWide,
  pexelsImages.womanLipstickWide,
]

const OffersSection = ({ products = [], categoryName = '' }) => {
  const cards = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return []

    const scoped = categoryName
      ? products.filter((p) => String(p.category || '').toLowerCase() === String(categoryName).toLowerCase())
      : products

    const discounted = scoped
      .filter((p) => Number(p.newPrice) > 0 && Number(p.newPrice) < Number(p.price))
      .sort((a, b) => {
        const da = ((Number(a.price) - Number(a.newPrice)) / Number(a.price || 1))
        const db = ((Number(b.price) - Number(b.newPrice)) / Number(b.price || 1))
        return db - da
      })

    const source = (discounted.length > 0 ? discounted : scoped).slice(0, 2)
    return source.map((product, index) => {
      const price = Number(product.price || 0)
      const newPrice = Number(product.newPrice || 0)
      const hasDiscount = newPrice > 0 && newPrice < price
      const discountPct = hasDiscount ? Math.round(((price - newPrice) / price) * 100) : 20

      return {
        id: product._id,
        image: product.image?.[0] || fallbackImages[index % fallbackImages.length],
        title: String(product.name || 'Offre').slice(0, 22).toUpperCase(),
        subtitle: `Jusqu'à -${discountPct}%`,
        description: `Offre spéciale sur ${product.category || 'notre collection'}`,
        cta: 'Acheter',
        to: `/product/${product._id}`,
      }
    })
  }, [categoryName, products])

  if (cards.length === 0) return null

  return (
    <section className='pt-2 pb-6 sm:pb-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5'>
        {cards.map((offer) => (
          <div key={offer.id}>
            <Link
              to={offer.to}
              className='group relative block overflow-hidden rounded-lg min-h-[220px] sm:min-h-[280px] md:min-h-[320px]'
            >
              <img
                src={offer.image}
                alt={offer.title}
                className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-black/30 group-hover:bg-black/35 transition-colors' />
              <div className='relative z-10 px-5 py-5 text-white'>
                <p className='text-lg sm:text-xl font-semibold tracking-wide'>{offer.title}</p>
                <p className='mt-1 text-sm sm:text-base'>{offer.subtitle}</p>
                <p className='text-xs sm:text-sm text-white/95'>{offer.description}</p>
                <span className='inline-block mt-3 text-xs sm:text-sm font-medium bg-black/75 px-3 py-1.5'>
                  {offer.cta}
                </span>
              </div>
            </Link>
            <p className='mt-2 text-[11px] sm:text-xs text-blue-700 font-medium'>
              Temps restant avant la fin de la promotion : 7 jours 25:47
            </p>
            <p className='text-[10px] sm:text-[11px] text-gray-500'>{cards.length} produit(s)</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OffersSection
