/* eslint-disable react/prop-types */
import { useRef, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import StarRating from '../review/StarRating'
import AddToCartModal from '../AddToCartModal'
import { useState } from 'react'

/* ─── Icons ─── */
const ArrowLeft = () => (
  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
  </svg>
)
const ArrowRight = () => (
  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
  </svg>
)
const HeartOutline = () => (
  <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
  </svg>
)
const HeartFilled = () => (
  <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
  </svg>
)

/* ─── Product card ─── */
const ProductCard = ({ product }) => {
  const { currency, favoriteIds, toggleFavorite, addToCart } = useContext(ShopContext)
  const [showModal, setShowModal] = useState(false)
  const isFav = favoriteIds.includes(String(product._id))
  const showDeal =
    product.newPrice != null &&
    product.newPrice !== '' &&
    Number(product.newPrice) < Number(product.price)
  const displayPrice = showDeal ? product.newPrice : product.price

  const handleFav = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product._id)
  }

  const handleCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return
    const firstColor =
      Array.isArray(product.colors) && product.colors.length
        ? product.colors[0]
        : '#9ca3af'
    addToCart(product._id, firstColor, 1)
    setShowModal(true)
  }

  return (
    <Link
      to={`/product/${product._id}`}
      onClick={() => scrollTo(0, 0)}
      className='group flex w-[180px] flex-shrink-0 flex-col sm:w-[200px] md:w-[220px]'
    >
      {/* Image container — makeup.fr square bg */}
      <div className='relative aspect-square overflow-hidden bg-[#F5F5F5]'>
        {/* Badges */}
        <div className='absolute left-2 top-2 z-10 flex flex-col gap-1'>
          {product.bestseller && !showDeal && (
            <span className='bg-[#1C1917] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white'>
              HIT
            </span>
          )}
          {showDeal && (
            <span className='bg-[#e02020] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white'>
              DEAL
            </span>
          )}
          {product.isNew && !product.bestseller && !showDeal && (
            <span className='bg-[#A16207] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white'>
              NEW
            </span>
          )}
        </div>

        {/* Wishlist heart — always visible, fills on fav */}
        <button
          type='button'
          onClick={handleFav}
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`absolute right-2 top-2 z-10 cursor-pointer p-1 transition-colors ${
            isFav ? 'text-rose-500' : 'text-[#D6D3D1] hover:text-rose-400'
          }`}
        >
          {isFav ? <HeartFilled /> : <HeartOutline />}
        </button>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/70'>
            <span className='text-[9px] uppercase tracking-[0.2em] text-[#A8A29E]'>
              Rupture
            </span>
          </div>
        )}

        {/* Product image — full bleed */}
        <img
          src={product.image?.[0]}
          alt={product.name}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06] ${
            !product.inStock ? 'opacity-40' : ''
          }`}
          loading='lazy'
        />

        {/* Add to cart bar — reveals on hover */}
        {product.inStock && (
          <button
            type='button'
            onClick={handleCart}
            className='absolute inset-x-0 bottom-0 z-10 flex h-9 cursor-pointer items-center justify-center bg-[#1C1917] text-[10px] font-medium uppercase tracking-[0.12em] text-white opacity-0 transition-all duration-250 group-hover:opacity-100'
          >
            Ajouter au panier
          </button>
        )}
      </div>

      {/* Info */}
      <div className='mt-3 space-y-1'>
        <p className='text-[10px] uppercase tracking-[0.12em] text-[#A8A29E]'>
          {product.subCategory || product.category || ''}
        </p>
        <p className='line-clamp-2 text-[12px] font-medium leading-snug text-[#1C1917] sm:text-[13px]'>
          {product.name}
        </p>
        {product.avgRating > 0 && (
          <div className='flex items-center gap-1.5'>
            <StarRating rating={product.avgRating ?? 0} size='sm' />
            <span className='text-[10px] text-[#A8A29E]'>({product.reviewCount ?? 0})</span>
          </div>
        )}
        <div className='flex items-baseline gap-2 pt-0.5'>
          {showDeal && (
            <span className='text-[11px] text-[#D6D3D1] line-through'>
              {product.price}
              {currency}
            </span>
          )}
          <span
            className={`text-[13px] font-semibold ${
              showDeal ? 'text-[#e02020]' : 'text-[#1C1917]'
            }`}
          >
            {displayPrice}
            {currency}
          </span>
        </div>
      </div>

      <AddToCartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={{
          image: product.image,
          name: product.name,
          price: product.price,
          newPrice: product.newPrice,
        }}
        quantity={1}
      />
    </Link>
  )
}

/* ─── Carousel wrapper ─── */
const ProductCarousel = ({ title, subtitle, products, maxItems = 10, categoryFilter, filterFn }) => {
  const scrollRef = useRef(null)

  const items = useMemo(() => {
    let base = Array.isArray(products) ? products : []
    if (filterFn) base = base.filter(filterFn)
    else if (categoryFilter) {
      base = base.filter(
        (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase()
      )
    }
    return base.slice(0, maxItems)
  }, [products, categoryFilter, filterFn, maxItems])

  if (!items.length) return null

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 250, behavior: 'smooth' })
  }

  return (
    <section className='border-t border-[#E5E5E5] py-8 sm:py-10'>
      {/* Header */}
      <div className='mb-5 flex items-end justify-between'>
        <div>
          {subtitle && (
            <p className='mb-1 text-[10px] uppercase tracking-[0.2em] text-[#A8A29E]'>{subtitle}</p>
          )}
          <h2 className='text-[18px] font-bold text-[#1C1917] sm:text-[22px]'>{title}</h2>
        </div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => scrollBy(-1)}
            aria-label='Précédent'
            className='flex h-8 w-8 cursor-pointer items-center justify-center border border-[#D6D3D1] text-[#57534E] transition-colors hover:border-[#1C1917] hover:text-[#1C1917]'
          >
            <ArrowLeft />
          </button>
          <button
            type='button'
            onClick={() => scrollBy(1)}
            aria-label='Suivant'
            className='flex h-8 w-8 cursor-pointer items-center justify-center border border-[#D6D3D1] text-[#57534E] transition-colors hover:border-[#1C1917] hover:text-[#1C1917]'
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className='flex gap-3 overflow-x-auto pb-2 sm:gap-4'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default ProductCarousel
