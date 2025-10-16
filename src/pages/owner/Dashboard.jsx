import React, { useEffect, useState, useMemo } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/owner/Title'

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  // Format helpers
  const formatDate = (iso) => {
    const d = iso ? new Date(iso) : null
    return d && !isNaN(d) ? d.toLocaleDateString() : '--'
  }

  const formatCurrency = (amount) => {
    return `${currency}${new Intl.NumberFormat().format(amount || 0)}`
  }

  const statusClass = (status) => {
    const base = 'px-3 py-0.5 rounded-full border text-xs'
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return `${base} border-yellow-300 bg-yellow-50 text-yellow-700`
      case 'confirmed':
      case 'completed':
        return `${base} border-green-300 bg-green-50 text-green-700`
      case 'cancelled':
      case 'canceled':
        return `${base} border-red-300 bg-red-50 text-red-700`
      default:
        return `${base} border-borderColor text-gray-600`
    }
  }

  // KPI Cards
  const dashboardCards = useMemo(
    () => [
      { title: 'Total Cars', value: data.totalCars, icon: assets.carIconColored },
      { title: 'Total Bookings', value: data.totalBookings, icon: assets.listIconColored },
      { title: 'Pending', value: data.pendingBookings, icon: assets.cautionIconColored },
      { title: 'Confirmed', value: data.completedBookings, icon: assets.listIconColored },
    ],
    [data]
  )

  useEffect(() => {
    // TODO: Replace with API fetch
    setData(dummyDashboardData)
  }, [])

  return (
    <div className="flex-1 px-4 pt-10 md:px-10">
      {/* Dashboard title */}
      <Title
        title="Admin Dashboard"
        SubTitle="Quick insights into bookings, cars, and revenue"
      />

      {/* Cards */}
      <div className="my-8 grid max-w-4xl gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 rounded-md border border-borderColor p-4"
          >
            <div>
              <h2 className="text-xs uppercase text-gray-500">{card.title}</h2>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <img src={card.icon} alt={card.title} className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className="mb-8 flex w-full flex-wrap items-start gap-6">
        {/* Recent Bookings */}
        <div className="w-full max-w-lg rounded-md border border-borderColor p-4 md:p-6">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-sm text-gray-500">Latest customer bookings</p>

          {data.recentBookings.length > 0 ? (
            data.recentBookings.map((booking, index) => (
              <div
                key={index}
                className="mt-4 flex items-center justify-between border-b pb-3 last:border-none"
              >
                <div className="flex items-center gap-2">
                  <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-primary/10 md:flex">
                    <img
                      src={assets.listIconColored}
                      alt="Booking"
                      className="h-5 w-5"
                    />
                  </div>
                  <div>
                    <p>
                      {booking.car?.brand} {booking.car?.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-medium">
                  <p className="text-sm text-gray-500">
                    {formatCurrency(booking.price)}
                  </p>
                  <span className={statusClass(booking.status)}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="mt-6 text-sm text-gray-500">No recent bookings yet.</p>
          )}
        </div>

        {/* Monthly Revenue */}
        <div className="w-full rounded-md border border-borderColor p-4 md:max-w-xs md:p-6">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-sm text-gray-500">Revenue for current month</p>
          <p className="mt-6 text-3xl font-semibold text-primary">
            {formatCurrency(data.monthlyRevenue)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

