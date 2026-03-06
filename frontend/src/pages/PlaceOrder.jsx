import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { placeOrder as placeOrderApi, placeGuestOrder, createStripeOrder, createRazorpayOrder, verifyRazorpayPayment, getUserProfile } from '../api/client'
import { toast } from 'react-toastify'

const generateGuestId = () => 'guest-' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`)

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone']

const PlaceOrder = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const isGuest = location.state?.isGuest === true
    const guestUserId = useMemo(() => generateGuestId(), [isGuest])

    const [method, setMethod] = useState('cod');
    const [profileLoaded, setProfileLoaded] = useState(false);
    const { token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    useEffect(() => {
        if (!isGuest && !token && !localStorage.getItem('token')) {
            navigate('/cart')
        }
    }, [isGuest, token, navigate])

    useEffect(() => {
        if (isGuest) setMethod('cod')
    }, [isGuest])

    useEffect(() => {
        if (!isGuest && (token || localStorage.getItem('token')) && !profileLoaded) {
            const authToken = token || localStorage.getItem('token')
            getUserProfile(authToken)
                .then((res) => {
                    if (res.data.success && res.data.user) {
                        const u = res.data.user
                        setFormData({
                            firstName: u.firstName || '',
                            lastName: u.lastName || '',
                            email: u.email || '',
                            street: u.address || '',
                            city: u.city || '',
                            state: '',
                            zipcode: u.postalCode || '',
                            country: '',
                            phone: u.telephone || ''
                        })
                    }
                    setProfileLoaded(true)
                })
                .catch(() => setProfileLoaded(true))
        } else if (isGuest) {
            setProfileLoaded(true)
        }
    }, [isGuest, token, profileLoaded])

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name:'Order Payment',
            description:'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const authToken = token || localStorage.getItem('token')
                    const { data } = await verifyRazorpayPayment(response, authToken)
                    if (data.success) {
                        navigate('/orders')
                        setCartItems({})
                    } else {
                        toast.error(data.message || 'Payment verification failed')
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error?.response?.data?.message || error.message)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const validateForm = () => {
        for (const field of REQUIRED_FIELDS) {
            const val = formData[field]
            if (val == null || String(val).trim() === '') {
                toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()}`)
                return false
            }
        }
        return true
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {

            if (!validateForm()) return

            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.color = item
                            itemInfo.quantity = cartItems[items][item]
                            itemInfo.displayPrice = (itemInfo.newPrice != null && itemInfo.newPrice !== '') ? itemInfo.newPrice : itemInfo.price
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            if (orderItems.length === 0) {
                toast.error('Your cart is empty')
                return
            }

            const amount = getCartAmount() + delivery_fee
            const orderPayload = {
                address: formData,
                items: orderItems,
                amount,
                paymentMethod: method === 'cod' ? 'COD' : method === 'stripe' ? 'Stripe' : 'Razorpay'
            }

            if (isGuest) {
                if (method !== 'cod') {
                    toast.error('Guest checkout supports Cash on Delivery only. Please login for online payment.')
                    return
                }
                const guestOrderData = {
                    ...orderPayload,
                    userId: guestUserId
                }
                const response = await placeGuestOrder(guestOrderData)
                if (response.data.success) {
                    setCartItems({})
                    toast.success('Order placed successfully')
                    navigate('/')
                } else {
                    toast.error(response.data.message || 'Failed to place order')
                }
                return
            }

            const authToken = token || localStorage.getItem('token')
            if (!authToken) {
                toast.error('Please login to place order')
                navigate('/login', { state: { redirect: '/place-order' } })
                return
            }

            switch (method) {
                case 'cod':
                    const response = await placeOrderApi(orderPayload, authToken)
                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;

                case 'stripe':
                    const responseStripe = await createStripeOrder(orderPayload, authToken)
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data
                        window.location.replace(session_url)
                    } else {
                        toast.error(responseStripe.data.message)
                    }
                    break;

                case 'razorpay':
                    const responseRazorpay = await createRazorpayOrder(orderPayload, authToken)
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order)
                    } else {
                        toast.error(responseRazorpay.data.message)
                    }
                    break;

                default:
                    break;
            }


        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* ------------- Left Side ---------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                {isGuest && (
                    <p className='text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded'>
                        Checking out as guest. Please fill in all required information.
                    </p>
                )}
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
            </div>

            {/* ------------- Right Side ------------------ */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    {isGuest && (
                        <p className='text-sm text-gray-500 mb-3'>Guest checkout supports Cash on Delivery only.</p>
                    )}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        {!isGuest && (
                          <>
                            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                                <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                            </div>
                            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                                <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                            </div>
                          </>
                        )}
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
