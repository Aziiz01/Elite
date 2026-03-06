import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    addToCartApi,
    updateCartApi,
    getCart,
    getProducts,
    backendUrl,
} from '../api/client'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const navigate = useNavigate();


    const addToCart = async (itemId, color, quantity = 1) => {

        if (!color) {
            toast.error('Select a color');
            return;
        }

        const qty = Math.max(1, Number(quantity) || 1);
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][color]) {
                cartData[itemId][color] += qty;
            }
            else {
                cartData[itemId][color] = qty;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][color] = qty;
        }
        setCartItems(cartData);

        if (token) {
            try {
                await addToCartApi({ itemId, color, quantity: qty }, token)
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, color, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][color] = quantity;

        setCartItems(cartData)

        if (token) {
            try {
                await updateCartApi({ itemId, color, quantity }, token)
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            const itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;
            const displayPrice = (itemInfo.newPrice != null && itemInfo.newPrice !== '') ? itemInfo.newPrice : itemInfo.price;
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += displayPrice * cartItems[items][item];
                    }
                } catch (error) {}
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await getProducts()
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message || 'Failed to load products')
        }
    }

    const getUserCart = async (token) => {
        try {
            const response = await getCart(token)
            if (response.data.success) {
                setCartItems(response.data.cartData || {})
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;