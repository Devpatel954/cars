import express from 'express';
import { protect } from '../middleware/auth.js';
import { addCar, changeroletoowner, getCars, getCarById, deletecar } from '../controllers/ownercontroller.js';
import upload from '../middleware/multer.js';
const ownerRouter = express.Router();

ownerRouter.post('/changerole', protect, changeroletoowner);
ownerRouter.post('/add-car', protect, upload.single('image'), addCar);
ownerRouter.get('/cars', getCars);
ownerRouter.get('/cars/:id', getCarById);
ownerRouter.delete('/cars/:id', protect, deletecar);

export default ownerRouter;
