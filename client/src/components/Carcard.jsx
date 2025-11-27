import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Carcard = ({ car }) => {
  
  const isAvailable = car.is_available ?? true
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const formattedPrice = `${currency}${Number(car.price_pday || 0).toLocaleString()}`
  const navigate  = useNavigate()
  
  // Build full image URL for backend-served assets
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
  const imageUrl = car.image && car.image.startsWith('/') 
    ? `${apiUrl}${car.image}` 
    : car.image

  return (
    <div onClick={()=>{navigate(`/car-details/${car._id}`);scrollTo(0,0)}}className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white flex flex-col h-full">
   
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

       
        {isAvailable && (
          <p className="absolute top-3 left-3 bg-green-600/90 text-white text-xs px-2.5 py-1 rounded-full shadow">
            Available now
          </p>
        )}

        
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
          <span className="font-semibold">{formattedPrice}</span>
          <span className="text-xs text-white/80"> / day</span>
        </div>
      </div>

    
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
       
        <div className="flex justify-between items-start gap-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold leading-snug">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-500">
              {car.category} • {car.year}
            </p>
          </div>
        </div>

     
        <div className="mt-auto grid grid-cols-2 gap-y-2 gap-x-4 text-gray-600">
          <div className="flex items-center text-sm">
            <img src={assets.users_icon} alt="" className="h-4 w-4 mr-2" />
            <span>{car.seating_capacity} seats</span>
          </div>

          <div className="flex items-center text-sm">
            <img src={assets.fuel_icon} alt="" className="h-4 w-4 mr-2" />
            <span>{car.fuel_type}</span>
          </div>

          <div className="flex items-center text-sm">
            <img src={assets.car_icon} alt="" className="h-4 w-4 mr-2" />
            <span className="capitalize">{car.transmission_type}</span>
          </div>

          <div className="flex items-center text-sm">
            <img src={assets.location_icon} alt="" className="h-4 w-4 mr-2" />
            <span>{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carcard
