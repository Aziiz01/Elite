import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import AddToCartModal from './AddToCartModal'
import StarRating from './review/StarRating'

const HeartOutline = () => (
  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
  </svg>
)

const HeartFilled = () => (
  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
  </svg>
)

const CartPlusIcon = () => (
  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z' />
  </svg>
)

const ProductItem = ({ id, image, name, price, newPrice, colors, inStock = true, isNew, date, subCategory, category, rating, reviewCount }) => {
  const { currency, favoriteIds, toggleFavorite, addToCart } = useContext(ShopContext)
  const [showAddToCartModal, setShowAddToCartModal] = useState(false)
  const isFavorited = favoriteIds.includes(String(id))

  const showNew = isNew ?? (date && (Date.now() - Number(date)) < 24 * 60 * 60 * 1000)
  const showDeal = newPrice != null && newPrice !== '' && Number(newPrice) < Number(price)

  const displayPrice = showDeal ? Number(newPrice) : Number(price)
  const originalPrice = Number(price)

  const handleHeartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
  }

  const handleCartClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inStock) return
    const firstColor = Array.isArray(colors) && colors.length > 0 ? colors[0] : '#9ca3af'
    addToCart(id, firstColor, 1)
    setShowAddToCartModal(true)
  }

  return (
    <Link
      to={`/product/${id}`}
      onClick={() => scrollTo(0, 0)}
      className='group/card flex flex-col h-full cursor-pointer'
    >
      {/* Image container */}
      <div className='relative w-full aspect-[3/4] overflow-hidden bg-[#f5f5f5] flex-shrink-0'>
        {/* Badges */}
        <div className='absolute left-2.5 top-2.5 z-10 flex flex-col gap-1'>
          {showNew && <span className='badge-new'>Nouveau</span>}
          {showDeal && <span className='badge-promo'>Promo</span>}
        </div>

        <img
          src={image?.[0]}
          alt={name}
          className={`w-full h-full object-contain transition-transform duration-500 ease-out group-hover/card:scale-105 ${
            !inStock ? 'opacity-50' : ''
          }`}
          loading='lazy'
        />

        {/* Out of stock overlay */}
        {!inStock && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/60'>
            <span className='text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888]'>Rupture de stock</span>
          </div>
        )}

        {/* Hover actions */}
        <div className='absolute bottom-0 inset-x-0 flex items-center justify-between px-3 py-2.5 translate-y-full group-hover/card:translate-y-0 transition-transform duration-200 bg-white/95 backdrop-blur-sm'>
          {inStock ? (
            <button
              type='button'
              onClick={handleCartClick}
              aria-label='Ajouter au panier'
              className='flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#111] hover:text-[#e02020] transition-colors cursor-pointer'
            >
              <CartPlusIcon />
              Ajouter
            </button>
          ) : (
            <span className='text-[11px] text-[#bbb] uppercase tracking-[0.1em]'>Indisponible</span>
          )}
          <button
            type='button'
            onClick={handleHeartClick}
            aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`transition-colors cursor-pointer ${
              isFavorited ? 'text-[#e02020]' : 'text-[#bbb] hover:text-[#e02020]'
            }`}
          >
            {isFavorited ? <HeartFilled /> : <HeartOutline />}
          </button>
        </div>

        {/* Persistent favorite for mobile (no hover) */}
        <button
          type='button'
          onClick={handleHeartClick}
          aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`absolute top-2.5 right-2.5 z-10 sm:hidden transition-colors cursor-pointer ${
            isFavorited ? 'text-[#e02020]' : 'text-[#bbb]'
          }`}
        >
          {isFavorited ? <HeartFilled /> : <HeartOutline />}
        </button>
      </div>

      {/* Info */}
      <div className='pt-3 pb-1 flex-1 flex flex-col'>
        {(category || subCategory) && (
          <p className='text-[10px] uppercase tracking-[0.15em] text-[#aaa] mb-1'>
            {subCategory || category}
          </p>
        )}
        <p className='text-[13px] font-medium text-[#111] leading-snug line-clamp-2 flex-1'>{name}</p>

        {(rating ?? 0) > 0 && (
          <div className='mt-1.5 flex items-center gap-1'>
            <StarRating rating={rating ?? 0} size='sm' />
            <span className='text-[10px] text-[#aaa]'>({reviewCount ?? 0})</span>
          </div>
        )}

        <div className='mt-2 flex items-baseline gap-2'>
          {showDeal ? (
            <>
              <span className='text-[13px] font-semibold text-[#e02020]'>{displayPrice}{currency}</span>
              <span className='text-[12px] text-[#bbb] line-through'>{originalPrice}{currency}</span>
            </>
          ) : (
            <span className='text-[13px] font-semibold text-[#111]'>{displayPrice}{currency}</span>
          )}
        </div>
      </div>

      <AddToCartModal
        isOpen={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
        product={{ image, name, price, newPrice }}
        quantity={1}
      />
    </Link>
  )
}

export default ProductItem
