import React, { useState } from 'react'
import StarRating from './StarRating'
import { updateReviewApi, deleteReviewApi } from '../../api/client'
import { toast } from 'react-toastify'

const ReviewCard = ({ review, isOwn, token, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editRating, setEditRating] = useState(review.rating)
  const [editComment, setEditComment] = useState(review.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userName = review.userId
    ? [review.userId.firstName, review.userId.lastName].filter(Boolean).join(' ') || 'Anonyme'
    : 'Anonyme'

  const handleUpdate = async () => {
    setIsSubmitting(true)
    try {
      const res = await updateReviewApi(
        { reviewId: review._id, rating: editRating, comment: editComment },
        token
      )
      if (res.data.success) {
        toast.success('Avis mis à jour')
        onUpdate?.(res.data.review)
        setIsEditing(false)
      } else {
        toast.error(res.data.message || 'Échec de la mise à jour')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Supprimer votre avis ?')) return
    setIsSubmitting(true)
    try {
      const res = await deleteReviewApi({ reviewId: review._id }, token)
      if (res.data.success) {
        toast.success('Avis supprimé')
        onDelete?.(review._id)
      } else {
        toast.error(res.data.message || 'Échec de la suppression')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : ''

  if (isEditing) {
    return (
      <div className='border-b border-[#ecdfd6] py-5 last:border-0'>
        <p className='text-sm font-medium text-[#2f2219] mb-2'>Modifier votre avis</p>
        <div className='flex gap-2 mb-2'>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type='button'
              onClick={() => setEditRating(i)}
              className='text-lg leading-none'
            >
              <span className={i <= editRating ? 'text-amber-500' : 'text-gray-300'}>★</span>
            </button>
          ))}
        </div>
        <textarea
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
          placeholder='Votre commentaire (optionnel)'
          className='w-full border border-[#dccabf] rounded-xl px-3 py-2 text-sm mb-2 min-h-[60px]'
          rows={2}
        />
        <div className='flex gap-2'>
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className='luxury-btn-primary disabled:opacity-50'
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={isSubmitting}
            className='rounded-full border border-[#d8c5b6] text-xs px-4 py-2 text-[#5f4d41]'
          >
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='border-b border-[#ecdfd6] py-5 last:border-0'>
      <div className='flex justify-between items-start gap-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 flex-wrap'>
            <p className='font-medium text-[#2f2219] text-sm'>{userName}</p>
            <StarRating rating={review.rating} />
            {dateStr && (
              <span className='text-[#9a8578] text-xs'>{dateStr}</span>
            )}
          </div>
          {review.comment && review.comment.trim() && (
            <p className='text-[#5f4d41] text-sm mt-2'>{review.comment}</p>
          )}
        </div>
        {isOwn && (
          <div className='flex gap-2 flex-shrink-0'>
            <button
              onClick={() => setIsEditing(true)}
              disabled={isSubmitting}
              className='text-xs text-[#5f4d41] hover:text-[#2f2219] underline'
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className='text-xs text-[#b94c4c] hover:text-[#993f3f] underline'
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewCard
