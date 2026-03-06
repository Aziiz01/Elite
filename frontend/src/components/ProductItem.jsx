import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price, newPrice }) => {
  const { currency } = useContext(ShopContext)

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className='text-gray-700 cursor-pointer flex flex-col h-full'
      to={`/product/${id}`}
    >
      <div className='w-full aspect-square overflow-hidden bg-gray-50 flex-shrink-0'>
        <img
          className='w-full h-full object-contain hover:scale-110 transition ease-in-out duration-300'
          src={image?.[0]}
          alt={name}
        />
      </div>
      <div className='pt-3 pb-1 flex-1 min-h-0'>
        <p className='text-sm line-clamp-2'>{name}</p>
      </div>
      <div className='text-sm font-medium mt-auto'>
        {newPrice != null && newPrice !== '' ? (
          <span>
            <span className='line-through text-gray-500'>{currency}{price}</span>
            <span className='ml-1 text-green-600'>{currency}{newPrice}</span>
          </span>
        ) : (
          <span>{currency}{price}</span>
        )}
      </div>
    </Link>
  )
}

export default ProductItem
