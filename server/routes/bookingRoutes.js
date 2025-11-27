import express from 'express';
import { protect } from '../middleware/auth.js';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/my-bookings', protect, getMyBookings);
bookingRouter.post('/cancel/:id', protect, cancelBooking);

export default bookingRouter;
