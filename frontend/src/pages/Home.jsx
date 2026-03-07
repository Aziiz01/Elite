import React from 'react'
import Hero from '../components/Hero'
import PromoBanner from '../components/PromoBanner'
import CategoryStrip from '../components/CategoryStrip'
import LatestCollection from '../components/LatestCollection'
import CuratedCollection from '../components/CuratedCollection'
import BestSeller from '../components/BestSeller'
import FeaturedImageSection from '../components/FeaturedImageSection'
import VideoSection from '../components/VideoSection'
import EditorialBlock from '../components/EditorialBlock'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <CategoryStrip /> 
      <BestSeller />
      <CuratedCollection title1="DISCOVER" title2="WOMEN'S TOPWEAR" category="Women" subCategory="Topwear" limit={4} />
      <PromoBanner />
      <FeaturedImageSection />
      <VideoSection />
      <EditorialBlock />
      <OurPolicy />
      <NewsletterBox />
    </div>
  )
}

export default Home
