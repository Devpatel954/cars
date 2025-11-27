import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import Tilte from '../components/Tilte'

const Mybookings = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const fmtDate = (iso) =>
    typeof iso === 'string' ? (iso.includes('T') ? iso.split('T')[0] : iso) : ''
  const fmtMoney = (n) => `${currency}${Number(n || 0).toLocaleString()}`

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      console.log('🔑 My Bookings - Token present:', !!token)
      if (!token) {
        console.log('❌ No token found')
        setBookings([])
        return
      }
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
      console.log('📤 Fetching from:', `${apiUrl}/api/booking/my-bookings`)
      const res = await fetch(`${apiUrl}/api/booking/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      console.log('📥 Response:', data)
      if (data.success) {
        const rows = Array.isArray(data.bookings) ? data.bookings : []
        console.log('✅ Found', rows.length, 'bookings')
        rows.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
        setBookings(rows)
      } else {
        console.log('❌ API returned success: false')
        setBookings([])
      }
    } catch (error) {
      console.error('🔴 Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Add a small delay to ensure token is saved to localStorage
    const timer = setTimeout(() => {
      fetchBookings()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 mt-8 sm:mt-12 lg:mt-16 text-sm max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8">
        <div className="flex-1">
          <Tilte
            title="My Bookings"
            subtitle="View and manage all your car bookings"
            align="left"
          />
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500 animate-pulse">Loading bookings...</p>
        </div>
      ) : !localStorage.getItem('token') ? (
        <div className="mt-8 text-center bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8">
          <p className="text-gray-600 mb-4">Please login to view your bookings</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 text-center bg-gray-50 rounded-lg p-8">
          <p className="text-gray-500 text-lg">No bookings yet.</p>
          <p className="text-gray-400 mt-2">Start your journey by booking a car</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {bookings.map((booking, index) => {
            const status = booking?.status || 'pending'
            const statusClasses =
              status === 'confirmed'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : status === 'canceled' || status === 'cancelled'
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-yellow-100 text-yellow-700 border border-yellow-300'

            return (
              <div
                key={booking?._id || index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Mobile Layout */}
                <div className="sm:hidden p-4 space-y-4">
                  <div className="rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={booking?.car?.image || 'https://via.placeholder.com/300x200'}
                      className="w-full h-40 object-cover"
                      alt={`${booking?.car?.brand} ${booking?.car?.model}`}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">
                      {booking?.car?.brand} {booking?.car?.model}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking?.car?.year} · {booking?.car?.category}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      Booking #{index + 1}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusClasses}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-200">
                    <div className="flex gap-2">
                      <img src={assets.calendar_icon_colored} className="w-4 h-4 flex-shrink-0 mt-0.5" alt="" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Rental Period</p>
                        <p className="font-medium text-sm">{fmtDate(booking?.pickupDate)} to {fmtDate(booking?.returnDate)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <img src={assets.location_icon_colored} className="w-4 h-4 flex-shrink-0 mt-0.5" alt="" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Pick up Location</p>
                        <p className="font-medium text-sm">{booking?.car?.location || '-'}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded p-3 mt-3">
                      <p className="text-xs text-gray-500 mb-1">Total Price</p>
                      <p className="text-xl font-bold text-blue-600">{fmtMoney(booking?.price)}</p>
                      <p className="text-xs text-gray-400 mt-1">Booked on {fmtDate(booking?.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                  {/* Col 1: Car Image & Info */}
                  <div className="md:col-span-1">
                    <div className="rounded-md overflow-hidden mb-3 bg-gray-100">
                      <img
                        src={booking?.car?.image || 'https://via.placeholder.com/300x200'}
                        className="w-full h-auto aspect-video object-cover"
                        alt={`${booking?.car?.brand} ${booking?.car?.model}`}
                      />
                    </div>
                    <p className="text-base sm:text-lg font-semibold">
                      {booking?.car?.brand} {booking?.car?.model}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking?.car?.year} · {booking?.car?.category} · {booking?.car?.location}
                    </p>
                  </div>

                  {/* Col 2-3: Booking Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">Booking #{index + 1}</span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusClasses}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img src={assets.calendar_icon_colored} className="w-4 h-4 mt-1 flex-shrink-0" alt="" />
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Rental Period</p>
                        <p className="font-medium text-sm">
                          {fmtDate(booking?.pickupDate)} to {fmtDate(booking?.returnDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <img src={assets.location_icon_colored} className="w-4 h-4 mt-1 flex-shrink-0" alt="" />
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Pick up Location</p>
                        <p className="font-medium text-sm">{booking?.car?.location || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Col 4: Price */}
                  <div className="md:col-span-1 flex flex-col justify-between">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Total Price</p>
                      <h2 className="text-2xl font-bold text-blue-600">{fmtMoney(booking?.price)}</h2>
                      <p className="text-xs text-gray-400 mt-2">Booked on {fmtDate(booking?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Mybookings
