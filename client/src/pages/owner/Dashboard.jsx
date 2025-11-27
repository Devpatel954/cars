import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/owner/Title'

const Dashboard = () => {
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
  
  const getImageUrl = (image) => {
    return image && image.startsWith('/') ? `${apiUrl}${image}` : image
  }

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })
  const [availableCars, setAvailableCars] = useState([])

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
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'

        // Fetch owner's cars
        const carsRes = await fetch(`${apiUrl}/api/owner/cars`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const carsData = await carsRes.json()
        const ownerCars = carsData.success ? (carsData.cars || []) : []

        // Fetch all available cars (for display section)
        const allCarsRes = await fetch(`${apiUrl}/api/owner/cars`)
        const allCarsData = await allCarsRes.json()
        const allCars = allCarsData.success ? (allCarsData.cars || []) : []
        setAvailableCars(allCars.slice(0, 6))

        // Fetch owner's bookings
        const bookingsRes = await fetch(`${apiUrl}/api/owner/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const bookingsData = await bookingsRes.json()
        const ownerBookings = bookingsData.success ? (bookingsData.bookings || []) : []

        // Calculate KPIs
        const totalCars = ownerCars.length
        const totalBookings = ownerBookings.length
        const pendingBookings = ownerBookings.filter(b => b.status === 'pending').length
        const completedBookings = ownerBookings.filter(b => b.status === 'confirmed').length
        const monthlyRevenue = ownerBookings
          .filter(b => {
            if (!b.createdAt) return false
            const bookingMonth = new Date(b.createdAt).getMonth()
            const currentMonth = new Date().getMonth()
            return bookingMonth === currentMonth
          })
          .reduce((sum, b) => sum + (Number(b.price) || 0), 0)

        const recentBookings = ownerBookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)

        setData({
          totalCars,
          totalBookings,
          pendingBookings,
          completedBookings,
          recentBookings,
          monthlyRevenue
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="flex-1 px-4 pt-10 md:px-10">
      {/* Dashboard title with Add Car button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title
            title="Admin Dashboard"
            SubTitle="Quick insights into bookings, cars, and revenue"
          />
        </div>
        <button
          onClick={() => navigate('/owner/add-car')}
          className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg font-medium transition-colors"
        >
          + Add Car
        </button>
      </div>

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

      {/* Available Cars Section */}
      <div className="w-full mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-2">Available Cars</h2>
        <p className="text-sm text-gray-500 mb-6">Browse all cars in the system</p>
        
        {availableCars.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No cars available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {availableCars.map((car) => (
              <div
                key={car._id}
                className="rounded-lg border border-borderColor overflow-hidden hover:shadow-lg transition-shadow bg-white"
              >
                {/* Car Image */}
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={getImageUrl(car.image) || assets.car_image1}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Car Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {car.brand} {car.model}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><span className="font-medium">Year:</span> {car.year}</p>
                    <p><span className="font-medium">Seats:</span> {car.seating_capacity}</p>
                    <p><span className="font-medium">Fuel:</span> {car.fuel_type}</p>
                    <p><span className="font-medium">Transmission:</span> {car.transmission_type}</p>
                    <p><span className="font-medium">Price/Day:</span> {currency}{car.price_pday}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-borderColor">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      car.is_available 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {car.is_available ? 'Available' : 'Not Available'}
                    </span>
                    <p className="text-xs text-gray-500">{car.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

