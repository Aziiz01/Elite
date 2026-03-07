import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const CATEGORIES = [
  { name: 'Women', sub: ['Topwear', 'Bottomwear', 'Winterwear'] },
  { name: 'Men', sub: ['Topwear', 'Bottomwear', 'Winterwear'] },
  { name: 'Kids', sub: ['Topwear', 'Bottomwear'] },
]

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-10 sm:gap-14 my-10 mt-32 text-sm'>

        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="Elite" />
          <p className='w-full sm:max-w-xs text-gray-600'>
            Elite is Tunisia's premier destination for women's fashion and makeup. Discover curated collections that celebrate elegance and empower your unique style.
          </p>
        </div>

        <div>
          <p className='text-base font-medium text-gray-900 mb-4'>SHOP</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><Link to='/collection' className='hover:text-gray-900'>All collections</Link></li>
            {CATEGORIES.map((cat) => (
              <li key={cat.name}>
                <Link to={`/collection?category=${encodeURIComponent(cat.name)}`} className='hover:text-gray-900'>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className='text-base font-medium text-gray-900 mb-4'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><a href='tel:+21671234567' className='hover:text-gray-900'>+216 71 234 567</a></li>
            <li><a href='mailto:contact@elite.tn' className='hover:text-gray-900'>contact@elite.tn</a></li>
          </ul>
        </div>

      </div>

      <div>
        <hr className='border-gray-200' />
        <p className='py-6 text-sm text-center text-gray-500'>© 2024 Elite. All Rights Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
