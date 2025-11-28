import React, { useState } from 'react'
import { assets } from '../assets/assets'
import Carcard from './Carcard'

const AIRecommendations = () => {
  const [budget, setBudget] = useState('')
  const [category, setCategory] = useState('')
  const [seats, setSeats] = useState('')
  const [location, setLocation] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGetRecommendations = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setRecommendations([])

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
      const params = new URLSearchParams()
      if (budget) params.append('budget', budget)
      if (category) params.append('category', category)
      if (seats) params.append('seats', seats)
      if (location) params.append('location', location)

      const response = await fetch(`${apiUrl}/api/ai/recommendations?${params}`)
      const data = await response.json()

      if (data.success) {
        setRecommendations(data.cars || [])
        setMessage(data.recommendationMessage)
      } else {
        setMessage('No cars found matching your criteria.')
      }
    } catch (error) {
      console.error('Recommendation error:', error)
      setMessage('Failed to get recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-gradient-to-br from-blue-50 to-indigo-50'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-3xl md:text-4xl font-bold text-center mb-2'>AI-Powered Recommendations</h2>
        <p className='text-center text-gray-600 mb-12'>Let our AI find the perfect car for your needs</p>

        {/* Filter Form */}
        <form onSubmit={handleGetRecommendations} className='bg-white rounded-lg shadow-lg p-6 mb-12'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Budget ($/day)</label>
              <input
                type='number'
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder='Max price'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary'
              >
                <option value=''>All Categories</option>
                <option value='Sedan'>Sedan</option>
                <option value='SUV'>SUV</option>
                <option value='Coupe'>Coupe</option>
                <option value='Hatchback'>Hatchback</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Min Seats</label>
              <input
                type='number'
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder='Seats'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary'
              >
                <option value=''>All Locations</option>
                <option value='New York'>New York</option>
                <option value='Los Angeles'>Los Angeles</option>
                <option value='Chicago'>Chicago</option>
                <option value='Houston'>Houston</option>
                <option value='Miami'>Miami</option>
                <option value='Boston'>Boston</option>
              </select>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition-all cursor-pointer'
          >
            {loading ? 'Finding perfect cars...' : 'Get AI Recommendations'}
          </button>
        </form>

        {/* AI Message */}
        {message && (
          <div className='bg-blue-50 border-l-4 border-primary rounded-lg p-6 mb-8'>
            <p className='text-gray-700 leading-relaxed'>{message}</p>
          </div>
        )}

        {/* Recommendations Grid */}
        {recommendations.length > 0 && (
          <div>
            <h3 className='text-2xl font-bold mb-8 text-center'>Recommended Cars</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {recommendations.map(car => (
                <div key={car._id} className='h-full'>
                  <Carcard car={car} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && recommendations.length === 0 && message && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>Adjust your filters and try again</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default AIRecommendations
