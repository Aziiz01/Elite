import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import CheckoutAuthModal from '../components/CheckoutAuthModal';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              color: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  return (
    <div className='border-t pt-14'>

      <div className=' text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <p className="text-gray-600 text-lg mb-2">Your cart is empty</p>
            <p className="text-gray-500 text-sm mb-6">Add some items to get started.</p>
            <Link
              to="/collection"
              className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Browse collection
            </Link>
          </div>
        ) : (
          cartData.map((item, index) => {

            const productData = products.find((product) => product._id === item._id);
            if (!productData) return null;

            const colorHex = /^#[0-9A-Fa-f]{6}$/.test(item.color) ? item.color : '#9ca3af';

            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className=' flex items-start gap-6'>
                  <img className='w-16 sm:w-20 object-cover' src={productData.image?.[0]} alt={productData.name} />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      {productData.newPrice != null && productData.newPrice !== '' ? (
                        <span>
                          <span className='line-through text-gray-500'>{currency}{productData.price}</span>
                          <span className='ml-1 font-medium text-green-600'>{currency}{productData.newPrice}</span>
                        </span>
                      ) : (
                        <p>{currency}{productData.price}</p>
                      )}
                      <span
                        className='w-6 h-6 rounded-full border border-gray-300 flex-shrink-0 inline-block'
                        style={{ backgroundColor: colorHex }}
                        title={item.color}
                      />
                    </div>
                  </div>
                </div>
                <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.color, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
                <img onClick={() => updateQuantity(item._id, item.color, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="Remove" />
              </div>
            )
          })
        )}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className=' w-full text-end'>
            <button
              onClick={() => {
                if (token || localStorage.getItem('token')) {
                  navigate('/place-order')
                } else {
                  setShowCheckoutModal(true)
                }
              }}
              disabled={cartData.length === 0}
              className='bg-black text-white text-sm my-8 px-8 py-3 disabled:bg-gray-300 disabled:cursor-not-allowed'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
          <CheckoutAuthModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} />
        </div>
      </div>

    </div>
  )
}

export default Cart
