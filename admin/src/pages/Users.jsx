import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const ITEMS_PER_PAGE = 10

const Users = ({ token }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    address: '',
    telephone: '',
    postalCode: '',
    newPassword: ''
  })
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/user/list', { headers: { token } })
      if (response.data.success) {
        setUsers(response.data.users || [])
      } else {
        toast.error(response.data.message || 'Failed to load users')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openEdit = (user) => {
    setEditingUser(user)
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      city: user.city || '',
      address: user.address || '',
      telephone: user.telephone || '',
      postalCode: user.postalCode || '',
      newPassword: ''
    })
  }

  const closeEdit = () => {
    setEditingUser(null)
    setEditForm({ firstName: '', lastName: '', email: '', city: '', address: '', telephone: '', postalCode: '', newPassword: '' })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      setSaving(true)
      const payload = { ...editForm, id: editingUser._id }
      if (!payload.newPassword) delete payload.newPassword
      const response = await axios.post(backendUrl + '/api/user/update', payload, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        closeEdit()
        fetchUsers()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const removeUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.firstName} ${user.lastName}" (${user.email})? This cannot be undone.`
    )
    if (!confirmed) return
    try {
      const response = await axios.post(backendUrl + '/api/user/remove', { id: user._id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchUsers()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete user')
    }
  }

  const filteredAndSorted = useMemo(() => {
    let result = [...users]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (u) =>
          (u.firstName || '').toLowerCase().includes(q) ||
          (u.lastName || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q) ||
          (u.city || '').toLowerCase().includes(q) ||
          (u.address || '').toLowerCase().includes(q) ||
          (u.telephone || '').toLowerCase().includes(q) ||
          (u.postalCode || '').toLowerCase().includes(q)
      )
    }
    result.sort((a, b) => {
      let aVal = a[sortField] ?? ''
      let bVal = b[sortField] ?? ''
      if (sortField === 'name') {
        aVal = `${a.lastName || ''} ${a.firstName || ''}`.trim()
        bVal = `${b.lastName || ''} ${b.firstName || ''}`.trim()
      }
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' })
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [users, search, sortField, sortDir])

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE)
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAndSorted, currentPage])

  const handleSort = (field) => {
    setSortField(field)
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    setCurrentPage(1)
  }

  const SortHeader = ({ field, label }) => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-semibold hover:text-gray-800"
    >
      {label}
      <span className="text-xs">{sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
    </button>
  )

  const cartItemCount = (cart) => {
    if (!cart || typeof cart !== 'object') return 0
    return Object.values(cart).reduce((sum, q) => sum + (Number(q) || 0), 0)
  }

  if (loading) {
    return <p className="text-gray-600">Loading users...</p>
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Registered Users</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, city, address, phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="px-3 py-2 border border-gray-300 rounded w-full sm:max-w-md"
        />
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">
                <SortHeader field="name" label="Name" />
              </th>
              <th className="px-4 py-3">
                <SortHeader field="email" label="Email" />
              </th>
              <th className="px-4 py-3">
                <SortHeader field="city" label="City" />
              </th>
              <th className="px-4 py-3">
                <SortHeader field="address" label="Address" />
              </th>
              <th className="px-4 py-3">
                <SortHeader field="telephone" label="Telephone" />
              </th>
              <th className="px-4 py-3">
                <SortHeader field="postalCode" label="Postal Code" />
              </th>
              <th className="px-4 py-3">Cart</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  {search ? 'No users match your search.' : 'No users found.'}
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3">{user.email || '—'}</td>
                  <td className="px-4 py-3">{user.city || '—'}</td>
                  <td className="px-4 py-3 max-w-[180px] truncate" title={user.address}>
                    {user.address || '—'}
                  </td>
                  <td className="px-4 py-3">{user.telephone || '—'}</td>
                  <td className="px-4 py-3">{user.postalCode || '—'}</td>
                  <td className="px-4 py-3">
                    {cartItemCount(user.cartData) > 0 ? (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {cartItemCount(user.cartData)} items
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Empty</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeUser(user)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Showing {paginatedUsers.length} of {filteredAndSorted.length} users
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeEdit}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Edit User</h3>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                <input
                  type="text"
                  value={editForm.telephone}
                  onChange={(e) => setEditForm((f) => ({ ...f, telephone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                <input
                  type="text"
                  value={editForm.postalCode}
                  onChange={(e) => setEditForm((f) => ({ ...f, postalCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password (optional)</label>
                <input
                  type="password"
                  value={editForm.newPassword}
                  onChange={(e) => setEditForm((f) => ({ ...f, newPassword: e.target.value }))}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={closeEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
