import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import AddToCartModal from './AddToCartModal'

const HeartOutline = () => (
  <svg className='w-4 h-4 sm:w-[18px] sm:h-[18px]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
  </svg>
)

const HeartFilled = () => (
  <svg className='w-4 h-4 sm:w-[18px] sm:h-[18px]' fill='currentColor' viewBox='0 0 24 24'>
    <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
  </svg>
)

const CartIcon = () => (
  <svg className='w-4 h-4 sm:w-[18px] sm:h-[18px]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' />
  </svg>
)

const ProductItem = ({ id, image, name, price, newPrice, colors, inStock = true }) => {
  const { currency, favoriteIds, toggleFavorite, addToCart } = useContext(ShopContext)
  const [showAddToCartModal, setShowAddToCartModal] = useState(false)
  const isFavorited = favoriteIds.includes(String(id))

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
      onClick={() => scrollTo(0, 0)}
      className='text-gray-700 cursor-pointer flex flex-col h-full group/card'
      to={`/product/${id}`}
    >
      <div className='relative w-full aspect-square overflow-hidden bg-gray-50 flex-shrink-0'>
        <img
          className={`w-full h-full object-contain group-hover/card:scale-110 transition ease-in-out duration-300 ${!inStock ? 'opacity-60' : ''}`}
          src={image?.[0]}
          alt={name}
        />
        {!inStock && (
          <span className='absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm font-medium'>
            Out of stock
          </span>
        )}
        {inStock && (
          <button
            type='button'
            onClick={handleCartClick}
            aria-label='Add to cart'
            className='absolute left-2 top-2 sm:left-3 sm:top-3 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/90 shadow-sm opacity-100 sm:opacity-0 sm:group-hover/card:opacity-100 transition-opacity duration-200 hover:bg-white text-gray-600 hover:text-gray-900'
          >
            <CartIcon />
          </button>
        )}
        <button
          type='button'
          onClick={handleHeartClick}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute right-2 top-2 sm:right-3 sm:top-3 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/90 shadow-sm opacity-100 sm:opacity-0 sm:group-hover/card:opacity-100 transition-opacity duration-200 hover:bg-white ${isFavorited ? 'text-pink-500' : 'text-gray-700 hover:text-pink-500'}`}
        >
          {isFavorited ? <HeartFilled /> : <HeartOutline />}
        </button>
      </div>
      <div className='pt-3 pb-1 flex-1 min-h-0'>
        <p className='text-sm line-clamp-2'>{name}</p>
      </div>
      <div className='text-sm font-medium mt-auto flex items-center gap-2 flex-wrap'>
        {newPrice != null && newPrice !== '' ? (
          <span>
            <span className='line-through text-gray-500'>{currency}{price}</span>
            <span className='ml-1 text-green-600'>{currency}{newPrice}</span>
          </span>
        ) : (
          <span>{currency}{price}</span>
        )}
        {!inStock && (
          <span className='text-red-600 text-xs font-medium'>Out of stock</span>
        )}
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
