import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file (only in development)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');

console.log('=== Environment Configuration ===');
console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('.env file path:', envPath);
console.log('.env file exists:', fs.existsSync(envPath));

if (process.env.NODE_ENV !== 'production' || fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });
  if (result.error && process.env.NODE_ENV !== 'production') {
    console.error('Error loading .env:', result.error.message);
  } else if (!result.error) {
    console.log('✓ Successfully loaded .env file');
  }
}

// Log all environment variables that start with specific keys (for debugging)
console.log('Environment variables check:');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ NOT SET');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`\n❌ ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('\nOn Railway, make sure you have set these variables in your Service Variables:');
  console.error('  - MONGODB_URI');
  console.error('  - JWT_SECRET');
  console.error('  - NODE_ENV=production');
  console.error('\nContinuing anyway to allow debugging...\n');
  // Don't exit - let it try to connect so we can see the actual error
} else {
  console.log('✓ All required environment variables are set\n');
}

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
    { 
      brand: 'Toyota', 
      model: 'Camry', 
      year: 2023, 
      category: 'Sedan', 
      seating_capacity: 5, 
      fuel_type: 'Petrol', 
      transmission_type: 'Automatic', 
      price_pday: 50, 
      location: 'New York',
      image: '/src/assets/car_image1.png'
    },
    { 
      brand: 'Honda', 
      model: 'Accord', 
      year: 2022, 
      category: 'Sedan', 
      seating_capacity: 5, 
      fuel_type: 'Petrol', 
      transmission_type: 'Automatic', 
      price_pday: 55, 
      location: 'Los Angeles',
      image: '/src/assets/car_image2.png'
    },
    { 
      brand: 'BMW', 
      model: 'X5', 
      year: 2023, 
      category: 'SUV', 
      seating_capacity: 7, 
      fuel_type: 'Diesel', 
      transmission_type: 'Automatic', 
      price_pday: 150, 
      location: 'Chicago',
      image: '/src/assets/car_image1.png'
    },
    { 
      brand: 'Audi', 
      model: 'A4', 
      year: 2022, 
      category: 'Sedan', 
      seating_capacity: 5, 
      fuel_type: 'Petrol', 
      transmission_type: 'Automatic', 
      price_pday: 120, 
      location: 'Houston',
      image: '/src/assets/car_image3.png'
    },
    { 
      brand: 'Mercedes', 
      model: 'C-Class', 
      year: 2023, 
      category: 'Sedan', 
      seating_capacity: 5, 
      fuel_type: 'Diesel', 
      transmission_type: 'Automatic', 
      price_pday: 180, 
      location: 'Miami',
      image: '/src/assets/car_image4.png'
    },
    { 
      brand: 'Hyundai', 
      model: 'Tucson', 
      year: 2022, 
      category: 'SUV', 
      seating_capacity: 5, 
      fuel_type: 'Petrol', 
      transmission_type: 'Automatic', 
      price_pday: 70, 
      location: 'Boston',
      image: '/src/assets/car_image2.png'
    }
  ]
  
  for (let i = 0; i < sampleCars.length; i++) {
    const car = sampleCars[i]
    
    await Car.create({
      owner: defaultOwner._id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      category: car.category,
      seating_capacity: car.seating_capacity,
      fuel_type: car.fuel_type,
      transmission_type: car.transmission_type,
      price_pday: car.price_pday,
      location: car.location,
      description: `Premium ${car.brand} ${car.model} - ${car.category} with ${car.seating_capacity} seats. Perfect for comfortable long drives.`,
      image: car.image,
      is_available: true
    })
  }
  console.log('Sample cars seeded successfully - 6 cars created with image references')
} catch (err) {
  console.error('Seeding cars error:', err.message)
  console.error('Stack:', err.stack)
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

try {
  app.use('/api/user',userRouter);
  console.log('User router loaded');
  app.use('/api/owner',ownerRouter);
  console.log('Owner router loaded');
  app.use('/api/booking',bookingRouter);
  console.log('Booking router loaded');
} catch (err) {
  console.error('Router loading error:', err.message);
}

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
console.log(`Starting server on port ${PORT}...`);
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for multiple origins`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

server.on('close', () => {
  console.log('Server closed');
});

process.stdin.resume();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
