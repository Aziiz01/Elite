import { useState } from 'react'
import { toast } from 'react-toastify'
import { subscribeNewsletter } from '../../api/client'
import RevealOnScroll from './RevealOnScroll'

const SpinnerIcon = () => (
  <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24' aria-hidden='true'>
    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
)

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
      toast.success('Bienvenue dans le cercle privé.')
    } catch (error) {
      const message =
        error?.response?.data?.error || "Échec de l'inscription. Veuillez réessayer."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='relative overflow-hidden bg-[#F0EDE8]'>
      {/* Ghost text */}
      <div
        className='pointer-events-none absolute inset-0 flex items-center justify-center select-none'
        aria-hidden='true'
      >
        <span
          className='whitespace-nowrap font-display italic font-normal text-[#1C1917]/[0.04]'
          style={{ fontSize: 'clamp(6rem, 22vw, 28rem)' }}
        >
          ÉLITE
        </span>
      </div>

      {/* Top gold rule */}
      <div className='h-px bg-[#A16207]/40' />

      <div className='relative z-10 mx-auto max-w-[1280px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <div className='py-20 sm:py-24 md:py-28'>
          <RevealOnScroll>
            <div className='mx-auto max-w-xl text-center'>
              <span className='luxury-eyebrow'>Accès privé</span>

              <h2
                className='mt-5 font-display font-semibold leading-[0.9] text-[#1C1917]'
                style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.8rem)' }}
              >
                Rejoignez
                <br />
                <em className='font-normal italic text-[#A16207]'>le cercle.</em>
              </h2>

              <p className='mt-6 text-[0.9rem] leading-[1.75] text-[#57534E] sm:mt-8 sm:text-[0.95rem]'>
                Premiers accès aux nouveautés, sélections exclusives et offres
                réservées aux membres. Pas de spam, promis.
              </p>

              {/* Benefits */}
              <div className='mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:mt-10'>
                {['Accès anticipé', 'Offres exclusives', 'Conseils beauté'].map((item) => (
                  <span key={item} className='flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-[#57534E]'>
                    <span className='h-px w-3 bg-[#A16207]' />
                    {item}
                  </span>
                ))}
              </div>

              <div className='mt-8 sm:mt-10'>
                {submitted ? (
                  <div className='flex flex-col items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center border border-[#A16207]/40'>
                      <svg
                        className='h-5 w-5 text-[#A16207]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                      </svg>
                    </div>
                    <p className='text-sm text-[#57534E]'>
                      C&apos;est fait. Surveillez votre boîte mail.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={onSubmit}
                    className='mx-auto flex max-w-md flex-col gap-3 sm:flex-row'
                    noValidate
                  >
                    <label htmlFor='newsletter-email' className='sr-only'>
                      Adresse e-mail
                    </label>
                    <input
                      id='newsletter-email'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='votre@email.com'
                      required
                      autoComplete='email'
                      className='h-12 w-full flex-1 border-b border-[#D6D3D1] bg-transparent px-1 text-sm text-[#1C1917] placeholder:text-[#A8A29E] transition-colors duration-200 focus:border-[#A16207] focus:outline-none'
                    />
                    <button
                      type='submit'
                      disabled={loading}
                      className='inline-flex h-12 cursor-pointer items-center justify-center gap-2 bg-[#A16207] px-8 text-[10px] uppercase tracking-[0.2em] text-white font-medium transition-all duration-300 hover:bg-[#92400E] disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {loading ? (
                        <span className='flex items-center gap-2'>
                          <SpinnerIcon />
                          <span>...</span>
                        </span>
                      ) : (
                        'Rejoindre'
                      )}
                    </button>
                  </form>
                )}
              </div>

              {!submitted && (
                <p className='mt-5 text-[9px] uppercase tracking-[0.25em] text-[#A8A29E] sm:mt-6'>
                  Désinscription à tout moment
                </p>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}

export default InnerCircleNewsletter
