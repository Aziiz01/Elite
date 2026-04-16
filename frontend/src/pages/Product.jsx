/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import { getProductReviews } from '../api/client'
import AddToCartModal from '../components/AddToCartModal'
import ProductCharacteristics from '../components/product/ProductCharacteristics'
import ProductReviews from '../components/product/ProductReviews'

/* ── Inline star display (read-only, used in product info header) ── */
const Stars = ({ n }) => (
  <span className='flex gap-0.5'>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={`text-[12px] leading-none ${i <= Math.round(n) ? 'text-[#A16207]' : 'text-[#D6D3D1]'}`} aria-hidden='true'>
        ★
      </span>
    ))}
  </span>
)

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart, token, favoriteIds, toggleFavorite } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showAddToCartModal, setShowAddToCartModal] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    const found = products.find((item) => item._id === productId)
    if (found) {
      setProductData(found)
      setImage(found.image[0])
    }
  }, [productId, products])

  const fetchReviews = useCallback(async () => {
    if (!productId) return
    setReviewsLoading(true)
    try {
      const res = await getProductReviews(productId)
      if (res.data.success) setReviews(res.data.reviews || [])
    } catch (err) {
      console.error(err)
    } finally {
      setReviewsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    if (productId) fetchReviews()
  }, [productId, fetchReviews])

  const avgRating =
    reviews.length
      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null

  /* ── Not found ── */
  if (products.length > 0 && !productData) {
    return (
      <div className='flex min-h-[50vh] flex-col items-center justify-center border-t border-[#E5E5E5] py-16 px-6 text-center'>
        <Helmet><title>Produit introuvable | Elite</title></Helmet>
        <p className='font-medium text-[#1C1917]'>Produit introuvable</p>
        <p className='mt-1 mb-8 text-[13px] text-[#A8A29E]'>
          Ce produit n'existe pas ou a été retiré du catalogue.
        </p>
        <Link to='/collection' className='btn-primary'>Découvrir la collection</Link>
      </div>
    )
  }

  /* ── Loading ── */
  if (!productData) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center border-t border-[#E5E5E5] pt-14'>
        <Helmet><title>Chargement | Elite</title></Helmet>
        <span className='text-[11px] uppercase tracking-[0.25em] text-[#A8A29E]'>Chargement...</span>
      </div>
    )
  }

  const isFav = favoriteIds.includes(String(productData._id))
  const hasDiscount = productData.newPrice != null && productData.newPrice !== ''

  return (
    <div className='border-t border-[#E5E5E5] pt-10'>
      <Helmet>
        <title>{productData.name} | Elite</title>
        <meta
          name='description'
          content={productData.description?.slice(0, 160) || `Achetez ${productData.name} chez Elite.`}
        />
      </Helmet>

      {/* ── Main product area ── */}
      <div className='flex flex-col gap-10 sm:flex-row sm:gap-12 lg:gap-16'>

        {/* Images */}
        <div className='flex flex-1 flex-col-reverse gap-3 sm:flex-row'>
          {/* Thumbnails */}
          <div className='flex w-full gap-2 overflow-x-auto sm:w-[80px] sm:flex-col sm:overflow-y-auto'>
            {productData.image.map((src, i) => (
              <button
                key={i}
                type='button'
                onClick={() => setImage(src)}
                className={`aspect-square w-[22%] flex-shrink-0 overflow-hidden bg-[#F0EDE8] sm:w-full border-2 transition-colors cursor-pointer ${
                  image === src ? 'border-[#1C1917]' : 'border-transparent hover:border-[#D6D3D1]'
                }`}
              >
                <img src={src} alt='' className='h-full w-full object-contain' loading='lazy' />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className='aspect-square flex-1 overflow-hidden bg-[#F0EDE8]'>
            <img
              src={image}
              alt={productData.name}
              className='h-full w-full object-contain'
              loading='eager'
            />
          </div>
        </div>

        {/* Product info */}
        <div className='flex-1'>
          {/* Breadcrumb */}
          {(productData.category || productData.subCategory) && (
            <p className='section-eyebrow mb-3'>{productData.subCategory || productData.category}</p>
          )}

          {/* Title + favourite */}
          <div className='flex items-start gap-3'>
            <h1 className='flex-1 font-display text-2xl font-semibold leading-tight text-[#1C1917] sm:text-3xl'>
              {productData.name}
            </h1>
            <button
              type='button'
              onClick={() => toggleFavorite(productData._id)}
              aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center border transition-colors ${
                isFav
                  ? 'border-[#e02020] text-[#e02020]'
                  : 'border-[#E5E5E5] text-[#D6D3D1] hover:border-[#e02020] hover:text-[#e02020]'
              }`}
            >
              {isFav ? (
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
                </svg>
              ) : (
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
                </svg>
              )}
            </button>
          </div>

          {/* Stars */}
          {reviews.length > 0 && (
            <div className='mt-3 flex items-center gap-2'>
              <Stars n={Number(avgRating)} />
              <span className='text-[12px] text-[#A8A29E]'>{avgRating} ({reviews.length} avis)</span>
            </div>
          )}

          {/* Price */}
          <div className='mt-5 flex items-baseline gap-3'>
            {hasDiscount ? (
              <>
                <span className='text-2xl font-bold text-[#e02020]'>{productData.newPrice}{currency}</span>
                <span className='text-base text-[#D6D3D1] line-through'>{productData.price}{currency}</span>
                <span className='bg-[#e02020] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'>
                  PROMO
                </span>
              </>
            ) : (
              <span className='text-2xl font-bold text-[#1C1917]'>{productData.price}{currency}</span>
            )}
            {productData.inStock === false && (
              <span className='text-[11px] font-semibold uppercase tracking-[0.1em] text-[#e02020]'>
                Rupture de stock
              </span>
            )}
          </div>

          {/* Divider */}
          <div className='mt-5 h-px w-10 bg-[#A16207]' />

          {/* Description */}
          <p className='mt-5 text-sm leading-[1.75] text-[#57534E]'>{productData.description}</p>

          {/* Color picker */}
          <div className='mt-7'>
            <p className='mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[#A8A29E]'>Couleur</p>
            <div className='flex flex-wrap items-center gap-2.5'>
              {(productData.colors || []).map((hex, i) => {
                const bg = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : '#9ca3af'
                return (
                  <button
                    type='button'
                    key={i}
                    onClick={() => setSelectedColor(hex)}
                    title={hex}
                    className={`h-8 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 transition-all hover:scale-105 ${
                      hex === selectedColor
                        ? 'border-[#1C1917] ring-2 ring-[#1C1917] ring-offset-1'
                        : 'border-white ring-1 ring-[#D6D3D1]'
                    }`}
                    style={{ backgroundColor: bg }}
                  />
                )
              })}
              {(productData.colors || []).length === 0 && (
                <p className='text-[12px] text-[#A8A29E]'>Aucune couleur disponible</p>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className='mt-6'>
            <p className='mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[#A8A29E]'>Quantité</p>
            <div className='flex items-center'>
              <button
                type='button'
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className='flex h-10 w-10 cursor-pointer items-center justify-center border border-[#E5E5E5] text-[#57534E] transition-colors hover:border-[#1C1917] hover:text-[#1C1917]'
              >
                −
              </button>
              <input
                type='number'
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className='h-10 w-14 border-y border-[#E5E5E5] text-center text-sm text-[#1C1917] focus:outline-none'
              />
              <button
                type='button'
                onClick={() => setQuantity((q) => q + 1)}
                className='flex h-10 w-10 cursor-pointer items-center justify-center border border-[#E5E5E5] text-[#57534E] transition-colors hover:border-[#1C1917] hover:text-[#1C1917]'
              >
                +
              </button>
            </div>
          </div>

          {/* CTA */}
          <button
            type='button'
            onClick={async () => {
              if (productData.inStock === false) return
              await addToCart(productData._id, selectedColor, quantity)
              setShowAddToCartModal(true)
            }}
            disabled={!selectedColor || productData.inStock === false}
            className='btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
          >
            {productData.inStock === false ? 'Rupture de stock' : 'Ajouter au panier'}
          </button>

          <AddToCartModal
            isOpen={showAddToCartModal}
            onClose={() => setShowAddToCartModal(false)}
            product={productData}
            quantity={quantity}
          />

          {/* Trust signals */}
          <div className='mt-8 border-t border-[#E5E5E5] pt-5 flex flex-col gap-2'>
            {[
              'Produit 100 % authentique.',
              'Paiement à la livraison disponible.',
              'Retours et échanges faciles sous 7 jours.',
            ].map((t) => (
              <p key={t} className='flex items-center gap-2 text-[12px] text-[#A8A29E]'>
                <span className='h-px w-3 flex-shrink-0 bg-[#A16207]' />
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ── Caractéristiques ── */}
      <ProductCharacteristics productData={productData} />

      {/* ── Avis ── */}
      <ProductReviews
        productId={productId}
        token={token || localStorage.getItem('token')}
        reviews={reviews}
        loading={reviewsLoading}
        onRefresh={fetchReviews}
        avgRating={avgRating}
      />

      {/* ── Related products ── */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  )
}

export default Product
