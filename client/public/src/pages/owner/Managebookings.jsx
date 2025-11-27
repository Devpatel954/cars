import React, { useEffect, useState } from 'react'
import { dummyMyBookingsData } from '../../assets/assets'
import Title from '../../components/owner/Title'

const Managebookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async () => {
    // TODO: replace with API
    setBookings(Array.isArray(dummyMyBookingsData) ? dummyMyBookingsData : [])
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

  const handleStatusChange = (idx, next) => {
    setBookings((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, status: next } : b))
    )
  }

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

  return (
    <div className="w-full px-4 pt-10 md:px-10">
      <Title
        title="Manage Bookings"
        SubTitle="Review booking requests, totals, and payment status"
      />

      <div className="mt-6 w-full max-w-3xl overflow-x-auto rounded-md border border-borderColor">
        <table className="w-full border-collapse text-left text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="hidden p-3 font-medium md:table-cell">Date range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="hidden p-3 font-medium md:table-cell">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b, index) => (
                <tr key={b._id || index} className="border-t border-borderColor text-gray-700">
                  {/* Car */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={b?.car?.image || b?.car?.images?.[0]}
                        alt={`${b?.car?.brand || 'Car'} ${b?.car?.model || ''}`}
                        className="h-12 w-12 aspect-square rounded-md object-cover"
                        loading="lazy"
                      />
                      <p className="hidden md:block">
                        {b?.car?.brand} {b?.car?.model}
                      </p>
                    </div>
                  </td>

                  {/* Date range */}
                  <td className="hidden p-3 md:table-cell">
                    {formatDate(b?.pickupDate)} to {formatDate(b?.returnDate)}
                  </td>

                  {/* Total */}
                  <td className="p-3">{formatCurrency(b?.price)}</td>

                  {/* Payment */}
                  <td className="hidden p-3 md:table-cell">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                      {(b?.paymentMethod || 'offline').toLowerCase()}
                    </span>
                  </td>

                  {/* Actions / Status */}
                  <td className="p-3">
                    {String(b?.status).toLowerCase() === 'pending' ? (
                      <select
                        value={b?.status || 'pending'}
                        onChange={(e) => handleStatusChange(index, e.target.value)}
                        className="mt-1 rounded-md border border-borderColor px-2 py-1.5 text-gray-700 outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        <option value="pending">pending</option>
                        <option value="cancelled">cancelled</option>
                        <option value="confirmed">confirmed</option>
                      </select>
                    ) : (
                      <span className={statusPill(b?.status)}>
                        {b?.status || 'pending'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Managebookings
