import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
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

  const validCartCount = cartData.filter((item) => {
    const p = products.find((pr) => pr._id === item._id);
    return p && p.inStock !== false;
  }).length;

  return (
    <div className='border-t pt-14'>
      <Helmet>
        <title>Your Cart | Elite</title>
        <meta name="description" content="Review your cart and proceed to checkout. Cash on delivery available across Tunisia." />
      </Helmet>

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
            const colorHex = /^#[0-9A-Fa-f]{6}$/.test(item.color) ? item.color : '#9ca3af';

            if (!productData) {
              return (
                <div key={`${item._id}-${item.color}-unavailable`} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-6'>
                    <div className='w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs'>—</div>
                    <div>
                      <p className='text-xs sm:text-lg font-medium text-gray-500'>Product no longer available</p>
                      <p className='text-xs text-gray-400 mt-1'>Item may have been removed from the store</p>
                    </div>
                  </div>
                  <span className='text-sm text-gray-400'>—</span>
                  <img onClick={() => updateQuantity(item._id, item.color, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer hover:opacity-70' src={assets.bin_icon} alt="Remove" title="Remove from cart" />
                </div>
              );
            }

            const isOutOfStock = productData.inStock === false

            return (
              <div key={`${item._id}-${item.color}`} className={`py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 ${isOutOfStock ? 'opacity-75' : ''}`}>
                <div className=' flex items-start gap-6'>
                  <img className='w-16 sm:w-20 object-cover' src={productData.image?.[0]} alt={productData.name} />
                  <div>
                    <p className='text-xs sm:text-lg font-medium flex items-center gap-2 flex-wrap'>
                      {productData.name}
                      {isOutOfStock && (
                        <span className='text-red-600 text-xs font-medium'>Out of stock</span>
                      )}
                    </p>
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
                <input
                  value={item.quantity}
                  onChange={(e) => {
                    if (isOutOfStock) return;
                    const v = e.target.value;
                    if (v === '') return;
                    const num = parseInt(v, 10);
                    if (!isNaN(num) && num >= 0) updateQuantity(item._id, item.color, num);
                  }}
                  disabled={isOutOfStock}
                  className='border border-gray-300 rounded max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                  type="number"
                  min={1}
                />
                <img onClick={() => updateQuantity(item._id, item.color, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer hover:opacity-70' src={assets.bin_icon} alt="Remove" title="Remove from cart" />
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
              disabled={validCartCount === 0}
              className='bg-black text-white text-sm my-8 px-8 py-3 rounded focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed'
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
