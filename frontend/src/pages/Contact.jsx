import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="Contact Elite" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className=' text-gray-500'>Avenue Habib Bourguiba, 1000 Tunis<br />Tunis, Tunisia</p>
          <p className=' text-gray-500'>Tel: +216 71 234 567<br />Email: contact@elite.tn</p>
          <p className='text-gray-500'>WhatsApp: +216 98 765 432</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Elite</p>
          <p className=' text-gray-500'>Join our team and help us bring fashion and beauty to women across Tunisia.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact
