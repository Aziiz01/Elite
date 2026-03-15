import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
        setLatestProducts(products.slice(0,8));
    },[products])

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8'>
        <div>
          <Title text1='LATEST' text2='COLLECTIONS' />
          <p className='text-gray-500 text-sm mt-2 max-w-xl'>
            New arrivals and fresh styles for the season.
          </p>
        </div>
        <Link to='/collection' className='text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2 whitespace-nowrap'>
          View all
        </Link>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6'>
        {latestProducts.map((item) => (
          <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} newPrice={item.newPrice} colors={item.colors} inStock={item.inStock} />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection
