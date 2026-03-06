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
    ? [review.userId.firstName, review.userId.lastName].filter(Boolean).join(' ') || 'Anonymous'
    : 'Anonymous'

  const handleUpdate = async () => {
    setIsSubmitting(true)
    try {
      const res = await updateReviewApi(
        { reviewId: review._id, rating: editRating, comment: editComment },
        token
      )
      if (res.data.success) {
        toast.success('Review updated')
        onUpdate?.(res.data.review)
        setIsEditing(false)
      } else {
        toast.error(res.data.message || 'Update failed')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete your review?')) return
    setIsSubmitting(true)
    try {
      const res = await deleteReviewApi({ reviewId: review._id }, token)
      if (res.data.success) {
        toast.success('Review deleted')
        onDelete?.(review._id)
      } else {
        toast.error(res.data.message || 'Delete failed')
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
      <div className='border-b border-gray-200 py-4 last:border-0'>
        <p className='text-sm font-medium text-gray-800 mb-2'>Edit your review</p>
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
          placeholder='Your comment (optional)'
          className='w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 min-h-[60px]'
          rows={2}
        />
        <div className='flex gap-2'>
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className='bg-black text-white text-xs px-4 py-2 disabled:opacity-50'
          >
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={isSubmitting}
            className='border border-gray-400 text-xs px-4 py-2'
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='border-b border-gray-200 py-4 last:border-0'>
      <div className='flex justify-between items-start gap-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 flex-wrap'>
            <p className='font-medium text-gray-800 text-sm'>{userName}</p>
            <StarRating rating={review.rating} />
            {dateStr && (
              <span className='text-gray-400 text-xs'>{dateStr}</span>
            )}
          </div>
          {review.comment && review.comment.trim() && (
            <p className='text-gray-600 text-sm mt-2'>{review.comment}</p>
          )}
        </div>
        {isOwn && (
          <div className='flex gap-2 flex-shrink-0'>
            <button
              onClick={() => setIsEditing(true)}
              disabled={isSubmitting}
              className='text-xs text-gray-600 hover:text-black underline'
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className='text-xs text-red-600 hover:text-red-700 underline'
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewCard
