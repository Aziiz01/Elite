import React from 'react'
import { pexelsImages } from '../../constants/images'
import RevealOnScroll from './RevealOnScroll'

const ritualSteps = [
  {
    title: 'Preparation',
    description: "Des couches hydratantes qui fondent sur la peau et creent une base lisse et lumineuse.",
  },
  {
    title: 'Definition',
    description: "Un pigment modulable pour attirer l'attention aux bons endroits, sans effet lourd.",
  },
  {
    title: 'Fixation',
    description: "Un fini naturel qui reste net et elegant du jour jusqu'au soir.",
  },
]

const RitualExperienceSection = () => {
  return (
    <section className='pt-20 sm:pt-24 md:pt-28'>
      <div className='grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center'>
        <RevealOnScroll>
          <p className='luxury-eyebrow'>Le rituel</p>
          <h2 className='luxury-heading mt-3'>Votre experience luxe en cinq minutes.</h2>
          <p className='mt-5 max-w-xl text-sm sm:text-base text-[#5f4d41] leading-relaxed'>
            Chaque produit est pense pour se superposer naturellement, afin que votre routine soit intuitive, raffinee
            et personnelle.
          </p>
          <div className='mt-8 space-y-5'>
            {ritualSteps.map((step, index) => (
              <div key={step.title} className='flex gap-4'>
                <span className='mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#ccb6a7] text-xs text-[#6c5547]'>
                  {index + 1}
                </span>
                <div>
                  <h3 className='text-base font-semibold text-[#2f2721]'>{step.title}</h3>
                  <p className='mt-1 text-sm text-[#6c5a4e]'>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={140}>
          <div className='overflow-hidden rounded-3xl border border-[#ecdfd6] bg-[#f7efe8]'>
            <img src={pexelsImages.cosmeticProductsWide} alt='Rituel beaute luxe' className='h-full w-full object-cover' loading='lazy' />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default RitualExperienceSection
