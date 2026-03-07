import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [expandedDesc, setExpandedDesc] = useState({})
  const [searchName, setSearchName] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterSubCategory, setFilterSubCategory] = useState('')
  const [filterInStock, setFilterInStock] = useState('')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')

  const toggleDesc = (id) => {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const DescCell = ({ text, id }) => {
    const isLong = text && text.length > 80
    const isExpanded = expandedDesc[id]
    const displayText = isLong && !isExpanded ? text.slice(0, 80) + '...' : text

    return (
      <div className="min-w-0 max-w-[200px]">
        <div className={`text-sm overflow-y-auto ${isLong && !isExpanded ? 'max-h-[3rem]' : ''}`} style={{ maxHeight: isLong && !isExpanded ? '3rem' : 'none' }}>
          {displayText || '—'}
        </div>
        {isLong && (
          <button type="button" onClick={() => toggleDesc(id)} className="text-xs text-gray-500 hover:text-gray-700 mt-0.5">
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    )
  }

  const { filterCategories, filterSubcategories } = useMemo(() => {
    const cats = [...new Set(list.map(p => p.category).filter(Boolean))].sort()
    const subs = [...new Set(list.map(p => p.subCategory).filter(Boolean))].sort()
    return { filterCategories: cats, filterSubcategories: subs }
  }, [list])

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      if (searchName.trim()) {
        const q = searchName.trim().toLowerCase()
        if (!(item.name || '').toLowerCase().includes(q)) return false
      }
      if (filterCategory && item.category !== filterCategory) return false
      if (filterSubCategory && item.subCategory !== filterSubCategory) return false
      if (filterInStock === 'yes' && item.inStock === false) return false
      if (filterInStock === 'no' && item.inStock !== false) return false
      const price = item.newPrice ?? item.price
      const min = filterPriceMin ? Number(filterPriceMin) : null
      const max = filterPriceMax ? Number(filterPriceMax) : null
      if (min != null && !isNaN(min) && (price == null || price < min)) return false
      if (max != null && !isNaN(max) && (price == null || price > max)) return false
      return true
    })
  }, [list, searchName, filterCategory, filterSubCategory, filterInStock, filterPriceMin, filterPriceMax])

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>

      <div className='flex flex-col sm:flex-row flex-wrap gap-3 mb-4 items-center'>
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full sm:max-w-[200px]"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full sm:w-auto"
        >
          <option value="">All categories</option>
          {filterCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterSubCategory}
          onChange={(e) => setFilterSubCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full sm:w-auto"
        >
          <option value="">All subcategories</option>
          {filterSubcategories.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterInStock}
          onChange={(e) => setFilterInStock(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full sm:w-auto"
        >
          <option value="">All stock status</option>
          <option value="yes">In stock</option>
          <option value="no">Out of stock</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min price"
            value={filterPriceMin}
            onChange={(e) => setFilterPriceMin(e.target.value)}
            min="0"
            step="0.01"
            className="px-3 py-2 border border-gray-300 rounded w-24"
          />
          <span className="text-gray-500">—</span>
          <input
            type="number"
            placeholder="Max price"
            value={filterPriceMax}
            onChange={(e) => setFilterPriceMax(e.target.value)}
            min="0"
            step="0.01"
            className="px-3 py-2 border border-gray-300 rounded w-24"
          />
        </div>
        {(searchName || filterCategory || filterSubCategory || filterInStock || filterPriceMin || filterPriceMax) && (
          <button
            type="button"
            onClick={() => {
              setSearchName('')
              setFilterCategory('')
              setFilterSubCategory('')
              setFilterInStock('')
              setFilterPriceMin('')
              setFilterPriceMax('')
            }}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {(searchName || filterCategory || filterSubCategory || filterInStock || filterPriceMin || filterPriceMax) && (
        <p className='text-sm text-gray-600 mb-2'>
          Showing {filteredList.length} of {list.length} products
        </p>
      )}

      <div className='flex flex-col gap-2 overflow-x-auto'>

        {/* ------- List Table Title ---------- */}
        <div className='grid grid-cols-[60px_1fr_140px_100px_120px_100px_80px_100px] items-center py-1 px-2 border bg-gray-100 text-sm gap-2 min-w-[700px]'>
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Sub Category</b>
          <b>Colors</b>
          <b>Price</b>
          <b>Stock</b>
          <b className='text-center'>Actions</b>
        </div>

        {/* ------ Product List ------ */}
        {filteredList.map((item) => (
          <div
            className='grid grid-cols-[60px_1fr_140px_100px_120px_100px_80px_100px] items-center gap-2 py-3 px-2 border text-sm min-w-[700px]'
            key={item._id}
          >
            <img className='w-12 h-12 object-cover' src={item.image?.[0]} alt="" />
            <p className='font-medium'>{item.name}</p>
            <DescCell text={item.description} id={item._id} />
            <p>{item.category || '—'}</p>
            <p>{item.subCategory || '—'}</p>
            <div className='flex flex-wrap gap-1.5 items-center'>
              {(item.colors || []).length > 0
                ? item.colors.map((c, i) => (
                    <span
                      key={i}
                      className='w-[18px] h-[18px] rounded-full border border-gray-300 flex-shrink-0'
                      style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(c) ? c : '#9ca3af' }}
                      title={c}
                    />
                  ))
                : '—'}
            </div>
            <div>
              {item.newPrice != null && item.newPrice !== '' ? (
                <span>
                  <span className='line-through text-gray-500'>{currency}{item.price}</span>
                  <span className='ml-1 font-medium text-green-600'>{currency}{item.newPrice}</span>
                </span>
              ) : (
                <span>{currency}{item.price}</span>
              )}
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.inStock !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {item.inStock !== false ? 'In Stock' : 'Out'}
            </span>
            <div className='flex gap-2'>
              <Link to={`/edit/${item._id}`} className='px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs'>Edit</Link>
              <button type="button" onClick={() => window.confirm(`Are you sure you want to delete "${item.name}"?`) && removeProduct(item._id)} className='px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs'>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default List
