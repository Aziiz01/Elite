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
        <div className='flex flex-col gap-2 rounded-2xl border border-[#eaded4] bg-[#fdf9f6] p-5'>
          <p className='text-sm text-[#5f4d41]'>Connectez-vous pour laisser votre avis.</p>
          <button
            onClick={() => navigate('/login')}
            className='luxury-btn-primary w-fit'
          >
            Se connecter
          </button>
        </div>
      )}

      <div>
        <p className='text-xs uppercase tracking-[0.16em] text-[#8f7a6c] mb-3'>
          Avis {reviews.length > 0 && `(${reviews.length})`}
        </p>
        {loading ? (
          <p className='text-[#6f5c50] text-sm py-4'>Chargement des avis...</p>
        ) : reviews.length === 0 ? (
          <p className='text-[#6f5c50] text-sm py-6'>Aucun avis pour le moment. Soyez la premiere a partager votre experience.</p>
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
