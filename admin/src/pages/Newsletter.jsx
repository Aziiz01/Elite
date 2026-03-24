import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Newsletter = ({ token }) => {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/newsletter/subscribers', {
        headers: { token }
      })
      setSubscribers(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Failed to load subscribers')
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!subject.trim()) {
      toast.error('Subject is required')
      return
    }
    if (!subscribers.length) {
      toast.error('No subscribers to send to')
      return
    }

    const confirmed = window.confirm(
      `Send this email to all ${subscribers.length} subscriber(s)?`
    )
    if (!confirmed) return

    try {
      setSending(true)
      const response = await axios.post(
        backendUrl + '/api/newsletter/send',
        { subject: subject.trim(), body: body.trim() },
        { headers: { token } }
      )
      toast.success(
        response.data?.message ||
          `Sent to ${response.data?.sent || 0} subscriber(s)`
      )
      if (response.data?.failed > 0) {
        toast.warning(`${response.data.failed} failed to send`)
      }
      setSubject('')
      setBody('')
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || 'Failed to send emails'
      )
    } finally {
      setSending(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Newsletter</h2>

      {/* Send email form */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Send personalized email to all subscribers
        </h3>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label
              htmlFor="newsletter-subject"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subject
            </label>
            <input
              id="newsletter-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Arrivals This Week – 20% Off"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="newsletter-body"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message (plain text or HTML; line breaks become &lt;br&gt;)
            </label>
            <textarea
              id="newsletter-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Hi there!&#10;&#10;We have exciting news for you..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-y font-mono text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={sending || subscribers.length === 0}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Sending...' : `Send to all ${subscribers.length} subscriber(s)`}
          </button>
        </form>
      </div>

      {/* Subscribers list */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Subscribers ({subscribers.length})</h3>
        {loading ? (
          <p className="text-gray-600">Loading subscribers...</p>
        ) : subscribers.length === 0 ? (
          <p className="text-gray-500">No subscribers yet.</p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Subscribed at</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{sub.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(sub.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Newsletter
