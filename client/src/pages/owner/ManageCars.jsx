import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'

const ManageCars = () => {
    const currency = import.meta.env.VITE_CURRENCY || '$'
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(false)
    
    const getImageUrl = (image) => {
        return image && image.startsWith('/') ? `${apiUrl}${image}` : image
    }

    const fetchOwnerCars = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (!token) {
                alert('Please login first')
                return
            }

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
            const res = await fetch(`${apiUrl}/api/owner/cars`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data && data.success) {
                setCars(data.cars || [])
            }
        } catch (error) {
            console.error('Error fetching cars:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCar = async (carId) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return

        try {
            const token = localStorage.getItem('token')
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
            const res = await fetch(`${apiUrl}/api/owner/cars/${carId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                setCars(cars.filter(c => c._id !== carId))
                alert('Car deleted successfully')
            }
        } catch (error) {
            console.error('Error deleting car:', error)
            alert('Failed to delete car')
        }
    }

    useEffect(() => {
        fetchOwnerCars()
    }, [])

    if (loading) {
        return (
            <div className='px-4 pt-10 md:px-10 w-full'>
                <Title title='Manage Cars' SubTitle='Review, toggle availability, and remove cars from your fleet' />
                <p className='mt-6 text-gray-500'>Loading cars...</p>
            </div>
        )
    }

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            <Title title='Manage Cars' SubTitle='Review, toggle availability, and remove cars from your fleet' />

            {cars.length === 0 ? (
                <div className='mt-6 p-6 border border-borderColor rounded-lg text-center text-gray-500'>
                    <p>No cars added yet. <a href='/owner/add-car' className='text-primary'>Add your first car</a></p>
                </div>
            ) : (
                <div className='max-w-6xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
                    <table className='w-full border-collapse text-left text-sm text-gray-600'>
                        <thead className='bg-gray-50 text-gray-700'>
                            <tr>
                                <th className='p-3 font-medium'>Car</th>
                                <th className='p-3 font-medium max-md:hidden'>Category</th>
                                <th className='p-3 font-medium'>Price/Day</th>
                                <th className='p-3 font-medium max-md:hidden'>Availability</th>
                                <th className='p-3 font-medium'>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cars.map((car) => (
                                <tr key={car._id} className='border-t border-borderColor hover:bg-gray-50'>
                                    <td className='p-3 flex items-center gap-3'>
                                        <img src={getImageUrl(car.image) || assets.car_image1} alt={car.brand} className='h-12 w-12 aspect-square rounded-md object-cover' />
                                        <div>
                                            <p className='font-medium'>{car.brand} {car.model}</p>
                                            <p className='text-xs text-gray-500'>{car.year} • {car.seating_capacity} seats</p>
                                        </div>
                                    </td>

                                    <td className='p-3 max-md:hidden'>{car.category}</td>
                                    <td className='p-3'>{currency}{car.price_pday}/day</td>

                                    <td className='p-3 max-md:hidden'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            car.is_available
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {car.is_available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>

                                    <td className='p-3 flex items-center gap-3'>
                                        <button
                                            onClick={() => handleDeleteCar(car._id)}
                                            className='p-1 hover:bg-red-100 rounded'
                                            title='Delete car'
                                        >
                                            <img src={assets.delete_icon} alt="Delete" className='h-5 w-5' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ManageCars