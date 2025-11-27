import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'

const Managebookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login first')
        return
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
      const res = await fetch(`${apiUrl}/api/owner/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data && data.success) {
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  const formatDate = (iso) => {
    if (!iso) return '--'
    const d = new Date(iso)
    return isNaN(d) ? '--' : d.toLocaleDateString()
  }

  const formatCurrency = (n) =>
    `${currency}${new Intl.NumberFormat().format(Number(n) || 0)}`

  const statusPill = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold'
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
        return `${base} bg-green-100 text-green-700`
      case 'cancelled':
      case 'canceled':
        return `${base} bg-red-100 text-red-600`
      case 'pending':
      default:
        return `${base} bg-yellow-100 text-yellow-700`
    }
  }

  if (loading) {
    return (
      <div className="w-full px-4 pt-10 md:px-10">
        <Title
          title="Manage Bookings"
          SubTitle="Review booking requests, totals, and payment status"
        />
        <p className='mt-6 text-gray-500'>Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="w-full px-4 pt-10 md:px-10">
      <Title
        title="Manage Bookings"
        SubTitle="Review booking requests, totals, and payment status"
      />

      {bookings.length === 0 ? (
        <div className='mt-6 p-6 border border-borderColor rounded-lg text-center text-gray-500'>
          <p>No bookings yet.</p>
        </div>
      ) : (
        <div className="mt-6 w-full overflow-x-auto rounded-md border border-borderColor">
          <table className="w-full border-collapse text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="hidden p-3 font-medium md:table-cell">Dates</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-borderColor hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={b?.car?.image || assets.car_image1}
                        alt={`${b?.car?.brand || 'Car'} ${b?.car?.model || ''}`}
                        className="h-12 w-12 aspect-square rounded-md object-cover"
                        loading="lazy"
                      />
                      <div>
                        <p className="font-medium">{b?.car?.brand} {b?.car?.model}</p>
                        <p className="text-xs text-gray-500">{b?.user?.name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="hidden p-3 md:table-cell text-sm">
                    {formatDate(b?.pickupDate)} to {formatDate(b?.returnDate)}
                  </td>

                  <td className="p-3 font-medium">{formatCurrency(b?.price)}</td>

                  <td className="p-3">
                    <span className={statusPill(b?.status)}>
                      {b?.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Managebookings
