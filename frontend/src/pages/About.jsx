import React from 'react'
import { Helmet } from 'react-helmet-async'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import TestimonialsSection from '../components/luxury/TestimonialsSection'

const About = () => {
  return (
    <div className='border-t border-[#efe4db]'>
      <Helmet>
        <title>A propos d'Elite | Maison de beaute de luxe</title>
        <meta
          name='description'
          content="Decouvrez Elite, une maison de beaute soigneusement selectionnee qui allie luxe, minimalisme et confiance moderne."
        />
      </Helmet>

      <section className='pt-10 sm:pt-14'>
        <div className='rounded-[2rem] border border-[#e9ddd3] bg-[#f7efe8] p-7 sm:p-10 md:p-14'>
          <p className='luxury-eyebrow'>A propos d'Elite</p>
          <h1 className='luxury-heading mt-3 max-w-3xl'>Une maison beaute moderne construite autour de la confiance et de l'elegance.</h1>
          <p className='mt-5 max-w-3xl text-sm sm:text-base text-[#5f4d41] leading-relaxed'>
            Nous selectionnons des essentiels beaute premium pour les femmes qui recherchent esthetique raffinee,
            performance et rituels simples au quotidien.
          </p>
        </div>
      </section>

      <section className='py-16 sm:py-20 md:py-24'>
        <div className='grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center'>
          <div className='overflow-hidden rounded-3xl border border-[#ecdfd6] bg-[#f6eee8]'>
            <img src={assets.about_img} alt='Identite beaute luxe Elite' className='h-full w-full object-cover' />
          </div>
          <div>
            <p className='luxury-eyebrow'>Notre histoire</p>
            <h2 className='luxury-heading mt-3'>Quand la beaute editoriale rencontre le quotidien.</h2>
            <p className='mt-5 text-[#5f4d41] text-sm sm:text-base leading-relaxed'>
              Nee en Tunisie, Elite associe elegance locale et culture beaute contemporaine. Chaque collection est
              choisie pour aider les femmes a exprimer leur style avec precision et douceur.
            </p>
            <p className='mt-4 text-[#5f4d41] text-sm sm:text-base leading-relaxed'>
              Des essentiels teint aux couleurs signature, notre mission est simple: proposer des produits authentiques
              dont l'experience est luxueuse et le rendu intemporel.
            </p>
          </div>
        </div>
      </section>

      <section className='pb-16 sm:pb-20 md:pb-24'>
        <p className='luxury-eyebrow mb-3'>Pourquoi choisir Elite</p>
        <h2 className='luxury-heading mb-8'>Le luxe dans chaque detail.</h2>
        <div className='grid gap-4 md:grid-cols-3'>
          <article className='rounded-3xl border border-[#ecdfd6] bg-[#fdfaf7] p-6'>
            <h3 className='font-display text-2xl text-[#2f2219]'>Qualite authentique</h3>
            <p className='mt-3 text-sm text-[#5f4d41]'>
              Chaque produit est verifie et choisi pour son rendu fiable, son fini et son confort sur la peau.
            </p>
          </article>
          <article className='rounded-3xl border border-[#ecdfd6] bg-[#fdfaf7] p-6'>
            <h3 className='font-display text-2xl text-[#2f2219]'>Service national</h3>
            <p className='mt-3 text-sm text-[#5f4d41]'>
              Livraison rapide et securisee partout en Tunisie, avec un emballage soigne pour les produits premium.
            </p>
          </article>
          <article className='rounded-3xl border border-[#ecdfd6] bg-[#fdfaf7] p-6'>
            <h3 className='font-display text-2xl text-[#2f2219]'>Accompagnement personnalise</h3>
            <p className='mt-3 text-sm text-[#5f4d41]'>
              Notre equipe vous guide sur les teintes, l'utilisation et la selection adaptee a votre rituel beaute.
            </p>
          </article>
        </div>
      </section>

      <TestimonialsSection />

      <NewsletterBox />
    </div>
  )
}

export default About
