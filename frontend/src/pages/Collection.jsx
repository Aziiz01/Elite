import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const [searchParams] = useSearchParams()
  const { products , search , showSearch } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relevant')

  const { filterCategories, filterSubcategories } = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))].sort()
    const subs = [...new Set(products.map(p => p.subCategory).filter(Boolean))].sort()
    return { filterCategories: cats, filterSubcategories: subs }
  }, [products])

  const [bestsellerOnly, setBestsellerOnly] = useState(false)

  useEffect(() => {
    const cat = searchParams.get('category')
    const sub = searchParams.get('subCategory')
    const best = searchParams.get('bestseller')
    if (cat) setCategory([cat])
    else setCategory([])
    if (sub) setSubCategory([sub])
    else setSubCategory([])
    setBestsellerOnly(best === '1' || best === 'true')
  }, [searchParams])

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }

  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => item.category && category.includes(item.category));
    }

    if (subCategory.length > 0 ) {
      productsCopy = productsCopy.filter(item => item.subCategory && subCategory.includes(item.subCategory))
    }

    if (bestsellerOnly) {
      productsCopy = productsCopy.filter(item => item.bestseller === true)
    }

    setFilterProducts(productsCopy)

  }

  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    const getDisplayPrice = (p) => (p.newPrice != null && p.newPrice !== '') ? p.newPrice : p.price;
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a)));
        break;

      default:
        applyFilter();
        break;
    }

  }

  useEffect(()=>{
      applyFilter();
  },[category,subCategory,search,showSearch,products,bestsellerOnly])

  useEffect(()=>{
    sortProduct();
  },[sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      <Helmet>
        <title>All Collections | Elite</title>
        <meta name="description" content="Browse our full collection of women's fashion and makeup. Filter by category, sort by price, and discover your next favorite piece." />
      </Helmet>
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" aria-hidden />
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {filterCategories.map((c) => (
              <p key={c} className='flex gap-2'>
                <input className='w-3' type="checkbox" value={c} onChange={toggleCategory} checked={category.includes(c)}/> {c}
              </p>
            ))}
            {filterCategories.length === 0 && <p className='text-gray-500'>No categories</p>}
          </div>
        </div>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {filterSubcategories.map((s) => (
              <p key={s} className='flex gap-2'>
                <input className='w-3' type="checkbox" value={s} onChange={toggleSubCategory} checked={subCategory.includes(s)}/> {s}
              </p>
            ))}
            {filterSubcategories.length === 0 && <p className='text-gray-500'>No subcategories</p>}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            {/* Porduct Sort */}
            <select onChange={(e)=>setSortType(e.target.value)} className='border border-gray-300 rounded text-sm px-3 py-1.5 focus:ring-2 focus:ring-gray-400 focus:border-transparent'>
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center">
              <p className="text-gray-600 text-lg mb-2">No products found</p>
              <p className="text-gray-500 text-sm mb-6">
                {category.length > 0 || subCategory.length > 0 || (showSearch && search) || bestsellerOnly
                  ? 'Try adjusting your filters or search.'
                  : 'There are no products in this collection yet.'}
              </p>
              {(category.length > 0 || subCategory.length > 0 || (showSearch && search) || bestsellerOnly) ? (
                <Link
                  to="/collection"
                  className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Clear filters
                </Link>
              ) : (
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Back to home
                </Link>
              )}
            </div>
          ) : (
            filterProducts.map((item, index) => (
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} newPrice={item.newPrice} image={item.image} colors={item.colors} inStock={item.inStock} />
            ))
          )}
        </div>
      </div>

    </div>
  )
}

export default Collection
