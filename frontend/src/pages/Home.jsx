import React, { useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import HeroCarousel from '../components/HeroCarousel'
import CategoryCarousel from '../components/CategoryCarousel'
import OffersSection from '../components/OffersSection'
import { ShopContext } from '../context/ShopContext'

const Home = () => {
  const { products } = useContext(ShopContext)
  const sections = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return []

    const categoryCount = new Map()
    for (const product of products) {
      const key = String(product.category || '').trim()
      if (!key) continue
      categoryCount.set(key, (categoryCount.get(key) || 0) + 1)
    }

    return [...categoryCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => ({
        title: category,
        categoryName: category,
      }))
  }, [products])

  return (
    <main className='home'>
      <Helmet>
        <title>Elite | Mode femme & maquillage</title>
        <meta name="description" content="Elite est la destination incontournable en Tunisie pour la mode féminine et le maquillage. Découvrez des collections soigneusement sélectionnées." />
      </Helmet>

      <HeroCarousel />

      <div className='pt-5 sm:pt-6 pb-6 sm:pb-8'>
        {sections.map((section) => (
          <React.Fragment key={section.categoryName}>
            <CategoryCarousel
              title={section.title}
              products={products}
              categoryName={section.categoryName}
              maxItems={10}
            />
            <OffersSection products={products} categoryName={section.categoryName} />
          </React.Fragment>
        ))}
      </div>
    </main>
  )
}

export default Home
