import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId, pickupDate, returnDate } = req.body;

        if (!carId || !pickupDate || !returnDate) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));

        if (days <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid dates' });
        }

        const price = car.price_pday * days;

        const booking = await Booking.create({
            user: _id,
            car: carId,
            pickupDate: pickup,
            returnDate: returnD,
            price,
            status: 'confirmed'
        });

        await booking.populate('car');

        res.json({ success: true, booking });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getMyBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id }).populate('car');
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await Booking.findByIdAndUpdate(id, { status: 'cancelled' });

        res.json({ success: true, message: 'Booking cancelled' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}
