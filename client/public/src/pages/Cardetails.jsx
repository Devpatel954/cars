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

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://localhost:3020/api/owner/cars/${id}`)
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
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch('http://localhost:3020/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          carId: id,
          pickupDate,
          returnDate
        })
      })

      const data = await res.json()
      if (data.success) {
        alert('Booking confirmed!')
        navigate('/mybookings')
      } else {
        alert('Booking failed: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error booking:', error)
      alert('Booking error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!car) return <Loader />

  const pricePerDay = car.price_pday ?? car.pricePerDay ?? car.price ?? 0
  const formattedPrice = `${currency}${Number(pricePerDay).toLocaleString()}`

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        type="button"
        onClick={() => navigate('/cars')}
        className="flex items-center gap-2 mb-6 text-gray-500 hover:text-gray-700"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-60" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* LEFT: car images + details */}
        <div className="lg:col-span-2">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-auto md:max-h-96 object-cover rounded-xl mb-6 shadow-md"
          />

          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} • {car.year}
              </p>
              {car.location && (
                <p className="mt-1 text-gray-500 text-sm flex items-center gap-2">
                  <img src={assets.location_icon} alt="" className="h-4 w-4" />
                  {car.location}
                </p>
              )}
            </div>

            <hr className="border-t border-gray-200 my-6" />

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission_type },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                  <img src={icon} alt="" className="h-5 mb-2" />
                  <span className="text-sm text-gray-700 text-center">{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div>
                <h2 className="text-xl font-medium mb-3">Description</h2>
                <p className="text-gray-600">{car.description}</p>
              </div>
            )}

            {/* Features */}
            <div>
              <h2 className="text-xl font-medium mb-3">Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['360 camera', 'Bluetooth', 'Heated seats', 'Rear view mirror'].map((item) => (
                  <li key={item} className="flex items-center text-gray-600">
                    <img src={assets.check_icon} className="h-4 mr-2" alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT: booking card */}
        <form
          onSubmit={handleBooking}
          className="shadow-lg h-max sticky top-20 rounded-xl p-6 space-y-6 text-gray-700 bg-white"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {formattedPrice}
            <span className="text-base text-gray-400 font-normal">per day</span>
          </p>

          <hr className="border-t border-gray-200 my-4" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date">Pick up date</label>
            <input
              type="date"
              id="pickup-date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="return-date">Return date</label>
            <input
              type="date"
              id="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Booking...' : 'Book now'}
          </button>

          <p className="text-center text-sm text-gray-500">No credit card required to reserve</p>
        </form>
      </div>
    </div>
  )
}

export default Cardetails
