import { useState } from 'react'
import { pexelsImages } from '../../constants/images'
import RevealOnScroll from './RevealOnScroll'

const steps = [
  {
    num: '01',
    title: 'Préparation',
    body: 'Des couches hydratantes qui fondent sur la peau et créent une base lisse et lumineuse.',
  },
  {
    num: '02',
    title: 'Définition',
    body: "Un pigment modulable pour attirer l'attention aux bons endroits, sans effet lourd.",
  },
  {
    num: '03',
    title: 'Fixation',
    body: "Un fini naturel qui reste net et élégant du jour jusqu'au soir.",
  },
]

const RitualExperienceSection = () => {
  const [active, setActive] = useState(0)

  return (
    <section className='pt-20 pb-20 sm:pt-28 sm:pb-28 md:pt-36 md:pb-36'>
      <RevealOnScroll>
        <div className='mb-10 max-w-lg sm:mb-14'>
          <span className='luxury-eyebrow'>Le rituel</span>
          <h2
            className='mt-4 font-display leading-[0.95] text-[#111]'
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)' }}
          >
            Cinq minutes.
            <br />
            <em className='font-light italic text-[#888]'>Toute la différence.</em>
          </h2>
        </div>
      </RevealOnScroll>

      <div className='grid gap-10 lg:grid-cols-2 lg:gap-16'>
        {/* Left: Steps accordion */}
        <RevealOnScroll>
          <div className='flex flex-col'>
            {steps.map((step, i) => (
              <button
                key={step.num}
                type='button'
                onClick={() => setActive(i)}
                className={`group cursor-pointer border-t border-[#d4ddd5] py-5 text-left transition-all duration-500 sm:py-6 ${
                  i === steps.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className='flex items-baseline gap-3 sm:gap-4'>
                  <span
                    className={`font-display text-sm transition-colors duration-300 ${
                      active === i ? 'text-[#111]' : 'text-[#b5b5b5]'
                    }`}
                  >
                    {step.num}
                  </span>
                  <h3
                    className={`font-display transition-colors duration-300 ${
                      active === i ? 'text-[#111]' : 'text-[#b5b5b5]'
                    }`}
                    style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)' }}
                  >
                    {step.title}
                  </h3>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    active === i ? 'mt-3 max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className='max-w-sm pl-7 text-[0.85rem] leading-[1.7] text-[#4a4a4a] sm:pl-9 sm:text-[0.9rem]'>
                    {step.body}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </RevealOnScroll>

        {/* Right: Image */}
        <RevealOnScroll delay={150}>
          <div className='relative mx-auto max-w-sm lg:sticky lg:top-24 lg:max-w-none'>
            <div className='aspect-[3/4] overflow-hidden'>
              <img
                src={pexelsImages.cosmeticProductsWide}
                alt='Rituel beauté luxe Elite'
                className='h-full w-full object-cover'
                loading='lazy'
              />
            </div>
            <div className='absolute bottom-5 right-5'>
              <span className='bg-white/90 px-4 py-2 text-[9px] uppercase tracking-[0.25em] text-[#4a4a4a] backdrop-blur-sm'>
                Le rituel Elite
              </span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default RitualExperienceSection
