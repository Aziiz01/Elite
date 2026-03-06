import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const AddToCartModal = ({ isOpen, onClose, product, quantity }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)
  const navigate = useNavigate()

  if (!isOpen) return null

  const displayPrice = product?.newPrice != null && product?.newPrice !== '' ? product.newPrice : product?.price
  const subtotal = getCartAmount()
  const shipping = delivery_fee
  const total = subtotal + shipping

  const handleContinueShopping = () => {
    onClose()
  }

  const handleCheckout = () => {
    onClose()
    navigate('/cart')
  }

  return (
    <>
      <div
        className='fixed inset-0 bg-black/50 z-40'
        onClick={handleContinueShopping}
        aria-hidden="true"
      />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'>
        <div
          className='bg-white w-full max-w-md pointer-events-auto'
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className='text-center py-6 text-base font-medium uppercase tracking-wide text-gray-900'>
            Product added to your cart
          </h2>

          <div className='px-6 pb-4'>
            <div className='flex gap-4 items-start relative'>
              <div className='relative flex-shrink-0'>
                <div className='w-20 h-20 sm:w-24 sm:h-24 overflow-hidden bg-gray-50'>
                  <img
                    src={product?.image?.[0]}
                    alt={product?.name}
                    className='w-full h-full object-contain'
                  />
                </div>
                <span className='absolute -top-2 -left-1 bg-amber-400 text-gray-900 text-xs font-medium px-2 py-0.5 rounded'>
                  {quantity}×
                </span>
              </div>
              <div className='flex-1 min-w-0 pt-1'>
                <p className='font-medium text-gray-900'>{product?.name}</p>
                <p className='text-sm text-gray-700 mt-1'>{currency}{displayPrice}</p>
              </div>
            </div>
          </div>

          <hr className='border-gray-200' />

          <div className='px-6 py-4 space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Subtotal</span>
              <span>{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>Shipping</span>
              <span>{currency}{shipping.toFixed(2)}</span>
            </div>
            <div className='flex justify-between font-medium pt-2'>
              <span>Total</span>
              <span>{currency}{total.toFixed(2)}</span>
            </div>
          </div>

          <div className='px-6 pb-6 flex gap-3'>
            <button
              type='button'
              onClick={handleContinueShopping}
              className='flex-1 bg-gray-900 text-white py-3 text-sm font-medium uppercase hover:bg-gray-800 transition-colors'
            >
              Continue shopping
            </button>
            <button
              type='button'
              onClick={handleCheckout}
              className='flex-1 bg-gray-900 text-white py-3 text-sm font-medium uppercase hover:bg-gray-800 transition-colors'
            >
              View cart
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddToCartModal
