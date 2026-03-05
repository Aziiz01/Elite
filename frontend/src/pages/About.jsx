import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'ELITE'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="Elite - Tunisian women's fashion" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Elite was founded in Tunisia with a vision to celebrate the beauty and elegance of Tunisian women. We bring together the finest in women's fashion and makeup—from timeless local craftsmanship to international trends—creating a curated space where style meets sophistication.</p>
              <p>Our collections blend Mediterranean charm with contemporary design. From elegant abayas and modest wear to the latest in cosmetics and skincare, Elite offers an extensive selection carefully sourced from trusted brands and artisans across Tunisia and beyond.</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>At Elite, we empower women to express their individuality through fashion and beauty. We are committed to providing exceptional quality, genuine products, and a seamless shopping experience—whether you're in Tunis, Sfax, or anywhere in Tunisia.</p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE ELITE'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Authentic Quality:</b>
            <p className=' text-gray-600'>Every product is handpicked and verified for authenticity. We partner with reputable brands to bring you genuine fashion and makeup.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Nationwide Delivery:</b>
            <p className=' text-gray-600'>We deliver across Tunisia with care. From Tunis to the coast and beyond, your order arrives safely and on time.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Dedicated Support:</b>
            <p className=' text-gray-600'>Our team is here to help you find the perfect look. Questions about sizing, shades, or styling? We're just a message away.</p>
          </div>
      </div>

      <NewsletterBox/>
      
    </div>
  )
}

export default About
