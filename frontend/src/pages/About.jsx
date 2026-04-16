/* eslint-disable react/no-unescaped-entities */
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { pexelsImages } from '../constants/images'
import TestimonialsSection from '../components/luxury/TestimonialsSection'
import InnerCircleNewsletter from '../components/luxury/InnerCircleNewsletter'
import RevealOnScroll from '../components/luxury/RevealOnScroll'

const pillars = [
  {
    label: 'Qualité authentique',
    desc: 'Chaque produit est vérifié et choisi pour son rendu fiable, son fini et son confort sur la peau.',
    num: '01',
  },
  {
    label: 'Service national',
    desc: 'Livraison rapide et sécurisée partout en Tunisie, avec un emballage soigné pour les produits premium.',
    num: '02',
  },
  {
    label: 'Accompagnement personnalisé',
    desc: "Notre équipe vous guide sur les teintes, l'utilisation et la sélection adaptée à votre rituel beauté.",
    num: '03',
  },
]

const About = () => {
  return (
    <main>
      <Helmet>
        <title>À propos d'Elite | Maison de beauté de luxe</title>
        <meta
          name='description'
          content='Découvrez Elite, une maison de beauté soigneusement sélectionnée qui allie luxe, minimalisme et confiance moderne.'
        />
      </Helmet>

      {/* ── Hero banner ── */}
      <div className='bleed-x relative flex h-[340px] items-end overflow-hidden bg-[#F0EDE8] sm:h-[400px]'>
        <img
          src={pexelsImages.womanGoldMakeup}
          alt=''
          aria-hidden='true'
          className='absolute inset-0 h-full w-full object-cover opacity-30'
          loading='eager'
        />
        <div className='absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#F0EDE8] to-transparent' />
        <div className='relative z-10 pb-10 pl-8 sm:pl-12 md:pl-16 lg:pl-20'>
          <span className='luxury-eyebrow'>À propos d'Elite</span>
          <h1
            className='mt-4 font-display font-semibold leading-[0.9] text-[#1C1917]'
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
          >
            Une maison beauté
            <br />
            <em className='font-normal italic text-[#A16207]'>construite sur la confiance.</em>
          </h1>
        </div>
      </div>

      {/* ── Brand story ── */}
      <section className='border-t border-[#E5E5E5] py-16 sm:py-20 md:py-24'>
        <RevealOnScroll>
          <div className='grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16'>
            {/* Image */}
            <div className='overflow-hidden bg-[#F0EDE8]' style={{ aspectRatio: '4/3' }}>
              <img
                src={pexelsImages.womanPinkEyeshadow}
                alt='Identité beauté luxe Elite'
                className='h-full w-full object-cover'
                loading='lazy'
              />
            </div>

            {/* Text */}
            <div>
              <span className='luxury-eyebrow'>Notre histoire</span>
              <h2
                className='mt-4 font-display leading-[0.92] text-[#1C1917]'
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
              >
                Quand la beauté éditoriale
                <br />
                <em className='font-normal italic text-[#A8A29E]'>rencontre le quotidien.</em>
              </h2>
              <div className='mt-5 h-px w-10 bg-[#A16207]' />
              <p className='mt-6 text-sm leading-[1.75] text-[#57534E] sm:text-base'>
                Née en Tunisie, Elite associe élégance locale et culture beauté contemporaine. Chaque
                collection est choisie pour aider les femmes à exprimer leur style avec précision et
                douceur.
              </p>
              <p className='mt-4 text-sm leading-[1.75] text-[#57534E] sm:text-base'>
                Des essentiels teint aux couleurs signature, notre mission est simple : proposer des
                produits authentiques dont l'expérience est luxueuse et le rendu intemporel.
              </p>
              <div className='mt-8'>
                <Link
                  to='/collection'
                  className='btn-primary'
                >
                  Découvrir la collection
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ── Pillars ── */}
      <section className='border-t border-[#E5E5E5] py-16 sm:py-20 md:py-24'>
        <RevealOnScroll>
          <div className='mb-10 sm:mb-14'>
            <span className='luxury-eyebrow'>Pourquoi choisir Elite</span>
            <h2
              className='mt-4 font-display leading-[0.92] text-[#1C1917]'
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
            >
              Le luxe dans
              <br />
              <em className='font-normal italic text-[#A8A29E]'>chaque détail.</em>
            </h2>
          </div>
        </RevealOnScroll>

        <div className='grid gap-px bg-[#E5E5E5] sm:grid-cols-3'>
          {pillars.map((p, i) => (
            <RevealOnScroll key={p.num} delay={i * 80}>
              <article className='flex flex-col gap-5 bg-[#FAFAF9] p-7 sm:p-8'>
                <span className='text-[11px] font-medium uppercase tracking-[0.3em] text-[#A16207]'>
                  {p.num}
                </span>
                <h3 className='font-display text-xl text-[#1C1917] sm:text-2xl'>{p.label}</h3>
                <p className='text-sm leading-[1.7] text-[#57534E]'>{p.desc}</p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── Stats strip ── */}
      <RevealOnScroll>
        <div className='border-t border-[#E5E5E5] grid grid-cols-3 bg-[#F0EDE8]'>
          {[
            { value: '2 000+', label: 'Clientes satisfaites' },
            { value: '150+', label: 'Produits sélectionnés' },
            { value: '24h', label: 'Livraison express' },
          ].map((s) => (
            <div key={s.label} className='flex flex-col items-center gap-2 py-10 sm:py-14'>
              <span
                className='font-display font-semibold text-[#A16207]'
                style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
              >
                {s.value}
              </span>
              <span className='text-[10px] uppercase tracking-[0.2em] text-[#57534E]'>{s.label}</span>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Newsletter ── */}
      <div className='bleed-x'>
        <InnerCircleNewsletter />
      </div>
    </main>
  )
}

export default About
