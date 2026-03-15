import React from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import PromoBanner from '../components/PromoBanner'
import FeaturedCategories from '../components/FeaturedCategories'
import LatestCollection from '../components/LatestCollection'
import CuratedCollection from '../components/CuratedCollection'
import BestSeller from '../components/BestSeller'
import FeaturedImageSection from '../components/FeaturedImageSection'
import VideoSection from '../components/VideoSection'
import EditorialBlock from '../components/EditorialBlock'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import Section from '../components/Section'

const Home = () => {
  return (
    <main className='home'>
      <Helmet>
        <title>Elite | Women's Fashion & Makeup</title>
        <meta name="description" content="Elite is Tunisia's premier destination for women's fashion and makeup. Discover curated collections of elegant clothing, cosmetics, and beauty products." />
      </Helmet>

      {/* 1. Hero – main banner / key promotion */}
      <Hero />
{/* 3. Featured / trending products */}
<Section id="new-arrivals" spacing="lg" width="normal">
        <LatestCollection />
      </Section>
      {/* 2. Featured categories */}
      <FeaturedCategories categoryNames={['Women', 'Men', 'Kids']} />

      
  {/* 6. Best sellers / recommended */}
  <Section id="best-sellers" spacing="lg" width="normal">
        <BestSeller />
      </Section>
      {/* 8. Brand story / video */}
      <VideoSection />
{/* 7. Curated / recommended products */}
<Section id="recommended" spacing="lg" width="normal">
        <CuratedCollection title1="RECOMMENDED" title2="FOR YOU" limit={4} />
      </Section>
      {/* 4. Promotional section */}
      <PromoBanner />

      {/* 5. Brand highlight */}
      <FeaturedImageSection />

    

      

      
      {/* 9. Editorial / trust content */}
      <EditorialBlock />

      {/* 10. Trust badges / policies */}
      <OurPolicy />

      {/* 11. Newsletter / footer transition */}
      <NewsletterBox />
    </main>
  )
}

export default Home
