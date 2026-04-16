import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext)
  const subtotal = getCartAmount()
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee

  return (
    <div className='flex flex-col gap-3 text-[13px]'>
      <div className='flex justify-between text-[#555]'>
        <span>Sous-total</span>
        <span>{subtotal.toFixed(2)}{currency}</span>
      </div>
      <div className='flex justify-between text-[#555]'>
        <span>Livraison</span>
        <span>{subtotal === 0 ? '—' : `${delivery_fee.toFixed(2)}${currency}`}</span>
      </div>
      <div className='border-t border-[#e5e5e5] pt-3 flex justify-between font-semibold text-[#111]'>
        <span>Total</span>
        <span>{total.toFixed(2)}{currency}</span>
      </div>
    </div>
  )
}

export default CartTotal
