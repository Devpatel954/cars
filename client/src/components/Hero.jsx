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
        navigate(`/cars${pickupLocation ? '?location=' + pickupLocation : ''}`)
    }

    const minDate = new Date().toISOString().split('T')[0]

    return (
        <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-light'>
            {/* Animated Background Elements */}
            <div className='absolute inset-0'>
                <div className='absolute top-0 right-0 w-96 h-96 bg-accent-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-light'></div>
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20'></div>
            </div>

            <div className='relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 sm:py-20 lg:py-32'>
                    
                    {/* Left Content */}
                    <div className='animate-slide-up'>
                        <div className='inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6'>
                            ✨ Premium Car Rental Service
                        </div>
                        
                        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-900 mb-6 leading-tight'>
                            Your Perfect <span className='bg-gradient-primary bg-clip-text text-transparent'>Ride Awaits</span>
                        </h1>
                        
                        <p className='text-lg text-gray-600 mb-8 leading-relaxed'>
                            Discover luxury cars at unbeatable prices. Book instantly, drive happily. From economy to premium, we have your perfect match.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 mb-12'>
                            <button
                                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                                className='px-8 py-4 bg-gradient-primary hover:shadow-glow text-white font-bold rounded-xl transition-all hover:scale-105 transform'
                            >
                                Book Now
                            </button>
                            <button
                                onClick={() => navigate('/cars')}
                                className='px-8 py-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-bold rounded-xl transition-all'
                            >
                                Browse Cars
                            </button>
                        </div>

                        {/* Stats */}
                        <div className='grid grid-cols-3 gap-6'>
                            <div>
                                <div className='text-3xl font-bold text-primary-600'>500+</div>
                                <div className='text-sm text-gray-600'>Cars Available</div>
                            </div>
                            <div>
                                <div className='text-3xl font-bold text-primary-600'>10k+</div>
                                <div className='text-sm text-gray-600'>Happy Drivers</div>
                            </div>
                            <div>
                                <div className='text-3xl font-bold text-primary-600'>24/7</div>
                                <div className='text-sm text-gray-600'>Support</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Hero Image - Desktop Only */}
                    <div className='relative hidden lg:block'>
                        <div className='absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl blur-2xl'></div>
                        <img 
                            src={assets.main_car || 'https://via.placeholder.com/500x400'} 
                            alt="luxury car" 
                            className='w-full h-auto object-contain drop-shadow-2xl'
                        />
                    </div>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className='mt-12 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-slide-up'>
                    <h3 className='text-2xl font-bold text-dark-900 mb-6'>Find Your Perfect Car</h3>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {/* Location */}
                        <div>
                            <label className='text-sm font-semibold text-gray-700 mb-2 block'>📍 Location</label>
                            <select 
                                value={pickupLocation}
                                onChange={(e) => setPickupLocation(e.target.value)}
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-0 outline-none transition-colors'
                                required
                            >
                                <option value="">Select location</option>
                                {cityList.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Pickup Date */}
                        <div>
                            <label className='text-sm font-semibold text-gray-700 mb-2 block'>📅 Pickup</label>
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
                            <label className='text-sm font-semibold text-gray-700 mb-2 block'>📅 Return</label>
                            <input 
                                type="date" 
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                min={pickupDate || minDate}
                                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-0 outline-none transition-colors'
                                required
                            />
                        </div>

                        {/* Search Button */}
                        <div className='flex items-end'>
                            <button 
                                type='submit'
                                className='w-full px-6 py-3 bg-gradient-primary hover:shadow-lg text-white font-bold rounded-lg transition-all hover:scale-105 transform'
                            >
                                🔍 Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default Hero
