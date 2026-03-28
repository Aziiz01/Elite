import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { subscribeNewsletter } from '../../api/client'
import RevealOnScroll from './RevealOnScroll'

const InnerCircleNewsletter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      await subscribeNewsletter(email.trim())
      setSubmitted(true)
      setEmail('')
      toast.success('Bienvenue dans le cercle prive.')
    } catch (error) {
      const message = error?.response?.data?.error || "Echec de l'inscription. Veuillez reessayer."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28 md:pb-28'>
      <RevealOnScroll>
        <div className='rounded-[2rem] border border-[#e9ddd3] bg-[#f5ede6] px-6 py-12 text-center sm:px-10 md:px-16 md:py-16'>
          <p className='luxury-eyebrow'>Acces prive</p>
          <h2 className='luxury-heading mt-3'>Rejoignez le cercle prive.</h2>
          <p className='mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#5f4d41]'>
            Soyez la premiere a decouvrir les nouveautes, les selections exclusives et les offres reservees aux membres.
          </p>

          {submitted ? (
            <p className='mt-7 text-sm font-medium text-[#2d231c]'>Inscription confirmee. Surveillez votre boite mail pour votre premiere selection exclusive.</p>
          ) : (
            <form onSubmit={onSubmit} className='mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row'>
              <input
                type='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder='Entrez votre e-mail'
                required
                className='h-12 w-full rounded-full border border-[#d8c4b5] bg-[#fffcf9] px-5 text-sm text-[#2d231c] placeholder:text-[#8f7a6c] focus:border-[#a88f7f] focus:outline-none'
              />
              <button type='submit' disabled={loading} className='luxury-btn-primary h-12 shrink-0 px-8 disabled:cursor-not-allowed disabled:opacity-70'>
                {loading ? 'Inscription...' : 'Rejoindre'}
              </button>
            </form>
          )}
        </div>
      </RevealOnScroll>
    </section>
  )
}

export default InnerCircleNewsletter
