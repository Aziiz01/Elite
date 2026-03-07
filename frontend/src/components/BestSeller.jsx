import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);

    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    },[products])

  return (
    <section className='my-10 sm:my-14'>
      <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6'>
        <div className='text-center sm:text-left'>
          <Title text1={'BEST'} text2={'SELLERS'} />
          <p className='w-full sm:w-3/4 text-xs sm:text-sm text-gray-500 mt-1'>
            Customer favorites and top picks.
          </p>
        </div>
        <Link to='/collection' className='text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2 text-center sm:text-right'>
          View all
        </Link>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
            bestSeller.map((item,index)=>(
                <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} newPrice={item.newPrice} />
            ))
        }
      </div>
    </section>
  )
}

export default BestSeller
