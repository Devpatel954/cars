import React, { useMemo, useState } from 'react'
import Tilte from '../components/Tilte'
import { assets, dummyCarData } from '../assets/assets'
import Carcard from '../components/Carcard'

const Cars = () => {
  const [query, setQuery] = useState('')

  const cars = Array.isArray(dummyCarData) ? dummyCarData : []

  const filteredCars = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return cars
    return cars.filter((c) => {
      const haystack = [
        c.brand,
        c.model,
        c.category,
        c.location,
        ...(Array.isArray(c.features) ? c.features : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [cars, query])

  return (
    <div>
      {/* Header + search */}
      <div className="flex flex-col items-center py-20 bg-light px-4">
        <Tilte
          title="Available Cars"
          subtitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <div className="flex items-center bg-white px-4 mt-6 w-full max-w-3xl h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="Search" className="w-4 h-4 mr-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search by make, model, features"
            className="w-full h-full outline-none text-gray-600 placeholder:text-gray-400"
          />
          <img src={assets.filter_icon} alt="Filter" className="w-4 h-4 ml-2" />
        </div>
      </div>

      {/* Results */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10 max-w-7xl mx-auto">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredCars.length}</span> of{' '}
          <span className="font-medium">{cars.length}</span> cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {filteredCars.map((car, index) => (
            <Carcard key={car._id || car.id || index} car={car} />
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No cars match “{query}”. Try a different search.
          </div>
        )}
      </div>
    </div>
  )
}

export default Cars
