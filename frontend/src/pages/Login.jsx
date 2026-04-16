import { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { registerUser, loginUser, forgotPassword } from '../api/client'
import { toast } from 'react-toastify'

/* Views: 'login' | 'register' | 'forgot' */

const Login = () => {
  const [view, setView] = useState('login')
  const { token, setToken, navigate } = useContext(ShopContext)
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const redirect = location.state?.redirect || searchParams.get('returnUrl') || '/'

  /* Login / register fields */
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [city, setCity]           = useState('')
  const [address, setAddress]     = useState('')
  const [telephone, setTelephone] = useState('')
  const [postalCode, setPostalCode] = useState('')

  /* Forgot password state */
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent]   = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)

  const switchTo = (v) => {
    setView(v)
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setForgotEmail('')
    setForgotSent(false)
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const apiCall =
        view === 'register'
          ? () => registerUser({ firstName, lastName, email, password, city, address, telephone, postalCode })
          : () => loginUser({ email, password })
      const response = await apiCall()
      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem('token', response.data.token)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const onForgotSubmit = async (e) => {
    e.preventDefault()
    if (!forgotEmail.trim()) return
    setForgotLoading(true)
    try {
      const res = await forgotPassword(forgotEmail.trim())
      if (res.data.success) {
        setForgotSent(true)
      } else {
        toast.error(res.data.message || 'Une erreur est survenue.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Une erreur est survenue.')
    } finally {
      setForgotLoading(false)
    }
  }

  useEffect(() => {
    if (token) navigate(redirect, { replace: true })
  }, [token, navigate, redirect])

  /* ── Page title ── */
  const pageTitle =
    view === 'register'
      ? 'Créer un compte'
      : view === 'forgot'
      ? 'Mot de passe oublié'
      : 'Connexion'

  return (
    <main className='border-t border-[#E5E5E5] pb-20 pt-10'>
      <Helmet>
        <title>{pageTitle} | Elite</title>
        <meta
          name='description'
          content={
            view === 'register'
              ? 'Créez un compte Elite pour sauvegarder votre panier, suivre vos commandes et gérer votre profil.'
              : 'Connectez-vous à votre compte Elite pour gérer vos commandes, favoris et profil.'
          }
        />
      </Helmet>

      <div className='mx-auto w-full max-w-md'>
        {/* Header */}
        <div className='mb-8'>
          <span className='section-eyebrow'>
            {view === 'register' ? 'Nouveau compte' : view === 'forgot' ? 'Réinitialisation' : 'Espace client'}
          </span>
          <h1 className='mt-2 font-display text-3xl font-semibold text-[#1C1917] sm:text-4xl'>
            {pageTitle}
          </h1>
        </div>

        {/* ── Forgot password ── */}
        {view === 'forgot' && (
          <div>
            {forgotSent ? (
              <div className='border border-[#BBF7D0] bg-[#F0FDF4] px-6 py-8 text-center'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-[#BBF7D0] bg-[#DCFCE7]'>
                  <svg className='h-5 w-5 text-[#166534]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' />
                  </svg>
                </div>
                <p className='text-sm font-semibold text-[#166534]'>E-mail envoyé</p>
                <p className='mt-2 text-[13px] leading-[1.7] text-[#57534E]'>
                  Si un compte correspond à <strong className='text-[#1C1917]'>{forgotEmail}</strong>,
                  vous recevrez un lien de réinitialisation dans quelques minutes.
                </p>
                <p className='mt-3 text-[11px] text-[#A8A29E]'>Vérifiez également vos spams.</p>
              </div>
            ) : (
              <form onSubmit={onForgotSubmit} className='flex flex-col gap-5' noValidate>
                <p className='text-sm leading-[1.7] text-[#57534E]'>
                  Entrez votre adresse e-mail. Si un compte existe, vous recevrez un lien pour réinitialiser votre mot de passe.
                </p>
                <div>
                  <label htmlFor='forgot-email' className='mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[#57534E]'>
                    Adresse e-mail
                  </label>
                  <input
                    id='forgot-email'
                    type='email'
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder='votre@email.com'
                    required
                    autoComplete='email'
                    className='shop-input'
                  />
                </div>
                <button
                  type='submit'
                  disabled={forgotLoading}
                  className='btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {forgotLoading ? 'Envoi...' : 'Envoyer le lien'}
                </button>
              </form>
            )}

            <div className='mt-6 border-t border-[#F0EDE8] pt-5'>
              <button
                type='button'
                onClick={() => switchTo('login')}
                className='flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[#A8A29E] transition-colors hover:text-[#1C1917]'
              >
                <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18' />
                </svg>
                Retour à la connexion
              </button>
            </div>
          </div>
        )}

        {/* ── Login / Register ── */}
        {view !== 'forgot' && (
          <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
            {/* Register-only fields */}
            {view === 'register' && (
              <>
                <div className='flex gap-3'>
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    type='text'
                    className='shop-input flex-1'
                    placeholder='Prénom'
                    required
                  />
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    type='text'
                    className='shop-input flex-1'
                    placeholder='Nom'
                    required
                  />
                </div>
                <input onChange={(e) => setCity(e.target.value)} value={city} type='text' className='shop-input' placeholder='Ville' required />
                <input onChange={(e) => setAddress(e.target.value)} value={address} type='text' className='shop-input' placeholder='Adresse' required />
                <input onChange={(e) => setTelephone(e.target.value)} value={telephone} type='tel' className='shop-input' placeholder='Téléphone (min. 8 chiffres)' required minLength={8} />
                <input onChange={(e) => setPostalCode(e.target.value)} value={postalCode} type='text' className='shop-input' placeholder='Code postal (min. 3 caractères)' required minLength={3} />
              </>
            )}

            {/* Shared fields */}
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              className='shop-input'
              placeholder='E-mail'
              required
              autoComplete='email'
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              className='shop-input'
              placeholder='Mot de passe (min. 8 caractères)'
              required
              minLength={8}
              autoComplete={view === 'register' ? 'new-password' : 'current-password'}
            />

            {/* Helper links */}
            <div className='flex items-center justify-between text-[11px] uppercase tracking-[0.1em]'>
              {view === 'login' && (
                <button
                  type='button'
                  onClick={() => switchTo('forgot')}
                  className='text-[#A8A29E] transition-colors hover:text-[#1C1917]'
                >
                  Mot de passe oublié ?
                </button>
              )}
              {view === 'login' ? (
                <button
                  type='button'
                  onClick={() => switchTo('register')}
                  className='ml-auto text-[#A8A29E] transition-colors hover:text-[#1C1917]'
                >
                  Créer un compte
                </button>
              ) : (
                <button
                  type='button'
                  onClick={() => switchTo('login')}
                  className='ml-auto text-[#A8A29E] transition-colors hover:text-[#1C1917]'
                >
                  Déjà inscrit ?
                </button>
              )}
            </div>

            <button type='submit' className='btn-primary w-full mt-1'>
              {view === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

export default Login
