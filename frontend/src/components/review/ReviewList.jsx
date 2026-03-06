import React from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'

const getUserIdFromToken = (token) => {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.id || null
  } catch {
    return null
  }
}

const ReviewList = ({
  productId,
  token,
  reviews = [],
  loading,
  onRefresh,
  userReview,
}) => {
  const navigate = useNavigate()
  const currentUserId = getUserIdFromToken(token)
  const userHasReviewed = !!userReview

  return (
    <div className='flex flex-col gap-6'>
      {token && !userHasReviewed && (
        <ReviewForm productId={productId} token={token} onSuccess={onRefresh} />
      )}

      {!token && (
        <div className='flex flex-col gap-2'>
          <p className='text-sm text-gray-500'>Sign in to write a review.</p>
          <button
            onClick={() => navigate('/login')}
            className='bg-black text-white text-sm px-6 py-2 w-fit'
          >
            Sign In
          </button>
        </div>
      )}

      <div>
        <p className='text-sm font-medium text-gray-800 mb-3'>
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </p>
        {loading ? (
          <p className='text-gray-500 text-sm py-4'>Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className='text-gray-500 text-sm py-6'>No reviews yet. Be the first to review!</p>
        ) : (
          <div className='flex flex-col'>
            {reviews.map((r) => {
              const reviewUserId = typeof r.userId === 'object' ? r.userId?._id : r.userId
              const isOwn = currentUserId && String(reviewUserId) === String(currentUserId)
              return (
                <ReviewCard
                  key={r._id}
                  review={r}
                  isOwn={isOwn}
                  token={token}
                  onUpdate={() => onRefresh?.()}
                  onDelete={() => onRefresh?.()}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewList
