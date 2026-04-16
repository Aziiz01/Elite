/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { createReview, updateReviewApi, deleteReviewApi } from '../../api/client'
import { toast } from 'react-toastify'

/* ── helpers ── */
const getUserIdFromToken = (token) => {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1])).id || null
  } catch {
    return null
  }
}

/* ── Inline star picker ── */
const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0)
  const display = hover || value
  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type='button'
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${i} étoile${i > 1 ? 's' : ''}`}
          className='cursor-pointer text-[1.4rem] leading-none transition-colors'
        >
          <span className={i <= display ? 'text-[#A16207]' : 'text-[#D6D3D1]'}>★</span>
        </button>
      ))}
    </div>
  )
}

/* ── Star display (read-only) ── */
const Stars = ({ n }) => (
  <span className='flex gap-0.5'>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={`text-[11px] leading-none ${i <= n ? 'text-[#A16207]' : 'text-[#D6D3D1]'}`} aria-hidden='true'>
        ★
      </span>
    ))}
  </span>
)

/* ── Single review card ── */
const ReviewCard = ({ review, isOwn, token, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false)
  const [editRating, setEditRating] = useState(review.rating)
  const [editComment, setEditComment] = useState(review.comment || '')
  const [submitting, setSubmitting] = useState(false)

  const name = review.userId
    ? [review.userId.firstName, review.userId.lastName].filter(Boolean).join(' ') || 'Anonyme'
    : 'Anonyme'
  const initial = name.charAt(0).toUpperCase()
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  const handleUpdate = async () => {
    setSubmitting(true)
    try {
      const res = await updateReviewApi({ reviewId: review._id, rating: editRating, comment: editComment }, token)
      if (res.data.success) {
        toast.success('Avis mis à jour')
        onUpdate?.(res.data.review)
        setEditing(false)
      } else {
        toast.error(res.data.message || 'Échec de la mise à jour')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Supprimer votre avis ?')) return
    setSubmitting(true)
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
      setSubmitting(false)
    }
  }

  if (editing) {
    return (
      <div className='border-b border-[#F0EDE8] px-6 py-6 last:border-0'>
        <p className='mb-3 text-[11px] uppercase tracking-[0.15em] text-[#A8A29E]'>Modifier votre avis</p>
        <StarPicker value={editRating} onChange={setEditRating} />
        <textarea
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
          placeholder='Votre commentaire (optionnel)'
          rows={2}
          className='shop-input mt-3 min-h-[70px] resize-none'
        />
        <div className='mt-3 flex gap-2'>
          <button
            type='button'
            onClick={handleUpdate}
            disabled={submitting}
            className='btn-primary disabled:opacity-50'
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type='button'
            onClick={() => setEditing(false)}
            disabled={submitting}
            className='btn-outline'
          >
            Annuler
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='border-b border-[#F0EDE8] px-6 py-5 last:border-0'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-start gap-3'>
          <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center bg-[#1C1917] text-[11px] font-bold text-white'>
            {initial}
          </div>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-[13px] font-semibold text-[#1C1917]'>{name}</span>
              <Stars n={review.rating} />
              {date && <span className='text-[10px] text-[#A8A29E]'>{date}</span>}
            </div>
            {review.comment?.trim() && (
              <p className='mt-1.5 text-sm leading-[1.65] text-[#57534E]'>{review.comment}</p>
            )}
          </div>
        </div>
        {isOwn && (
          <div className='flex flex-shrink-0 gap-3'>
            <button
              type='button'
              onClick={() => setEditing(true)}
              disabled={submitting}
              className='text-[11px] uppercase tracking-[0.1em] text-[#A8A29E] transition-colors hover:text-[#1C1917]'
            >
              Modifier
            </button>
            <button
              type='button'
              onClick={handleDelete}
              disabled={submitting}
              className='text-[11px] uppercase tracking-[0.1em] text-[#A8A29E] transition-colors hover:text-[#e02020]'
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Write-a-review form ── */
const ReviewForm = ({ productId, token, onSuccess }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) {
      toast.error('Veuillez choisir une note (1 à 5 étoiles)')
      return
    }
    setSubmitting(true)
    try {
      const res = await createReview({ productId, rating, comment: comment.trim() || undefined }, token)
      if (res.data.success) {
        toast.success('Avis ajouté !')
        setRating(0)
        setComment('')
        onSuccess?.(res.data.review)
      } else {
        toast.error(res.data.message || "Échec de l'ajout de l'avis")
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='border border-[#E5E5E5] bg-[#FAFAF9] p-6'>
      <span className='section-eyebrow'>Partagez votre expérience</span>
      <p className='mt-2 mb-4 text-sm font-semibold text-[#1C1917]'>Écrire un avis</p>
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Votre commentaire (optionnel)'
        rows={3}
        className='shop-input mt-4 min-h-[90px] resize-none'
      />
      <div className='mt-4'>
        <button
          type='submit'
          disabled={submitting}
          className='btn-primary disabled:opacity-50'
        >
          {submitting ? 'Envoi...' : 'Publier'}
        </button>
      </div>
    </form>
  )
}

/* ── Main section ── */
const ProductReviews = ({ productId, token, reviews, loading, onRefresh, avgRating }) => {
  const navigate = useNavigate()
  const currentUserId = getUserIdFromToken(token)

  const userReview = token
    ? reviews.find((r) => {
        const uid = typeof r.userId === 'object' ? r.userId?._id : r.userId
        return uid && currentUserId && String(uid) === String(currentUserId)
      })
    : null

  return (
    <section className='border-t border-[#E5E5E5] py-14 sm:py-16'>
      {/* Header */}
      <div className='mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <span className='section-eyebrow'>Expérience client</span>
          <h2 className='mt-2 font-display text-2xl font-semibold text-[#1C1917] sm:text-3xl'>
            Avis {reviews.length > 0 && <span className='font-normal text-[#A8A29E]'>({reviews.length})</span>}
          </h2>
        </div>

        {/* Average score */}
        {avgRating && reviews.length > 0 && (
          <div className='flex items-center gap-3 self-start sm:self-auto'>
            <span className='font-display text-4xl font-semibold text-[#1C1917]'>{avgRating}</span>
            <div className='flex flex-col gap-1'>
              <Stars n={Math.round(Number(avgRating))} />
              <span className='text-[10px] uppercase tracking-[0.15em] text-[#A8A29E]'>
                {reviews.length} avis
              </span>
            </div>
          </div>
        )}
      </div>

      <div className='grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start'>
        {/* Reviews list */}
        <div className='border border-[#E5E5E5] bg-white'>
          {loading ? (
            <p className='px-6 py-10 text-sm text-[#A8A29E]'>Chargement des avis...</p>
          ) : reviews.length === 0 ? (
            <p className='px-6 py-10 text-sm text-[#A8A29E]'>
              Aucun avis pour le moment. Soyez la première à partager votre expérience.
            </p>
          ) : (
            <div>
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

        {/* Form or CTA */}
        <div>
          {token && !userReview && (
            <ReviewForm productId={productId} token={token} onSuccess={onRefresh} />
          )}
          {token && userReview && (
            <div className='border border-[#E5E5E5] bg-[#FAFAF9] p-6 text-sm text-[#57534E]'>
              <p className='font-medium text-[#1C1917]'>Votre avis a été publié.</p>
              <p className='mt-1 text-[#A8A29E] text-[12px]'>Vous pouvez le modifier directement dans la liste.</p>
            </div>
          )}
          {!token && (
            <div className='border border-[#E5E5E5] bg-[#FAFAF9] p-6'>
              <p className='text-sm text-[#57534E]'>Connectez-vous pour laisser votre avis.</p>
              <button
                type='button'
                onClick={() => navigate('/login')}
                className='btn-primary mt-4'
              >
                Se connecter
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductReviews
