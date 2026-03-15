import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const CuratedCollection = ({ title1 = 'OUR', title2 = 'FAVORITES', category, subCategory, limit = 4 }) => {
  const { products } = useContext(ShopContext)
  const [items, setItems] = useState([])

  useEffect(() => {
    let list = products.slice()
    if (category) list = list.filter((p) => p.category === category)
    if (subCategory) list = list.filter((p) => p.subCategory === subCategory)
    setItems(list.slice(0, limit))
  }, [products, category, subCategory, limit])

  const query = [category && `category=${encodeURIComponent(category)}`, subCategory && `subCategory=${encodeURIComponent(subCategory)}`].filter(Boolean).join('&')
  const viewAllTo = query ? `/collection?${query}` : '/collection'

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8'>
        <div>
          <Title text1={title1} text2={title2} />
          <p className='text-gray-500 text-sm mt-2 max-w-xl'>Handpicked for you</p>
        </div>
        <Link to={viewAllTo} className='text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2 whitespace-nowrap'>
          View all
        </Link>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6'>
        {items.map((item) => (
          <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} newPrice={item.newPrice} image={item.image} colors={item.colors} inStock={item.inStock} />
        ))}
      </div>
    </div>
  )
}

export default CuratedCollection
