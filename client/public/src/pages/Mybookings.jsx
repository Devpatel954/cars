import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Tilte from '../components/Tilte'

const Mybookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const fmtDate = (iso) =>
    typeof iso === 'string' ? (iso.includes('T') ? iso.split('T')[0] : iso) : ''
  const fmtMoney = (n) => `${currency}${Number(n || 0).toLocaleString()}`

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
          return
        }
        const res = await fetch('http://localhost:3020/api/booking/my-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.success) {
          const rows = Array.isArray(data.bookings) ? data.bookings : []
          rows.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
          setBookings(rows)
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto">
      <Tilte
        title="My Bookings"
        subtitle="View and manage all your car bookings"
        align="left"
      />

      {loading ? (
        <p className="mt-8 text-gray-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="mt-8 text-gray-500">No bookings yet.</div>
      ) : (
        {bookings.map((booking, index) => {
          const status = booking?.status || 'pending'
          const statusClasses =
            status === 'confirmed'
              ? 'bg-green-400/15 text-green-600'
              : status === 'canceled' || status === 'cancelled'
              ? 'bg-red-400/15 text-red-600'
              : 'bg-yellow-400/15 text-yellow-700'

        return (
          <div
            key={booking?._id || index}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* Col 1: car card */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <img
                  src={booking?.car?.image}
                  className="w-full h-auto aspect-video object-cover"
                  alt=""
                />
              </div>
              <p className="text-lg font-medium mt-2">
                {booking?.car?.brand} {booking?.car?.model}
              </p>
              <p className="text-gray-500">
                {booking?.car?.year} · {booking?.car?.category} · {booking?.car?.location}
              </p>
            </div>

            {/* Col 2–3: details */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">Booking #{index + 1}</p>
                <p className={`px-3 py-1 text-xs rounded-full ${statusClasses}`}>
                  {status}
                </p>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.calendar_icon_colored}
                  className="w-4 h-4 mt-1"
                  alt=""
                />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {fmtDate(booking?.pickupDate)} to {fmtDate(booking?.returnDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.location_icon_colored}
                  className="w-4 h-4 mt-1"
                  alt=""
                />
                <div>
                  <p className="text-gray-500">Pick up Location</p>
                  <p>{booking?.car?.location || '-'}</p>
                </div>
              </div>
            </div>

            {/* Col 4: totals */}
            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="text-sm text-gray-500 md:text-right">
                <p>Total price</p>
                <h1 className="text-2xl font-semibold text-primary">
                  {fmtMoney(booking?.price)}
                </h1>
                <p>Booked on {fmtDate(booking?.createdAt)}</p>
              </div>
            </div>
          </div>
        )})}
      </div>
      )}
    </div>
  )
}

export default Mybookings
