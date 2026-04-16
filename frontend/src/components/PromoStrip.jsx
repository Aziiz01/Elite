import { Link } from 'react-router-dom'

const PromoStrip = () => {
  return (
    <div className='border-b border-[#E5E5E5] bg-white py-2'>
      <div className='mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10'>
        {/* Left: shipping info */}
        <span className='hidden text-[11px] text-[#57534E] sm:block'>
          Livraison <strong className='font-semibold text-[#1C1917]'>GRATUITE</strong> dès 50&nbsp;TND d&apos;achat&nbsp;!
        </span>

        {/* Center: nav links */}
        <div className='flex items-center gap-3 sm:gap-4'>
          <Link
            to='/collection?deal=1'
            className='text-[11px] font-semibold text-[#e02020] transition-colors hover:text-[#b01818]'
          >
            Soldes
          </Link>
          <span className='text-[#D6D3D1]'>|</span>
          <Link
            to='/collection'
            className='text-[11px] text-[#57534E] transition-colors hover:text-[#1C1917]'
          >
            Livraison &amp; paiement
          </Link>
          <span className='hidden text-[#D6D3D1] sm:block'>|</span>
          <Link
            to='/about'
            className='hidden text-[11px] text-[#57534E] transition-colors hover:text-[#1C1917] sm:block'
          >
            Qui sommes-nous
          </Link>
        </div>

        {/* Right: loyalty */}
        <Link
          to='/profile'
          className='hidden items-center gap-1.5 text-[11px] text-[#A16207] transition-colors hover:text-[#92400E] sm:flex'
        >
          <span aria-hidden='true'>★</span>
          <span>Élite Rewards</span>
        </Link>
      </div>
    </div>
  )
}

export default PromoStrip
