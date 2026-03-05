import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [expandedDesc, setExpandedDesc] = useState({})

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

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2 overflow-x-auto'>

        {/* ------- List Table Title ---------- */}
        <div className='grid grid-cols-[60px_1fr_140px_100px_120px_100px_80px_100px] items-center py-1 px-2 border bg-gray-100 text-sm gap-2 min-w-[700px]'>
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Colors</b>
          <b>Price</b>
          <b>Stock</b>
          <b className='text-center'>Actions</b>
        </div>

        {/* ------ Product List ------ */}
        {list.map((item) => (
          <div
            className='grid grid-cols-[60px_1fr_140px_100px_120px_100px_80px_100px] items-center gap-2 py-3 px-2 border text-sm min-w-[700px]'
            key={item._id}
          >
            <img className='w-12 h-12 object-cover' src={item.image?.[0]} alt="" />
            <p className='font-medium'>{item.name}</p>
            <DescCell text={item.description} id={item._id} />
            <p>{item.category || '—'}</p>
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
