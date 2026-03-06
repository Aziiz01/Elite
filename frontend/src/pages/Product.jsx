import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import { ReviewList, StarRating } from '../components/review';
import { getProductReviews } from '../api/client';
import AddToCartModal from '../components/AddToCartModal';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart, token } = useContext(ShopContext);
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

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
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
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-2 mt-2'>
              <StarRating rating={avgRating || 0} size='sm' />
              {reviews.length > 0 && (
                <p className='text-gray-500 text-sm'>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</p>
              )}
          </div>
          <div className='mt-5 text-3xl font-medium'>
            {productData.newPrice != null && productData.newPrice !== '' ? (
              <span>
                <span className='line-through text-gray-500 text-2xl'>{currency}{productData.price}</span>
                <span className='ml-2 text-green-600'>{currency}{productData.newPrice}</span>
              </span>
            ) : (
              <span>{currency}{productData.price}</span>
            )}
          </div>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p className='text-gray-700 font-medium'>Select Color</p>
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
                  <p className='text-gray-500 text-sm'>No colors available</p>
                )}
              </div>
          </div>
          <div className='flex flex-col gap-4 mb-6'>
              <p className='text-gray-700 font-medium'>Quantity</p>
              <div className='flex items-center gap-2'>
                <button type='button' onClick={() => setQuantity((q) => Math.max(1, q - 1))} className='w-10 h-10 border border-gray-800 flex items-center justify-center text-lg hover:bg-gray-100'>−</button>
                <input type='number' min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))} className='w-16 text-center border border-gray-800 py-2' />
                <button type='button' onClick={() => setQuantity((q) => q + 1)} className='w-10 h-10 border border-gray-800 flex items-center justify-center text-lg hover:bg-gray-100'>+</button>
              </div>
          </div>
          <button
            onClick={async () => {
              await addToCart(productData._id, selectedColor, quantity)
              setShowAddToCartModal(true)
            }}
            disabled={!selectedColor}
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
          >
            ADD TO CART
          </button>
          <AddToCartModal
            isOpen={showAddToCartModal}
            onClose={() => setShowAddToCartModal(false)}
            product={productData}
            quantity={quantity}
          />
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
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
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </button>
        </div>
        <div className='border px-6 py-6 text-sm'>
          {activeTab === 'description' && (
            <div className='flex flex-col gap-4 text-gray-500'>
              <p>{productData.description}</p>
              <p>100% Original product. Cash on delivery is available. Easy return and exchange policy within 7 days.</p>
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
  ) : <div className=' opacity-0'></div>
}

export default Product
