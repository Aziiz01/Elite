/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pexelsImages } from '../../constants/images'

/* ─── Countdown hook ─── */
const msUntil = (daysFromNow) => {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(23, 59, 59, 0)
  return d
}

const END_DATES = [
  msUntil(3), msUntil(7), msUntil(2),
  msUntil(5), msUntil(10), msUntil(4),
]

const useCountdown = (targetDate) => {
  const [t, setT] = useState(null)
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) { setT({ d: 0, h: '00', m: '00', s: '00' }); return }
      const d = Math.floor(diff / 86400000)
      const h = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0')
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      setT({ d, h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return t
}

/* ─── 3 rotating promo sets ─── */
const PROMO_SETS = [
  [
    {
      badge: "JUSQU'À -40%",
      title: 'Soldes Printemps',
      desc: 'Profitez de nos meilleures offres sur le maquillage et les soins de la saison. Quantités limitées.',
      cta: { label: 'Voir les offres', to: '/collection?deal=1' },
      bg: pexelsImages.makeupFlatlay,
      endDate: END_DATES[0],
    },
    {
      badge: 'LIVRAISON OFFERTE',
      title: "Sans minimum d'achat",
      desc: 'Commandez maintenant et recevez votre commande à domicile sans frais supplémentaires.',
      cta: { label: 'Explorer la boutique', to: '/collection' },
      bg: pexelsImages.cosmeticProductsWide,
      endDate: END_DATES[1],
    },
  ],
  [
    {
      badge: 'NOUVEAUTÉS 2025',
      title: 'Collection Printemps',
      desc: 'Découvrez les nouvelles teintes et formules exclusives de la saison. Frais arrivés en boutique.',
      cta: { label: 'Voir les nouveautés', to: '/collection' },
      bg: pexelsImages.womanPinkEyeshadowWide,
      endDate: END_DATES[2],
    },
    {
      badge: 'OFFRE EXCLUSIVE',
      title: 'Pack Découverte',
      desc: 'Composez votre coffret maquillage personnalisé parmi notre sélection de bestsellers.',
      cta: { label: 'Composer mon pack', to: '/collection' },
      bg: pexelsImages.luxuryPerfumeWide,
      endDate: END_DATES[3],
    },
  ],
  [
    {
      badge: '-25% DÈS 3 ARTICLES',
      title: 'Offre Fidélité',
      desc: 'Achetez 3 produits ou plus et bénéficiez automatiquement de 25% de réduction sur votre commande.',
      cta: { label: 'En profiter', to: '/collection' },
      bg: pexelsImages.womanRedLipsWide,
      endDate: END_DATES[4],
    },
    {
      badge: 'ÉDITION LIMITÉE',
      title: 'Collection Exclusive',
      desc: 'Des teintes créées en édition limitée. Disponibles uniquement sur Elite, pour une durée limitée.',
      cta: { label: 'Découvrir', to: '/collection' },
      bg: pexelsImages.makeupBrushesWide,
      endDate: END_DATES[5],
    },
  ],
]

/* ─── Single banner card ─── */
const BannerCard = ({ promo }) => {
  const t = useCountdown(promo.endDate)

  return (
    <div>
      <div className='relative overflow-hidden bg-[#F5F5F5]' style={{ aspectRatio: '3/2' }}>
        <img
          src={promo.bg}
          alt=''
          aria-hidden='true'
          className='absolute inset-0 h-full w-full object-cover opacity-20'
          loading='lazy'
        />
        <div className='relative z-10 flex h-full flex-col justify-between p-5 sm:p-7'>
          {/* Brand */}
          <div className='flex items-center gap-2'>
            <span className='text-[10px] font-bold uppercase tracking-[0.25em] text-[#A16207]'>ÉLITE</span>
            <span className='h-px w-4 bg-[#D6D3D1]' />
            <span className='text-[9px] uppercase tracking-[0.15em] text-[#A8A29E]'>Beauty</span>
          </div>

          {/* Body */}
          <div>
            <span className='inline-block bg-[#e02020] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white'>
              {promo.badge}
            </span>
            <h3
              className='mt-3 font-display font-semibold leading-tight text-[#1C1917]'
              style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}
            >
              {promo.title}
            </h3>
            <p className='mt-2 max-w-[30ch] text-[12px] leading-[1.65] text-[#57534E]'>
              {promo.desc}
            </p>
            <div className='mt-4'>
              <Link
                to={promo.cta.to}
                className='inline-flex h-9 cursor-pointer items-center bg-[#1C1917] px-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#292524]'
              >
                {promo.cta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown */}
      {t && (
        <div className='mt-2.5 flex items-center gap-2'>
          <svg className='h-3 w-3 flex-shrink-0 text-[#e02020]' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z' />
          </svg>
          <span className='text-[10px] text-[#57534E]'>Temps restant :</span>
          <span className='font-mono text-[11px] font-bold tabular-nums text-[#e02020]'>
            {t.d}j&nbsp;{t.h}:{t.m}:{t.s}
          </span>
        </div>
      )}
      <p className='mt-1.5 text-[9px] text-[#D6D3D1]'>ⓘ Sponsorisé</p>
    </div>
  )
}

/* ─── Section — accepts variant index to cycle through promo sets ─── */
const PromoBannersSection = ({ variant = 0 }) => {
  const set = PROMO_SETS[variant % PROMO_SETS.length]
  return (
    <section className='border-t border-[#E5E5E5] py-8 sm:py-10'>
      <div className='grid gap-4 sm:grid-cols-2 sm:gap-5'>
        {set.map((promo, i) => (
          <BannerCard key={i} promo={promo} />
        ))}
      </div>
    </section>
  )
}

export default PromoBannersSection
