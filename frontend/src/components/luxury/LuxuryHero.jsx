import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const LuxuryHero = () => {
  return (
    <section className='relative min-h-[100svh] overflow-hidden bg-[#1C1917]'>
      {/* Full-bleed video */}
      <div className='absolute inset-0'>
        <video
          className='h-full w-full object-cover opacity-60'
          src={assets.hero_video}
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Layered gradients — left darkens for text, bottom vignette */}
        <div className='absolute inset-0 bg-gradient-to-r from-[#1C1917]/90 via-[#1C1917]/50 to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-6 pb-20 pt-32 sm:px-10 md:px-14 lg:justify-center lg:pb-24 lg:pt-0'>
        <div className='max-w-2xl'>
          {/* Eyebrow */}
          <div
            className='hero-text-animate flex items-center gap-4'
            style={{ animationDelay: '0s' }}
          >
            <div className='h-px w-10 bg-[#A16207]' />
            <span className='text-[10px] uppercase tracking-[0.35em] text-[#A16207]'>
              Collection printemps 2025
            </span>
          </div>

          {/* Headline */}
          <h1
            className='hero-text-animate mt-7 font-display font-semibold leading-[0.88] text-[#FAFAF9]'
            style={{
              fontSize: 'clamp(3.2rem, 8.5vw, 8.5rem)',
              animationDelay: '0.2s',
            }}
          >
            La beauté
            <br />
            <em className='font-normal italic text-[#D6D3D1]'>commence</em>
            <br />
            ici.
          </h1>

          {/* Divider */}
          <div
            className='hero-line-animate mt-8'
            style={{ display: 'block', height: '1px', background: '#A16207' }}
          />

          {/* Subline */}
          <p
            className='hero-text-animate mt-6 max-w-md text-[0.9rem] leading-[1.75] text-[#A8A29E] sm:text-[0.95rem]'
            style={{ animationDelay: '0.45s' }}
          >
            Des formules qui s&apos;effacent sur la peau et révèlent ce que vous avez
            de plus beau. Rien de plus, rien de moins.
          </p>

          {/* CTAs */}
          <div
            className='hero-text-animate mt-8 flex flex-wrap items-center gap-4 sm:mt-10'
            style={{ animationDelay: '0.65s' }}
          >
            <Link to='/collection' className='luxury-btn-primary'>
              Explorer la collection
            </Link>
            <a href='#brand-story' className='luxury-btn-outline-dark'>
              Notre histoire
            </a>
          </div>

          {/* Trust strip */}
          <div
            className='hero-text-animate mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 sm:mt-16'
            style={{ animationDelay: '1s' }}
          >
            {['Formules clean', 'Peaux sensibles', 'Livraison Tunisie'].map(
              (item, i) => (
                <span key={item} className='flex items-center gap-2.5'>
                  {i > 0 && <span className='h-px w-4 bg-[#57534E]' />}
                  <span className='text-[9px] uppercase tracking-[0.3em] text-[#57534E]'>
                    {item}
                  </span>
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom caption */}
      <div className='absolute bottom-6 right-6 z-10 flex items-center gap-3'>
        <div className='h-px w-6 bg-white/20' />
        <span className='text-[8px] uppercase tracking-[0.35em] text-white/30'>
          Elite Beauté
        </span>
      </div>
    </section>
  )
}

export default LuxuryHero
