import React from 'react'
import { Helmet } from 'react-helmet-async'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className='border-t border-[#efe4db]'>
      <Helmet>
        <title>Contact Elite | Service client</title>
        <meta
          name='description'
          content='Contactez le service client Elite pour vos commandes, conseils beaute ou partenariats.'
        />
      </Helmet>

      <section className='pt-10 sm:pt-14'>
        <div className='rounded-[2rem] border border-[#e9ddd3] bg-[#f7efe8] p-7 sm:p-10 md:p-14'>
          <p className='luxury-eyebrow'>Contact</p>
          <h1 className='luxury-heading mt-3 max-w-3xl'>Un service client adapte a votre routine beaute.</h1>
          <p className='mt-5 max-w-2xl text-sm sm:text-base text-[#5f4d41] leading-relaxed'>
            Que vous ayez besoin d'aide pour une commande, de conseils produits ou d'informations partenariat, notre equipe vous accompagne.
          </p>
        </div>
      </section>

      <section className='py-16 sm:py-20 md:py-24'>
        <div className='grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center'>
          <div className='overflow-hidden rounded-3xl border border-[#ecdfd6] bg-[#f6eee8]'>
            <img className='w-full h-full object-cover' src={assets.contact_img} alt='Contacter Elite' />
          </div>
          <div className='grid gap-4'>
            <article className='rounded-2xl border border-[#ecdfd6] bg-[#fdfaf7] p-6'>
              <p className='luxury-eyebrow mb-2'>Boutique</p>
              <p className='text-[#2f2219] font-medium'>Avenue Habib Bourguiba, 1000 Tunis</p>
              <p className='text-[#5f4d41] text-sm mt-2'>Tunis, Tunisie</p>
            </article>
            <article className='rounded-2xl border border-[#ecdfd6] bg-[#fdfaf7] p-6'>
              <p className='luxury-eyebrow mb-2'>Service client</p>
              <p className='text-[#2f2219] text-sm'>Tel: +216 71 234 567</p>
              <p className='text-[#2f2219] text-sm mt-1'>WhatsApp: +216 98 765 432</p>
              <p className='text-[#2f2219] text-sm mt-1'>Email: contact@elite.tn</p>
            </article>
            <article className='rounded-2xl border border-[#ecdfd6] bg-[#fdfaf7] p-6'>
              <p className='luxury-eyebrow mb-2'>Carrieres</p>
              <p className='text-[#5f4d41] text-sm'>Rejoignez notre equipe et participez au prochain chapitre de la beaute moderne en Tunisie.</p>
              <button className='luxury-btn-primary mt-4'>Voir les postes</button>
            </article>
          </div>
        </div>
      </section>

      <NewsletterBox />
    </div>
  )
}

export default Contact
