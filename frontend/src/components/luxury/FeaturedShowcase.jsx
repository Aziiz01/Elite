/* eslint-disable react/prop-types */
import { useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import RevealOnScroll from './RevealOnScroll'
import StarRating from '../review/StarRating'
import AddToCartModal from '../AddToCartModal'

/* ─── Icons ─── */
const CartIcon = () => (
  <svg className='h-[14px] w-[14px]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z' />
  </svg>
)

const HeartOutline = () => (
  <svg className='h-[14px] w-[14px]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
  </svg>
)

const HeartFilled = () => (
  <svg className='h-[14px] w-[14px]' fill='currentColor' viewBox='0 0 24 24'>
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
      Array.isArray(product.colors) && product.colors.length ? product.colors[0] : '#9ca3af'
    addToCart(product._id, firstColor, 1)
    setShowModal(true)
  }

  return (
    <Link
      to={`/product/${product._id}`}
      onClick={() => scrollTo(0, 0)}
      className='group relative flex flex-col'
    >
      {/* Image */}
      <div className='relative aspect-[3/4] overflow-hidden bg-[#F0EDE8]'>
        {/* Badges */}
        <div className='absolute left-3 top-3 z-10 flex flex-wrap gap-1.5'>
          {product.isNew && (
            <span className='bg-[#1C1917] px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-[#FAFAF9]'>
              Nouveau
            </span>
          )}
          {showDeal && (
            <span className='bg-[#A16207] px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white'>
              Promo
            </span>
          )}
        </div>

        {!product.inStock && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-[#FAFAF9]/75'>
            <span className='text-[9px] uppercase tracking-[0.25em] text-[#A8A29E]'>
              Rupture de stock
            </span>
          </div>
        )}

        <img
          className={`h-full w-full object-contain transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] ${
            !product.inStock ? 'opacity-40' : ''
          }`}
          src={product.image?.[0]}
          alt={product.name}
          loading='lazy'
        />

        {/* Action buttons — reveal on hover */}
        <div
          className={`absolute bottom-3 left-3 right-3 z-20 flex items-center transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${
            product.inStock ? 'justify-between' : 'justify-end'
          }`}
        >
          {product.inStock && (
            <button
              type='button'
              onClick={handleCart}
              aria-label='Ajouter au panier'
              className='flex h-9 w-9 cursor-pointer items-center justify-center bg-white text-[#1C1917] shadow-sm transition-colors hover:bg-[#1C1917] hover:text-white'
            >
              <CartIcon />
            </button>
          )}
          <button
            type='button'
            onClick={handleFav}
            aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center bg-white shadow-sm transition-colors ${
              isFav ? 'text-rose-500' : 'text-[#A8A29E] hover:text-rose-500'
            }`}
          >
            {isFav ? <HeartFilled /> : <HeartOutline />}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className='mt-3 flex flex-col gap-0.5'>
        <p className='text-[0.8rem] leading-snug text-[#1C1917] line-clamp-1 sm:text-[0.85rem]'>
          {product.name}
        </p>

        {product.subCategory && (
          <p className='text-[10px] text-[#A8A29E]'>{product.subCategory}</p>
        )}

        {product.avgRating > 0 && (
          <div className='mt-0.5 flex items-center gap-1.5'>
            <StarRating rating={product.avgRating ?? 0} size='sm' />
            <span className='text-[10px] text-[#A8A29E]'>({product.reviewCount ?? 0})</span>
          </div>
        )}

        <div className='mt-1.5 flex items-baseline gap-2'>
          {showDeal && (
            <span className='text-[11px] text-[#D6D3D1] line-through'>
              {product.price}{currency}
            </span>
          )}
          <span className={`text-sm font-medium ${showDeal ? 'text-[#A16207]' : 'text-[#1C1917]'}`}>
            {displayPrice}{currency}
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

/* ─── Main section ─── */
const FeaturedShowcase = ({ products }) => {
  const featured = useMemo(() => {
    const base = Array.isArray(products) ? products : []
    const best = base.filter((item) => item?.bestseller)
    const source = best.length >= 8 ? best : base
    return source.slice(0, 12)
  }, [products])

  if (!featured.length) return null

  return (
    <section className='border-t border-[#D6D3D1] bg-white py-20 sm:py-24 md:py-28'>
      <div className='mx-auto max-w-[1280px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <RevealOnScroll>
          <div className='mb-10 flex flex-col gap-4 sm:mb-14 md:flex-row md:items-end md:justify-between'>
            <div className='max-w-lg'>
              <span className='luxury-eyebrow'>Sélection</span>
              <h2
                className='mt-4 font-display leading-[0.92] text-[#1C1917]'
                style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.8rem)' }}
              >
                Pièces choisies
                <br />
                <em className='font-normal italic text-[#A8A29E]'>avec intention.</em>
              </h2>
            </div>
            <Link to='/collection' className='luxury-link group shrink-0'>
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

        <div className='grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 sm:grid-cols-3 lg:grid-cols-4'>
          {featured.map((product, i) => (
            <RevealOnScroll key={product._id} delay={i * 50}>
              <ProductCard product={product} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedShowcase
