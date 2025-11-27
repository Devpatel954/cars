import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const [pickupLocation, setPickupLocation] = useState("")
    const [pickupDate, setPickupDate] = useState("")
    const [returnDate, setReturnDate] = useState("")
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        // Navigate to cars page with search params
        const params = new URLSearchParams()
        if (pickupLocation) params.append('location', pickupLocation)
        if (pickupDate) params.append('pickupDate', pickupDate)
        if (returnDate) params.append('returnDate', returnDate)
        navigate(`/cars${params.toString() ? '?' + params.toString() : ''}`)
    }

    const minDate = new Date().toISOString().split('T')[0]

    return (
        <div className='min-h-screen flex flex-col items-center justify-center gap-8 sm:gap-12 bg-light text-center px-4 py-12 sm:py-16'>
            {/* Heading */}
            <div>
                <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight'>
                    Luxury Cars<br className="hidden sm:inline" /> on Rent
                </h1>
                <p className='text-gray-600 text-sm sm:text-base mt-3'>Find and book your perfect ride in minutes</p>
            </div>

            {/* Search Form */}
            <form 
                onSubmit={handleSearch}
                className='w-full max-w-2xl bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6'
            >
                {/* Mobile Layout */}
                <div className='sm:hidden flex flex-col gap-4'>
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-medium text-gray-700'>Pickup Location</label>
                        <select 
                            required 
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value="">Select location</option>
                            {cityList.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        {pickupLocation && <p className='text-xs text-blue-600 mt-0.5'>{pickupLocation}</p>}
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-medium text-gray-700'>Pickup Date</label>
                        <input 
                            type="date" 
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            min={minDate} 
                            className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-medium text-gray-700'>Return Date</label>
                        <input 
                            type="date" 
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            min={pickupDate || minDate} 
                            className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>

                    <button 
                        type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2'
                    >
                        <img src={assets.search_icon} alt="" className='brightness-300 w-4 h-4' />
                        Search Cars
                    </button>
                </div>

                {/* Tablet & Desktop Layout */}
                <div className='hidden sm:flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3'>
                    <div className='flex-1 flex flex-col gap-1.5'>
                        <label className='text-xs font-medium text-gray-700'>Pickup Location</label>
                        <select 
                            required 
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value="">Select location</option>
                            {cityList.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex-1 flex flex-col gap-1.5'>
                        <label className='text-xs font-medium text-gray-700'>Pickup Date</label>
                        <input 
                            type="date" 
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            min={minDate} 
                            className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>

                    <div className='flex-1 flex flex-col gap-1.5'>
                        <label className='text-xs font-medium text-gray-700'>Return Date</label>
                        <input 
                            type="date" 
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            min={pickupDate || minDate} 
                            className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            required
                        />
                    </div>

                    <button 
                        type='submit'
                        className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 lg:px-8 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap'
                    >
                        <img src={assets.search_icon} alt="" className='brightness-300 w-4 h-4' />
                        Search
                    </button>
                </div>
            </form>

            {/* Hero Image */}
            <div className='w-full max-w-4xl'>
                <img 
                    src={assets.main_car} 
                    alt="luxury car" 
                    className='w-full h-auto max-h-64 sm:max-h-96 object-contain'
                />
            </div>
        </div>
    )
}

export default Hero