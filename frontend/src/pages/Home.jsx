import React, { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { ShopContext } from '../context/ShopContext'
import LuxuryHero from '../components/luxury/LuxuryHero'
import FeaturedShowcase from '../components/luxury/FeaturedShowcase'
import BrandStorySection from '../components/luxury/BrandStorySection'
import CategoryHighlightSection from '../components/luxury/CategoryHighlightSection'
import TestimonialsSection from '../components/luxury/TestimonialsSection'
import RitualExperienceSection from '../components/luxury/RitualExperienceSection'
import InnerCircleNewsletter from '../components/luxury/InnerCircleNewsletter'

const Home = () => {
  const { products } = useContext(ShopContext)

  return (
    <main className='home'>
      <Helmet>
        <title>Elite | Maison de beaute de luxe</title>
        <meta
          name='description'
          content='Elite est une destination beaute premium en Tunisie. Decouvrez des collections maquillage soigneusement selectionnees, des campagnes editoriales et des rituels elegants.'
        />
      </Helmet>

      <LuxuryHero />

      <div className='mx-auto max-w-[1280px]'>
        <FeaturedShowcase products={products} />
        <BrandStorySection />
        <CategoryHighlightSection products={products} />
        <TestimonialsSection />
        <RitualExperienceSection />
        <InnerCircleNewsletter />
      </div>
    </main>
  )
}

export default Home
