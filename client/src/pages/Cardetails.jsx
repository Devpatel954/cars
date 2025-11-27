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
  const [selectedImage, setSelectedImage] = useState(0)

  const currency = import.meta.env.VITE_API_URL || '$'

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
    if (id) fetchCar()
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
      const res = await fetch(`${apiUrl}/api/booking/create`, {
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
        alert('✨ Booking confirmed!')
        setTimeout(() => {
          navigate('/bookings')
        }, 500)
      } else {
        alert('Booking failed: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      alert('Booking error: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!car) return <Loader />

  const pricePerDay = car.price_pday ?? car.pricePerDay ?? car.price ?? 0
  const formattedPrice = `${currency}${Number(pricePerDay).toLocaleString()}`
  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div className='min-h-screen bg-gradient-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/cars')}
          className='mb-8 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors'
        >
          <svg className='w-5 h-5 rotate-180' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
          Back to Cars
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
          
          {/* Left - Image & Info */}
          <div className='lg:col-span-2 space-y-8'>
            
            {/* Image Gallery */}
            <div className='space-y-4'>
              <div className='relative bg-white rounded-2xl overflow-hidden shadow-xl'>
                <img
                  src={car.image || 'https://via.placeholder.com/600x400'}
                  alt={`${car.brand} ${car.model}`}
                  className='w-full h-96 object-cover'
                />
                <div className='absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full font-bold'>
                  Popular
                </div>
              </div>
            </div>

            {/* Car Info */}
            <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8'>
              <h1 className='text-4xl sm:text-5xl font-bold text-dark-900 mb-4'>
                {car.brand} {car.model}
              </h1>
              <div className='flex flex-wrap gap-4 mb-6'>
                <span className='inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold'>
                  {car.category}
                </span>
                <span className='inline-block px-4 py-2 bg-accent-100 text-accent-700 rounded-full font-semibold'>
                  {car.year}
                </span>
                <span className='inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold'>
                  ✓ Available
                </span>
              </div>

              {car.description && (
                <p className='text-gray-700 text-lg leading-relaxed mb-8'>
                  {car.description}
                </p>
              )}

              {/* Specs Grid */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {[
                  { icon: '👥', label: 'Seats', value: car.seating_capacity },
                  { icon: '⛽', label: 'Fuel', value: car.fuel_type },
                  { icon: '⚙️', label: 'Transmission', value: car.transmission_type },
                  { icon: '📍', label: 'Location', value: car.location }
                ].map((spec, i) => (
                  <div key={i} className='bg-gradient-light rounded-xl p-4 text-center border-2 border-primary-200'>
                    <div className='text-3xl mb-2'>{spec.icon}</div>
                    <div className='text-xs text-gray-600 uppercase font-semibold'>{spec.label}</div>
                    <div className='text-lg font-bold text-dark-900 mt-1'>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className='bg-white rounded-2xl shadow-lg p-6 sm:p-8'>
              <h2 className='text-2xl font-bold text-dark-900 mb-6'>Premium Features</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {['360° Camera', 'Bluetooth Connectivity', 'Heated Seats', 'Panoramic Sunroof', 'Cruise Control', 'Backup Camera'].map((feature, i) => (
                  <div key={i} className='flex items-center gap-3 p-3 bg-primary-50 rounded-lg'>
                    <svg className='w-5 h-5 text-primary-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                    <span className='font-medium text-gray-700'>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6'>
              
              {/* Price */}
              <div className='bg-gradient-primary rounded-xl p-6 text-white text-center'>
                <div className='text-5xl font-bold'>{formattedPrice}</div>
                <div className='text-sm opacity-90 mt-1'>per day</div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBooking} className='space-y-4'>
                
                {/* Pickup Date */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    📅 Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={minDate}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-0 outline-none transition-colors'
                    required
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    📅 Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || minDate}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-0 outline-none transition-colors'
                    required
                  />
                </div>

                {/* Price Calculation */}
                {pickupDate && returnDate && (
                  <div className='bg-primary-50 border-2 border-primary-200 rounded-lg p-4'>
                    <div className='flex justify-between mb-2'>
                      <span className='text-gray-700'>
                        {Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))} days
                      </span>
                      <span className='font-bold text-gray-900'>
                        {currency}{(Number(pricePerDay) * Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className='w-full py-4 bg-gradient-primary hover:shadow-glow disabled:opacity-60 text-white font-bold rounded-xl transition-all hover:scale-105 transform'
                >
                  {submitting ? '⏳ Processing...' : '🎯 Book Now'}
                </button>

                <p className='text-center text-xs text-gray-500'>
                  ✓ Free cancellation up to 24 hours before
                </p>
              </form>

              {/* Contact */}
              <div className='border-t-2 border-gray-200 pt-6'>
                <p className='text-center text-sm text-gray-600 mb-4'>Need help?</p>
                <button className='w-full py-2 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors'>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cardetails
