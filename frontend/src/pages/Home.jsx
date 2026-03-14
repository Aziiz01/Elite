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

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Elite | Women's Fashion & Makeup</title>
        <meta name="description" content="Elite is Tunisia's premier destination for women's fashion and makeup. Discover curated collections of elegant clothing, cosmetics, and beauty products." />
      </Helmet>
      <Hero />
      <LatestCollection />
      <FeaturedCategories categoryNames={['Women', 'Men', 'Kids']} /> 
      <BestSeller />
      <CuratedCollection title1="DISCOVER" title2="WOMEN'S TOPWEAR" category="Yeux" subCategory="Eye Liner" limit={4} />
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
