import React, { useEffect, useState } from 'react'
import Tilte from './Tilte'
import { assets } from '../assets/assets'
import Carcard from './Carcard'
import { useNavigate } from 'react-router-dom'

const Featuredsection = () => {
const navigate = useNavigate()
const [cars, setCars] = useState([])

useEffect(() => {
  const fetchCars = async () => {
    try {
      const res = await fetch('http://localhost:3020/api/owner/cars')
      const data = await res.json()
      if (data.success) {
        setCars(data.cars ? data.cars.slice(0, 6) : [])
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    }
  }
  fetchCars()
}, [])

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:x-32'>
        <div>
            <Tilte title= 'Featured vehicles' subtitle='Explore our selection of premium vehicles available for your next adventure'/>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
            {
                cars.map((car)=>(
                    <div key={car._id}>
                        <Carcard car={car}/>
                    </div>
                ))
            }

        </div>

<button onClick={()=>{
    navigate('/cars');scrollTo(0,0)
}}className='flex items-center justify-center gap-2 px-6 py-2 border border-Color hover:bg-gray-50 rounded-md mt-18 cursor-pointer '>
    Explore All cars <img src={assets.arrow_icon} alt="" />
</button>

    </div>
  )
}

export default Featuredsection