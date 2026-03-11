import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { CATEGORIES } from '../constants/productOptions'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [searchName, setSearchName] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterInStock, setFilterInStock] = useState('')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse())
      } else {
        toast.error(response.data.message || 'Could not load products')
      }
    } catch (error) {
      toast.error(error.message || 'Could not load products')
    }
  }

  const removeProduct = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (!confirmed) return
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success('Product deleted')
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      if (searchName.trim()) {
        const q = searchName.trim().toLowerCase()
        if (!(item.name || '').toLowerCase().includes(q)) return false
      }
      if (filterCategory && item.category !== filterCategory) return false
      if (filterInStock && item.inStock === false) return false
      const price = item.newPrice ?? item.price
      const min = filterPriceMin ? Number(filterPriceMin) : null
      const max = filterPriceMax ? Number(filterPriceMax) : null
      if (min != null && !isNaN(min) && (price == null || price < min)) return false
      if (max != null && !isNaN(max) && (price == null || price > max)) return false
      return true
    })
  }, [list, searchName, filterCategory, filterInStock, filterPriceMin, filterPriceMax])

  const hasActiveFilters = searchName || filterCategory || filterInStock || filterPriceMin || filterPriceMax

  const clearFilters = () => {
    setSearchName('')
    setFilterCategory('')
    setFilterInStock('')
    setFilterPriceMin('')
    setFilterPriceMax('')
    setShowFilters(false)
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Products</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Find a product by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setFilterCategory('')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !filterCategory
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilterCategory(c)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterCategory === c
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* More filters (collapsible) */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          {showFilters ? '▲ Hide filters' : '▼ More filters'}
        </button>
        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg flex flex-wrap gap-4 items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!filterInStock}
                onChange={(e) => setFilterInStock(e.target.checked ? 'yes' : '')}
              />
              <span>In stock only</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Price:</span>
              <input
                type="number"
                placeholder="Min"
                value={filterPriceMin}
                onChange={(e) => setFilterPriceMin(e.target.value)}
                min="0"
                step="0.01"
                className="w-24 px-3 py-2 border border-gray-300 rounded"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filterPriceMax}
                onChange={(e) => setFilterPriceMax(e.target.value)}
                min="0"
                step="0.01"
                className="w-24 px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Result count */}
      <p className="text-gray-600 mb-4">
        {filteredList.length} product{filteredList.length !== 1 ? 's' : ''}
        {hasActiveFilters && ` (filtered from ${list.length})`}
      </p>

      {/* Product cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredList.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-gray-100">
              <img
                src={item.image?.[0]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="font-semibold text-gray-800 truncate" title={item.name}>
                {item.name}
              </p>
              <p className="text-sm text-gray-500">{item.category} {item.subCategory ? `· ${item.subCategory}` : ''}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-medium text-gray-800">
                  {item.newPrice != null && item.newPrice !== '' ? (
                    <>
                      <span className="text-gray-400 line-through">{currency}{item.price}</span>
                      <span className="ml-1 text-green-600">{currency}{item.newPrice}</span>
                    </>
                  ) : (
                    <span>{currency}{item.price}</span>
                  )}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    item.inStock !== false
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.inStock !== false ? 'In stock' : 'Out'}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/edit/${item._id}`}
                  className="flex-1 py-2 text-center rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => removeProduct(item._id)}
                  className="flex-1 py-2 rounded bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          {hasActiveFilters ? 'No products match your filters. Try changing them.' : 'No products yet. Add your first product!'}
        </p>
      )}
    </div>
  )
}

export default List
