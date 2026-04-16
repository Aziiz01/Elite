import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (products.length > 0 && category) {
      let list = products.filter((p) => p.category === category)
      if (subCategory) list = list.filter((p) => p.subCategory === subCategory)
      setRelated(list.slice(0, 5))
    }
  }, [products, category, subCategory])

  if (related.length === 0) return null

  return (
    <section className='mt-20 pt-10 border-t border-[#e5e5e5]'>
      <div className='mb-8'>
        <p className='section-eyebrow mb-2'>Vous aimerez aussi</p>
        <h2 className='text-xl font-bold text-[#111]'>Produits similaires</h2>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8'>
        {related.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            price={item.price}
            newPrice={item.newPrice}
            image={item.image}
            colors={item.colors}
            inStock={item.inStock}
            date={item.date}
            isNew={item.isNew}
            subCategory={item.subCategory}
            category={item.category}
            rating={item.avgRating}
            reviewCount={item.reviewCount}
          />
        ))}
      </div>
    </section>
  )
}

export default RelatedProducts
