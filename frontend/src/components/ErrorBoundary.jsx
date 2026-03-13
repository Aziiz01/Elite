import React from 'react'
import { toast } from 'react-toastify'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    toast.error('Something went wrong. Please refresh the page.')
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6">
          <p className="text-lg text-gray-700">Something went wrong.</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Refresh page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
