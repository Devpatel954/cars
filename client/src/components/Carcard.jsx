import React from 'react'
import { useNavigate } from 'react-router-dom'

const Carcard = ({ car }) => {
  const isAvailable = car.is_available ?? true
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const formattedPrice = `${currency}${Number(car.price_pday || 0).toLocaleString()}`
  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`)
        window.scrollTo(0, 0)
      }}
      className='group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2'
    >
      {/* Image Container */}
      <div className='relative aspect-[16/9] overflow-hidden bg-gray-100'>
        <img
          src={car.image || 'https://via.placeholder.com/400x225'}
          alt={`${car.brand} ${car.model}`}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
        />

        {/* Availability Badge */}
        {isAvailable && (
          <div className='absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg'>
            ✓ Available
          </div>
        )}

        {/* Price Badge */}
        <div className='absolute bottom-4 right-4 bg-gradient-primary text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-md bg-opacity-90'>
          <div className='font-bold text-lg'>{formattedPrice}</div>
          <div className='text-xs opacity-90'>per day</div>
        </div>

        {/* Overlay Gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
      </div>

      {/* Content */}
      <div className='p-5 sm:p-6'>
        {/* Title */}
        <h3 className='text-xl font-bold text-dark-900 mb-2 group-hover:text-primary-600 transition-colors'>
          {car.brand} {car.model}
        </h3>
        <div className='flex items-center gap-2 mb-4'>
          <span className='text-sm text-gray-600'>{car.year}</span>
          <span className='text-gray-300'>•</span>
          <span className='text-sm text-gray-600'>{car.category}</span>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-2 gap-3 mb-4'>
          {/* Seats */}
          <div className='flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg'>
            <svg className='w-4 h-4 text-primary-600' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10 10a3 3 0 100-6 3 3 0 000 6zM0 10a1 1 0 011-1h2.757l.026.05A7.002 7.002 0 0110 18a7 7 0 006.217-3.944l.026-.05h2.757a1 1 0 110 2h-2.757l-.026.05A9 9 0 0110 20a9 9 0 01-8.217-4.944l-.026-.05H1a1 1 0 01-1-1z' />
            </svg>
            <span>{car.seating_capacity} Seats</span>
          </div>

          {/* Fuel */}
          <div className='flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg'>
            <svg className='w-4 h-4 text-primary-600' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10.3 1.046A1 1 0 009 2v11a3 3 0 106 0V2a1 1 0 00-1.7-.954z' />
            </svg>
            <span>{car.fuel_type}</span>
          </div>

          {/* Transmission */}
          <div className='flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg'>
            <svg className='w-4 h-4 text-primary-600' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
            </svg>
            <span className='capitalize'>{car.transmission_type}</span>
          </div>

          {/* Location */}
          <div className='flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg'>
            <svg className='w-4 h-4 text-primary-600' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
            </svg>
            <span>{car.location}</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className='w-full mt-4 px-4 py-3 bg-gradient-primary hover:shadow-lg text-white font-bold rounded-xl transition-all hover:scale-105 transform'>
          View Details →
        </button>
      </div>
    </div>
  )
}

export default Carcard
