import React from 'react'
import { pexelsImages } from '../../constants/images'
import RevealOnScroll from './RevealOnScroll'

const testimonials = [
  {
    quote: 'La texture est incroyable. On dirait un soin avec une couleur couture.',
    author: 'Nour A.',
    role: 'Creatrice beaute',
    image: pexelsImages.womanLipstick,
  },
  {
    quote: 'Enfin un maquillage qui parait luxueux et reste facile a porter tous les jours.',
    author: 'Salma K.',
    role: 'Cliente fidele',
    image: pexelsImages.womanPinkEyeshadow,
  },
  {
    quote: 'Des teintes elegantes, un fini propre et un packaging que je laisse toujours visible.',
    author: 'Meriem B.',
    role: 'Maquilleuse',
    image: pexelsImages.cosmeticProducts,
  },
]

const TestimonialsSection = () => {
  return (
    <section className='pt-20 sm:pt-24 md:pt-28'>
      <RevealOnScroll>
        <p className='luxury-eyebrow'>Preuve sociale</p>
        <h2 className='luxury-heading mt-3 max-w-3xl'>Choisi par des femmes qui connaissent la beaute dans le detail.</h2>
      </RevealOnScroll>

      <div className='mt-10 grid gap-4 lg:grid-cols-3'>
        {testimonials.map((item, index) => (
          <RevealOnScroll key={item.author} delay={index * 90}>
            <article className='h-full rounded-3xl border border-[#ebe0d7] bg-[#fdfaf7] p-6 sm:p-7'>
              <p className='text-lg leading-relaxed text-[#2d231c]'>"{item.quote}"</p>
              <div className='mt-8 flex items-center gap-3'>
                <img src={item.image} alt={item.author} className='h-12 w-12 rounded-full object-cover' loading='lazy' />
                <div>
                  <p className='text-sm font-semibold text-[#2d231c]'>{item.author}</p>
                  <p className='text-xs uppercase tracking-[0.14em] text-[#8e7767]'>{item.role}</p>
                </div>
              </div>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection
