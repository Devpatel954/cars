import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'

const Cardetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const currency = import.meta.env.VITE_CURRENCY || '$'
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
  
  // Build full image URL
  const imageUrl = car && car.image && car.image.startsWith('/') 
    ? `${apiUrl}${car.image}` 
    : car?.image

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
        const res = await fetch(`${apiUrl}/api/owner/cars/${id}`)
        const data = await res.json()
        if (data.success) {
          setCar(data.car)
        }
      } catch (error) {
        console.error('Error fetching car:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchCar()
    }
  }, [id])

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!pickupDate || !returnDate) {
      alert('Please select both dates')
      return
    }

    const token = localStorage.getItem('token')
    console.log('🔑 Token:', token ? 'Present' : 'Missing')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSubmitting(true)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
      const payload = {
        carId: id,
        pickupDate,
        returnDate
      }
      console.log('📤 Sending booking:', payload)
      
      const res = await fetch(`${apiUrl}/api/booking/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      console.log('📥 Response:', data)
      
      if (data.success) {
        alert('Booking confirmed!')
        // Wait a moment for backend to fully persist, then navigate
        setTimeout(() => {
          navigate('/bookings')
        }, 500)
      } else {
        alert('Booking failed: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('🔴 Error booking:', error)
      alert('Booking error: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!car) return <Loader />

  const pricePerDay = car.price_pday ?? car.pricePerDay ?? car.price ?? 0
  const formattedPrice = `${currency}${Number(pricePerDay).toLocaleString()}`

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 mt-8 sm:mt-12 lg:mt-16 pb-12">
      <button
        type="button"
        onClick={() => navigate('/cars')}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 w-4 h-4" />
        Back to cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        {/* LEFT: car images + details */}
        <div className="lg:col-span-2">
          <img
            src={imageUrl || 'https://via.placeholder.com/500x300'}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-48 sm:h-72 lg:h-96 object-cover rounded-lg sm:rounded-xl mb-6 shadow-md"
          />

          <div className="space-y-6 sm:space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-base sm:text-lg mt-1">
                {car.category} • {car.year}
              </p>
              {car.location && (
                <p className="mt-2 text-gray-600 text-sm flex items-center gap-2">
                  <img src={assets.location_icon} alt="" className="h-4 w-4" />
                  {car.location}
                </p>
              )}
            </div>

            <div className="border-t border-gray-200" />

            {/* Specs - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission_type },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }, idx) => (
                <div key={idx} className="flex flex-col items-center bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <img src={icon} alt="" className="h-5 w-5 mb-2" />
                  <span className="text-xs sm:text-sm text-gray-700 text-center line-clamp-2">{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* Features */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {['360 camera', 'Bluetooth', 'Heated seats', 'Rear view mirror'].map((item) => (
                  <li key={item} className="flex items-center text-gray-600 text-sm sm:text-base">
                    <img src={assets.check_icon} className="h-4 w-4 mr-2 flex-shrink-0" alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT: booking card */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleBooking}
            className="shadow-lg rounded-xl p-5 sm:p-6 space-y-5 text-gray-700 bg-white sticky top-20 lg:top-24"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{formattedPrice}</span>
              <span className="text-sm text-gray-500 font-normal">per day</span>
            </div>

            <div className="border-t border-gray-200" />

            <div className="flex flex-col gap-2">
              <label htmlFor="pickup-date" className="text-sm font-medium">Pick up date</label>
              <input
                type="date"
                id="pickup-date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="return-date" className="text-sm font-medium">Return date</label>
              <input
                type="date"
                id="return-date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="border border-gray-300 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min={pickupDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer text-base"
            >
              {submitting ? 'Booking...' : 'Book now'}
            </button>

            <p className="text-center text-xs sm:text-sm text-gray-500">No credit card required</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Cardetails
