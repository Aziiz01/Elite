import { useContext, useMemo, Fragment } from 'react'
import { Helmet } from 'react-helmet-async'
import { ShopContext } from '../context/ShopContext'

/* ─── Commerce sections ─── */
import HeroSection from '../components/home/HeroSection'
import ProductCarousel from '../components/home/ProductCarousel'
import PromoBannersSection from '../components/home/PromoBannersSection'
import ReviewsSection from '../components/home/ReviewsSection'
import InnerCircleNewsletter from '../components/luxury/InnerCircleNewsletter'

const Home = () => {
  const { products } = useContext(ShopContext)

  /* Derive unique categories in order of product count (most stocked first) */
  const categories = useMemo(() => {
    const counts = new Map()
    const labels = new Map()
    for (const p of products) {
      const key = (p.category ?? '').trim().toLowerCase()
      if (!key) continue
      counts.set(key, (counts.get(key) ?? 0) + 1)
      if (!labels.has(key)) labels.set(key, p.category.trim())
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => labels.get(key))
  }, [products])

  return (
    <main className='home'>
      <Helmet>
        <title>Elite | Maison de beauté de luxe</title>
        <meta
          name='description'
          content='Elite est une destination beauté premium en Tunisie. Découvrez des collections maquillage soigneusement sélectionnées, des promotions et des nouveautés.'
        />
      </Helmet>

      {/* 1. Hero banner — promotional carousel */}
      <HeroSection />

      {/* 2–4. Carousels interleaved with promo banners every 2 carousels */}
      {[{ type: 'best' }, ...categories.map((cat) => ({ type: 'cat', cat }))].map((item, i) => (
        <Fragment key={item.type === 'cat' ? item.cat : 'best'}>
          {item.type === 'best' ? (
            <ProductCarousel
              title='Nos recommandations'
              subtitle='Sélection Elite'
              products={products}
              filterFn={(p) => p.bestseller}
              maxItems={14}
            />
          ) : (
            <ProductCarousel
              title={item.cat}
              subtitle='Collection'
              products={products}
              categoryFilter={item.cat}
              maxItems={14}
            />
          )}
          {(i + 1) % 2 === 0 && (
            <PromoBannersSection variant={Math.floor(i / 2)} />
          )}
        </Fragment>
      ))}

      {/* 5. Customer reviews */}
      <ReviewsSection />

      {/* 6. Newsletter CTA */}
      <div className='bleed-x'>
        <InnerCircleNewsletter />
      </div>
    </main>
  )
}

export default Home
