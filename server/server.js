import express from "express";
import "dotenv/config";
import cors from "cors";
import fs from "fs";
import path from "path";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerroutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import Car from './models/Car.js'
import User from './models/User.js'

const app = express()

console.log('Connecting to MongoDB...')
await connectDB()
console.log('MongoDB connection established, starting server initialization...')

// Seed sample cars
try {
  // Clear existing cars to ensure fresh data
  await Car.deleteMany({})
  console.log('Cleared existing cars from database')
  
  const defaultOwner = await User.findOne() || await User.create({
    name: 'Premium Cars Inc',
    email: 'admin@carental.com',
    password: 'hashedpassword',
    role: 'owner'
  })
  
  const sampleCars = [
    { brand: 'Toyota', model: 'Camry', year: 2023, category: 'Sedan', seating_capacity: 5, fuel_type: 'Petrol', transmission_type: 'Automatic', price_pday: 50, location: 'New York' },
    { brand: 'Honda', model: 'Accord', year: 2022, category: 'Sedan', seating_capacity: 5, fuel_type: 'Petrol', transmission_type: 'Automatic', price_pday: 55, location: 'Los Angeles' },
    { brand: 'BMW', model: 'X5', year: 2023, category: 'SUV', seating_capacity: 7, fuel_type: 'Diesel', transmission_type: 'Automatic', price_pday: 150, location: 'Chicago' },
    { brand: 'Audi', model: 'A4', year: 2022, category: 'Sedan', seating_capacity: 5, fuel_type: 'Petrol', transmission_type: 'Automatic', price_pday: 120, location: 'Houston' },
    { brand: 'Mercedes', model: 'C-Class', year: 2023, category: 'Sedan', seating_capacity: 5, fuel_type: 'Diesel', transmission_type: 'Automatic', price_pday: 180, location: 'Miami' },
    { brand: 'Hyundai', model: 'Tucson', year: 2022, category: 'SUV', seating_capacity: 5, fuel_type: 'Petrol', transmission_type: 'Automatic', price_pday: 70, location: 'Boston' }
  ]
  
  // Reference to car image filenames - these will be served from frontend
  const carImageNames = [
    'car_image1.png',
    'car_image2.png',
    'car_image3.png',
    'car_image4.png'
  ]
  
  for (let i = 0; i < sampleCars.length; i++) {
    const car = sampleCars[i]
    const imageIndex = i % carImageNames.length
    const imageUrl = `/src/assets/${carImageNames[imageIndex]}`
    
    await Car.create({
      owner: defaultOwner._id,
      ...car,
      description: `Premium ${car.brand} ${car.model} - ${car.category} with ${car.seating_capacity} seats. Perfect for comfortable long drives.`,
      image: imageUrl,
      is_available: true
    })
  }
  console.log('Sample cars seeded successfully - 6 cars created with image references')
} catch (err) {
  console.log('Seeding cars error:', err.message)
}

// CORS Configuration - Allow multiple origins
app.use(cors({
  origin: [
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000',
    'https://carrentalapp-client.vercel.app',
    'https://carrentalapp.vercel.app',
    /\.vercel\.app$/, // Allow all vercel.app domains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Serve static files from client assets
app.use('/src/assets', express.static(path.join(process.cwd(), '../client/src/assets')))

app.get('/',(req,res)=>res.send("server is running"))

app.use('/api/user',userRouter);
app.use('/api/owner',ownerRouter);
app.use('/api/booking',bookingRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for multiple origins`);
});
