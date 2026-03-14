import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const CATEGORIES = [
  { name: 'Women', sub: ['Topwear', 'Bottomwear', 'Winterwear'] },
  { name: 'Men', sub: ['Topwear', 'Bottomwear', 'Winterwear'] },
  { name: 'Kids', sub: ['Topwear', 'Bottomwear'] },
]

const SOCIAL_LINKS = [
  { name: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { name: 'Instagram', href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  { name: 'Pinterest', href: '#', icon: 'M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.712-1.378l-.737 2.789c-.266.983-1.032 4.312-1.414 5.858-.163.631-.772 2.422-1.649 4.721C17.363 23.506 18.684 24 20 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z' },
]

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 sm:gap-14 my-10 mt-32 text-sm'>

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
            <li><Link to='/collection' className='hover:text-gray-900'>New arrivals</Link></li>
            <li><Link to='/collection' className='hover:text-gray-900'>Best sellers</Link></li>
            {CATEGORIES.map((cat) => (
              <li key={cat.name}>
                <Link to={`/collection?category=${encodeURIComponent(cat.name)}`} className='hover:text-gray-900'>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className='text-base font-medium text-gray-900 mb-4'>OUR COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><Link to='/about' className='hover:text-gray-900'>About us</Link></li>
            <li><Link to='/contact' className='hover:text-gray-900'>Contact us</Link></li>
            <li><Link to='/about' className='hover:text-gray-900'>Delivery</Link></li>
            <li><Link to='/about' className='hover:text-gray-900'>Returns & exchanges</Link></li>
          </ul>
        </div>

        <div>
          <p className='text-base font-medium text-gray-900 mb-4'>YOUR ACCOUNT</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><Link to='/profile' className='hover:text-gray-900'>My profile</Link></li>
            <li><Link to='/profile?section=orders' className='hover:text-gray-900'>Orders</Link></li>
            <li><Link to='/order-status' className='hover:text-gray-900'>Track order</Link></li>
            <li><Link to='/profile?section=favorites' className='hover:text-gray-900'>Favorites</Link></li>
            <li><a href='tel:+21671234567' className='hover:text-gray-900'>+216 71 234 567</a></li>
            <li><a href='mailto:contact@elite.tn' className='hover:text-gray-900'>contact@elite.tn</a></li>
          </ul>
        </div>

      </div>

      <div>
        <hr className='border-gray-200' />
        <div className='py-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex gap-5'>
            {SOCIAL_LINKS.map((s) => (
              <a key={s.name} href={s.href} target='_blank' rel='noopener noreferrer' className='text-gray-500 hover:text-gray-900 transition-colors' aria-label={s.name}>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'><path d={s.icon} /></svg>
              </a>
            ))}
          </div>
          <p className='text-sm text-gray-500'>© 2024 Elite. All Rights Reserved.</p>
        </div>
      </div>

    </div>
  )
}

export default Footer
