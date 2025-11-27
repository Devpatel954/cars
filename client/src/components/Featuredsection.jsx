import React, { useEffect, useState } from 'react'
import Tilte from './Tilte'
import { assets } from '../assets/assets'
import Carcard from './Carcard'
import { useNavigate } from 'react-router-dom'

const Featuredsection = () => {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
        const res = await fetch(`${apiUrl}/api/owner/cars`)
        const data = await res.json()
        if (data.success) {
          setCars(data.cars ? data.cars.slice(0, 6) : [])
        }
      } catch (error) {
        console.error('Error fetching cars:', error)
        setCars([])
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  return (
    <section className='flex flex-col items-center py-12 sm:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 w-full'>
      <Tilte 
        title='Featured Vehicles' 
        subtitle='Explore our selection of premium vehicles available for your next adventure'
      />

      {loading ? (
        <div className='w-full max-w-7xl mt-8 sm:mt-12'>
          <p className='text-center text-gray-500 py-8'>Loading vehicles...</p>
        </div>
      ) : (
        <>
          <div className='w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 lg:mt-16'>
            {cars.map((car) => (
              <div key={car._id} className='h-full'>
                <Carcard car={car} />
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              navigate('/cars')
              window.scrollTo(0, 0)
            }}
            className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-lg mt-8 sm:mt-12 lg:mt-16 cursor-pointer font-medium text-sm sm:text-base transition-all'
          >
            Explore All Cars
            <img src={assets.arrow_icon} alt="" className='w-4 h-4' />
          </button>
        </>
      )}
    </section>
  )
}

export default Featuredsection