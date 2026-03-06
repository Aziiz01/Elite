import React from 'react'
import { useNavigate } from 'react-router-dom'

const CheckoutAuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleLoginRegister = () => {
    onClose()
    navigate('/login', { state: { redirect: '/place-order' } })
  }

  const handleContinueAsGuest = () => {
    onClose()
    navigate('/place-order', { state: { isGuest: true } })
  }

  return (
    <>
      <div
        className='fixed inset-0 bg-black/50 z-40'
        onClick={onClose}
        aria-hidden="true"
      />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'>
        <div
          className='bg-white w-full max-w-md pointer-events-auto p-6'
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className='text-xl font-medium text-gray-900 mb-2'>Proceed to Checkout</h2>
          <p className='text-gray-600 text-sm mb-6'>Choose how you would like to continue:</p>
          <div className='flex flex-col gap-3'>
            <button
              type='button'
              onClick={handleLoginRegister}
              className='w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors'
            >
              Login / Register
            </button>
            <button
              type='button'
              onClick={handleContinueAsGuest}
              className='w-full border border-gray-800 text-gray-900 py-3 text-sm font-medium hover:bg-gray-50 transition-colors'
            >
              Continue as Guest
            </button>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='mt-4 w-full text-gray-500 text-sm hover:text-gray-700'
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

export default CheckoutAuthModal
