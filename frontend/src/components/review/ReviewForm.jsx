import React, { useState } from 'react'
import { createReview } from '../../api/client'
import { toast } from 'react-toastify'

const ReviewForm = ({ productId, token, onSuccess }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const displayRating = hoverRating || rating

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Veuillez choisir une note (1 à 5 étoiles)')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await createReview(
        { productId, rating, comment: comment.trim() || undefined },
        token
      )
      if (res.data.success) {
        toast.success('Avis ajouté !')
        setRating(0)
        setComment('')
        onSuccess?.(res.data.review)
      } else {
        toast.error(res.data.message || 'Échec de l\'ajout de l\'avis')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='border border-gray-200 rounded p-4 bg-gray-50'>
      <p className='text-sm font-medium text-gray-800 mb-2'>Écrire un avis</p>
      <div className='flex gap-1 mb-3'>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type='button'
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            className='text-2xl leading-none p-0.5'
          >
            <span className={i <= displayRating ? 'text-amber-500' : 'text-gray-300'}>★</span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Votre commentaire (optionnel)'
        className='w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 min-h-[80px] focus:ring-2 focus:ring-gray-400 focus:border-transparent'
        rows={3}
      />
      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-black text-white text-sm px-6 py-2 rounded focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50'
      >
        {isSubmitting ? 'Envoi…' : 'Publier'}
      </button>
    </form>
  )
}

export default ReviewForm
