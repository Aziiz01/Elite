import React, { useContext, useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import { ReviewList, StarRating } from '../components/review';
import { getProductReviews } from '../api/client';
import AddToCartModal from '../components/AddToCartModal';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart, token, favoriteIds, toggleFavorite } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showAddToCartModal, setShowAddToCartModal] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  const fetchReviews = useCallback(async () => {
    if (!productId) return
    setReviewsLoading(true)
    try {
      const res = await getProductReviews(productId)
      if (res.data.success) {
        setReviews(res.data.reviews || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setReviewsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    if (productId) fetchReviews()
  }, [productId, fetchReviews])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null
  const userReview = token && reviews.find((r) => {
    const uid = typeof r.userId === 'object' ? r.userId?._id : r.userId
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return uid && payload?.id && String(uid) === String(payload.id)
    } catch {
      return false
    }
  })

  if (products.length > 0 && !productData) {
    return (
      <div className='border-t pt-14 min-h-[50vh] flex flex-col items-center justify-center py-16 px-6 text-center'>
        <Helmet>
          <title>Produit introuvable | Elite</title>
        </Helmet>
        <p className='text-gray-600 text-lg mb-2'>Produit introuvable</p>
        <p className='text-gray-500 text-sm mb-6'>
          Ce produit n'existe pas ou a été retiré du catalogue.
        </p>
        <Link
          to='/collection'
          className='inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors'
        >
          Découvrir la collection
        </Link>
      </div>
    )
  }

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <Helmet>
        <title>{productData.name} | Elite</title>
        <meta name="description" content={productData.description?.slice(0, 160) || `Achetez ${productData.name} chez Elite. Mode femme et maquillage.`} />
      </Helmet>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full gap-2 sm:gap-0'>
              {
                productData.image.map((item, index) => (
                  <div key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 aspect-square overflow-hidden bg-gray-50'>
                    <img onClick={() => setImage(item)} src={item} className='w-full h-full object-contain cursor-pointer' alt="" />
                  </div>
                ))
              }
          </div>
          <div className='w-full sm:w-[80%] aspect-square sm:min-h-[400px] overflow-hidden bg-gray-50'>
              <img className='w-full h-full object-contain' src={image} alt={productData.name} />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <div className='flex items-start gap-2 mt-2'>
            <h1 className='font-medium text-2xl flex-1'>{productData.name}</h1>
            <button
              type='button'
              onClick={() => toggleFavorite(productData._id)}
              aria-label={favoriteIds.includes(String(productData._id)) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${favoriteIds.includes(String(productData._id)) ? 'bg-pink-50 text-pink-500 border-pink-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-pink-200 hover:text-pink-500'}`}
            >
              {favoriteIds.includes(String(productData._id)) ? (
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' /></svg>
              ) : (
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}><path strokeLinecap='round' strokeLinejoin='round' d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' /></svg>
              )}
            </button>
          </div>
          <div className='flex items-center gap-2 mt-2'>
              <StarRating rating={avgRating || 0} size='sm' />
              {reviews.length > 0 && (
                <p className='text-gray-500 text-sm'>({reviews.length} avis)</p>
              )}
          </div>
          <div className='mt-5 flex items-center gap-3 flex-wrap'>
            <span className='text-3xl font-medium'>
              {productData.newPrice != null && productData.newPrice !== '' ? (
                <>
                  <span className='line-through text-gray-500 text-2xl'>{productData.price}{currency}</span>
                  <span className='ml-2 text-gray-900'>{productData.newPrice}{currency}</span>
                </>
              ) : (
                <span>{productData.price}{currency}</span>
              )}
            </span>
            {productData.inStock === false && (
              <span className='text-red-600 font-medium'>Rupture de stock</span>
            )}
          </div>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p className='text-gray-700 font-medium'>Choisir la couleur</p>
              <div className='flex flex-wrap gap-3 items-center'>
                {(productData.colors || []).map((hex, index) => {
                  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);
                  const bgColor = isValidHex ? hex : '#9ca3af';
                  const isSelected = hex === selectedColor;
                  return (
                    <button
                      type='button'
                      key={index}
                      onClick={() => setSelectedColor(hex)}
                      className={`w-9 h-9 rounded-full flex-shrink-0 border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 ${
                        isSelected ? 'border-gray-900 ring-2 ring-gray-400 ring-offset-1' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: bgColor }}
                      title={hex}
                    />
                  );
                })}
                {(productData.colors || []).length === 0 && (
                  <p className='text-gray-500 text-sm'>Aucune couleur disponible</p>
                )}
              </div>
          </div>
          <div className='flex flex-col gap-4 mb-6'>
              <p className='text-gray-700 font-medium'>Quantité</p>
              <div className='flex items-center gap-2'>
                <button type='button' onClick={() => setQuantity((q) => Math.max(1, q - 1))} className='w-10 h-10 border border-gray-300 rounded flex items-center justify-center text-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-400'>−</button>
                <input type='number' min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))} className='w-16 text-center border border-gray-300 rounded py-2 focus:ring-2 focus:ring-gray-400 focus:border-transparent' />
                <button type='button' onClick={() => setQuantity((q) => q + 1)} className='w-10 h-10 border border-gray-300 rounded flex items-center justify-center text-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-400'>+</button>
              </div>
          </div>
          <button
            onClick={async () => {
              if (productData.inStock === false) return
              await addToCart(productData._id, selectedColor, quantity)
              setShowAddToCartModal(true)
            }}
            disabled={!selectedColor || productData.inStock === false}
            className='bg-black text-white px-8 py-3 text-sm rounded focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 active:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
          >
            {productData.inStock === false ? 'RUPTURE DE STOCK' : 'AJOUTER AU PANIER'}
          </button>
          <AddToCartModal
            isOpen={showAddToCartModal}
            onClose={() => setShowAddToCartModal(false)}
            product={productData}
            quantity={quantity}
          />
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>Produit 100 % authentique.</p>
              <p>Paiement à la livraison disponible.</p>
              <p>Retours et échanges faciles sous 7 jours.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Reviews Section ------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <button
            type='button'
            onClick={() => setActiveTab('description')}
            className={`border px-5 py-3 text-sm ${activeTab === 'description' ? 'bg-gray-100 font-medium' : ''}`}
          >
            Description
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('reviews')}
            className={`border px-5 py-3 text-sm ${activeTab === 'reviews' ? 'bg-gray-100 font-medium' : ''}`}
          >
            Avis {reviews.length > 0 && `(${reviews.length})`}
          </button>
        </div>
        <div className='border px-6 py-6 text-sm'>
          {activeTab === 'description' && (
            <div className='flex flex-col gap-4 text-gray-500'>
              <p>{productData.description}</p>
              <p>Produit 100 % authentique. Paiement à la livraison disponible. Retours et échanges faciles sous 7 jours.</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <ReviewList
              productId={productId}
              token={token || localStorage.getItem('token')}
              reviews={reviews}
              loading={reviewsLoading}
              onRefresh={fetchReviews}
              userReview={userReview}
            />
          )}
        </div>
      </div>

      {/* --------- display related products ---------- */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : (
    <div className='border-t pt-14 min-h-[40vh] flex items-center justify-center'>
      <Helmet><title>Chargement | Elite</title></Helmet>
      <p className='text-gray-500'>Chargement du produit…</p>
    </div>
  )
}

export default Product
