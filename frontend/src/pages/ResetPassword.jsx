import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams, Link } from 'react-router-dom'
import { resetPassword } from '../api/client'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword]     = useState('')
  const [confirmPassword, setConfirm]     = useState('')
  const [showNew, setShowNew]             = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [submitting, setSubmitting]       = useState(false)
  const [done, setDone]                   = useState(false)
  const [error, setError]                 = useState('')

  /* Redirect if no token in URL */
  useEffect(() => {
    if (!token) setError('Lien invalide. Veuillez refaire une demande de réinitialisation.')
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setSubmitting(true)
    try {
      const res = await resetPassword(token, newPassword)
      if (res.data.success) {
        setDone(true)
        toast.success('Mot de passe mis à jour avec succès.')
      } else {
        setError(res.data.message || 'Lien invalide ou expiré.')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Une erreur est survenue.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className='border-t border-[#E5E5E5] pb-20 pt-10'>
      <Helmet>
        <title>Nouveau mot de passe | Elite</title>
        <meta name='description' content='Choisissez un nouveau mot de passe pour votre compte Elite.' />
      </Helmet>

      <div className='mx-auto w-full max-w-md'>
        {/* Header */}
        <div className='mb-8'>
          <span className='section-eyebrow'>Sécurité du compte</span>
          <h1 className='mt-2 font-display text-3xl font-semibold text-[#1C1917] sm:text-4xl'>
            Nouveau mot de passe
          </h1>
        </div>

        {/* ── Success state ── */}
        {done && (
          <div className='border border-[#BBF7D0] bg-[#F0FDF4] px-6 py-8 text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-[#BBF7D0] bg-[#DCFCE7]'>
              <svg className='h-5 w-5 text-[#166534]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
              </svg>
            </div>
            <p className='text-sm font-semibold text-[#166534]'>Mot de passe mis à jour</p>
            <p className='mt-2 text-[13px] leading-[1.7] text-[#57534E]'>
              Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
            <div className='mt-6'>
              <Link to='/login' className='btn-primary inline-flex'>
                Se connecter
              </Link>
            </div>
          </div>
        )}

        {/* ── Invalid / no token ── */}
        {!done && !token && (
          <div className='border border-[#E5E5E5] bg-[#FAFAF9] px-6 py-8 text-center'>
            <p className='text-sm text-[#57534E]'>{error}</p>
            <div className='mt-5'>
              <Link to='/login' className='btn-primary inline-flex'>
                Retour à la connexion
              </Link>
            </div>
          </div>
        )}

        {/* ── Form ── */}
        {!done && token && (
          <form onSubmit={handleSubmit} className='flex flex-col gap-5' noValidate>
            <p className='text-sm leading-[1.7] text-[#57534E]'>
              Choisissez un nouveau mot de passe d&apos;au moins 8 caractères.
            </p>

            {/* New password */}
            <div>
              <label htmlFor='new-password' className='mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[#57534E]'>
                Nouveau mot de passe
              </label>
              <div className='relative'>
                <input
                  id='new-password'
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Min. 8 caractères'
                  required
                  minLength={8}
                  autoComplete='new-password'
                  className='shop-input pr-12'
                />
                <button
                  type='button'
                  onClick={() => setShowNew((v) => !v)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] transition-colors hover:text-[#1C1917]'
                  aria-label={showNew ? 'Masquer' : 'Afficher'}
                >
                  {showNew ? (
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
                    </svg>
                  ) : (
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
                      <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor='confirm-password' className='mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[#57534E]'>
                Confirmer le mot de passe
              </label>
              <div className='relative'>
                <input
                  id='confirm-password'
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder='Répétez le mot de passe'
                  required
                  minLength={8}
                  autoComplete='new-password'
                  className='shop-input pr-12'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirm((v) => !v)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] transition-colors hover:text-[#1C1917]'
                  aria-label={showConfirm ? 'Masquer' : 'Afficher'}
                >
                  {showConfirm ? (
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
                    </svg>
                  ) : (
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
                      <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Inline error */}
            {error && (
              <div className='flex items-start gap-2 border border-[#e02020]/20 bg-[#FFF5F5] px-4 py-3'>
                <svg className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#e02020]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' />
                </svg>
                <p className='text-[12px] text-[#e02020]'>{error}</p>
              </div>
            )}

            <button
              type='submit'
              disabled={submitting}
              className='btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50'
            >
              {submitting ? 'Mise à jour...' : 'Enregistrer le nouveau mot de passe'}
            </button>

            <div className='border-t border-[#F0EDE8] pt-4'>
              <Link
                to='/login'
                className='flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[#A8A29E] transition-colors hover:text-[#1C1917]'
              >
                <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18' />
                </svg>
                Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default ResetPassword
