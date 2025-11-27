# Car Rental Application

A full-stack car rental platform built with React, Node.js, Express, and MongoDB.

## Project Overview

A modern car rental application that allows users to browse and book cars, while car owners can list and manage their vehicles.

## Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **JWT Authentication** with localStorage

### Backend
- **Node.js 24.x** with Express
- **MongoDB Atlas** for database
- **Mongoose** for ODM
- **JWT** for authentication
- **CORS** enabled for frontend communication
- **Dotenv** for environment variables

### Deployment
- **Frontend**: Vercel
- **Backend**: Render.com
- **Database**: MongoDB Atlas

## Project Structure

```
carrentalapp/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Carcard.jsx
│   │   │   ├── Featuredsection.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Login.jsx
│   │   │   └── owner/               # Owner-specific components
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Cars.jsx
│   │   │   ├── Cardetails.jsx
│   │   │   ├── Mybookings.jsx
│   │   │   └── owner/               # Owner pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Addcar.jsx
│   │   │       ├── ManageCars.jsx
│   │   │       ├── Managebookings.jsx
│   │   ├── assets/                  # Images and icons
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.local                   # Local development env vars
│   ├── .env.production              # Production env vars
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── server/                          # Express backend
│   ├── routes/
│   │   ├── userRoutes.js            # User authentication & profile
│   │   ├── ownerroutes.js           # Car listing & management
│   │   └── bookingRoutes.js         # Booking management
│   ├── controllers/
│   │   ├── usercontroller.js
│   │   ├── ownercontroller.js
│   │   └── bookingController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   └── Booking.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── multer.js                # File upload handling
│   ├── configs/
│   │   ├── db.js                    # MongoDB connection
│   │   └── imagekit.js
│   ├── server.js                    # Main server file
│   ├── package.json
│   └── .env                         # Server environment variables
│
├── vercel.json                      # Vercel deployment config
└── README.md
```

## Features

### User Features
- Browse available cars
- Filter cars by search
- View car details
- Book cars with date selection
- View booking history
- User authentication (login/register)
- Profile management

### Owner Features
- Dashboard with statistics
- Add new cars to inventory
- Manage car listings
- Toggle car availability
- View bookings for their cars
- Manage booking requests

## Environment Variables

### Frontend (.env.local for development, .env.production for production)
```
VITE_API_URL=http://localhost:3020        # Local development
VITE_CURRENCY=$
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://devpatel:dev123@cluster0.hgjvbxn.mongodb.net/car-rental
JWT_SECRET=secret@123
NODE_ENV=production
PORT=3020
```

## Installation & Setup

### Prerequisites
- Node.js 24.x
- npm or yarn
- MongoDB Atlas account

### Frontend Setup
```bash
cd client
npm install
npm run dev          # Development
npm run build        # Production build
```

### Backend Setup
```bash
cd server
npm install
npm start            # Development & production
```

## API Endpoints

### User Routes (`/api/user`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /data` - Get user profile (protected)

### Owner Routes (`/api/owner`)
- `POST /changerole` - Change user role to owner (protected)
- `GET /cars` - Get all cars
- `GET /cars/:id` - Get car by ID
- `POST /add-car` - Add new car (protected)
- `DELETE /cars/:id` - Delete car (protected)
- `GET /bookings` - Get owner's bookings (protected)

### Booking Routes (`/api/booking`)
- `POST /create` - Create booking (protected)
- `GET /user-bookings` - Get user's bookings (protected)
- `GET /owner-bookings` - Get owner's bookings (protected)
- `PUT/:id` - Update booking status (protected)

## Key Features Implementation

### Authentication
- JWT-based authentication
- Tokens stored in localStorage
- Protected routes on frontend and backend
- Role-based access (user/owner)

### Image Handling
- Local assets stored in `client/src/assets`
- Backend serves images via `/src/assets` endpoint
- Frontend constructs full URLs: `${apiUrl}/src/assets/car_image.png`

### Database
- MongoDB Atlas with connection pooling (2-10 connections)
- Automatic car seeding on server startup
- Default owner account created automatically

### CORS
- Enabled for localhost (5175, 5176, 3020)
- Configured for Vercel and Render domains
- Supports all standard HTTP methods

## Deployment

### Vercel (Frontend)
1. Connect GitHub repo to Vercel
2. Set Root Directory to `client`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set VITE_API_URL to your Render backend URL

### Render (Backend)
1. Create new Web Service on Render.com
2. Connect GitHub repo
3. Build Command: `cd server && npm install`
4. Start Command: `cd server && npm start`
5. Add Environment Variables:
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV=production

## Running Locally

1. Start backend:
```bash
cd server
npm start
```

2. Start frontend (in another terminal):
```bash
cd client
npm run dev
```

3. Access at `http://localhost:5175`

## Database Schema

### User
- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: String (user/owner)
- `createdAt`, `updatedAt`: Timestamp

### Car
- `_id`: ObjectId
- `owner`: ObjectId (ref: User)
- `brand`: String
- `model`: String
- `image`: String (path to image)
- `year`: Number
- `category`: String
- `seating_capacity`: Number
- `fuel_type`: String
- `transmission_type`: String
- `price_pday`: Number
- `location`: String
- `description`: String
- `is_available`: Boolean
- `createdAt`, `updatedAt`: Timestamp

### Booking
- `_id`: ObjectId
- `user`: ObjectId (ref: User)
- `car`: ObjectId (ref: Car)
- `pickupDate`: Date
- `returnDate`: Date
- `totalPrice`: Number
- `status`: String (pending/confirmed/completed/cancelled)
- `createdAt`, `updatedAt`: Timestamp

## Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Protected routes on backend
- CORS properly configured
- Environment variables for sensitive data
- Input validation on forms

## Performance

- Connection pooling for database
- Static asset serving from backend
- Responsive design for all devices
- Optimized images
- Lazy loading components

## Responsive Design

- Mobile: 1 column (< 640px)
- Tablet: 2 columns (640px - 1024px)
- Desktop: 3 columns (> 1024px)
- Flexible layouts with Tailwind CSS

## License

MIT
