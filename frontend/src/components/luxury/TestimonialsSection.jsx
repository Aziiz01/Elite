import { pexelsImages } from '../../constants/images'
import RevealOnScroll from './RevealOnScroll'

const testimonials = [
  {
    quote: 'La texture est incroyable. On dirait un soin avec une couleur couture.',
    author: 'Nour A.',
    role: 'Créatrice beauté',
    image: pexelsImages.womanLipstick,
  },
  {
    quote: 'Enfin un maquillage qui paraît luxueux et reste facile à porter tous les jours.',
    author: 'Salma K.',
    role: 'Cliente fidèle',
    image: pexelsImages.womanPinkEyeshadow,
  },
  {
    quote: 'Des teintes élégantes, un fini propre et un packaging que je laisse toujours visible.',
    author: 'Meriem B.',
    role: 'Maquilleuse professionnelle',
    image: pexelsImages.cosmeticProducts,
  },
]

const TestimonialsSection = () => {
  return (
    <section className='border-t border-[#D6D3D1] bg-white py-20 sm:py-24 md:py-28'>
      <div className='mx-auto max-w-[1280px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <RevealOnScroll>
          <div className='mb-10 max-w-lg sm:mb-14'>
            <span className='luxury-eyebrow'>Témoignages</span>
            <h2
              className='mt-4 font-display leading-[0.92] text-[#1C1917]'
              style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.8rem)' }}
            >
              Elles en parlent
              <br />
              <em className='font-normal italic text-[#A8A29E]'>mieux que nous.</em>
            </h2>
          </div>
        </RevealOnScroll>

        <div className='grid gap-3 sm:gap-4 md:grid-cols-3'>
          {testimonials.map((item, i) => (
            <RevealOnScroll key={item.author} delay={i * 100}>
              <article
                className={`group relative flex h-full flex-col p-6 sm:p-8 ${
                  i === 1
                    ? 'bg-[#1C1917] text-white'
                    : 'border border-[#D6D3D1] bg-[#FAFAF9]'
                }`}
              >
                {/* Quote mark */}
                <span
                  className={`pointer-events-none select-none font-display text-[6rem] leading-none sm:text-[7rem] ${
                    i === 1 ? 'text-[#A16207]/20' : 'text-[#D6D3D1]'
                  }`}
                  aria-hidden='true'
                >
                  &ldquo;
                </span>

                {/* Quote */}
                <p
                  className={`-mt-8 flex-1 font-display text-[1.05rem] leading-[1.55] sm:-mt-10 sm:text-[1.15rem] ${
                    i === 1 ? 'text-[#D6D3D1]' : 'text-[#1C1917]'
                  }`}
                >
                  {item.quote}
                </p>

                {/* Author */}
                <div className='mt-8 flex items-center gap-3 sm:mt-10 sm:gap-4'>
                  <img
                    src={item.image}
                    alt={item.author}
                    className='h-10 w-10 object-cover sm:h-11 sm:w-11'
                    loading='lazy'
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        i === 1 ? 'text-[#FAFAF9]' : 'text-[#1C1917]'
                      }`}
                    >
                      {item.author}
                    </p>
                    <p
                      className={`text-[10px] uppercase tracking-[0.22em] ${
                        i === 1 ? 'text-[#A16207]' : 'text-[#A8A29E]'
                      }`}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
