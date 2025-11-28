# Deployment Guide - Render.com

## Backend Deployment (Node.js Server)

### Step 1: Prepare Backend for Production
1. Push all code to GitHub (✅ Already done)
2. Make sure `.env` is in `.gitignore` (for security)

### Step 2: Create Render Service
1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configuration:
   - **Name**: `carental-api` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Region**: Choose closest to you

### Step 3: Set Environment Variables
In Render dashboard, go to "Environment" and add:
```
MONGODB_URI=mongodb+srv://devpatel:dev123@cluster0.hgjvbxn.mongodb.net/car-rental
JWT_SECRET=secret@123
NODE_ENV=production
PORT=3020
```

### Step 4: Deploy
- Render will auto-deploy on GitHub push
- Watch deployment logs in Render dashboard
- Get your backend URL (e.g., `https://carental-api.onrender.com`)

---

## Frontend Deployment (React/Vite on Vercel)

### Step 1: Configure API URL for Production
Create `client/.env.production`:
```
VITE_API_URL=https://carental-api.onrender.com
```

Update `client/src/main.jsx` or API client to use:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020';
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configuration:
   - **Framework**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://carental-api.onrender.com
   ```

### Step 3: Deploy
- Vercel will auto-deploy on GitHub push
- Get your frontend URL (e.g., `https://carental-app.vercel.app`)

---

## Deployment Checklist

### Backend (Render)
- [ ] Code pushed to GitHub
- [ ] `.env` added to `.gitignore`
- [ ] Render service created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] API endpoints responding (test: `https://carental-api.onrender.com/api/cars`)

### Frontend (Vercel)
- [ ] `.env.production` created with correct API URL
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful
- [ ] App accessible at Vercel URL
- [ ] Chatbot can connect to backend API

---

## Testing After Deployment

1. Open your Vercel URL in browser
2. Test features:
   - View cars list (should load from MongoDB)
   - Login/Register (JWT should work)
   - Chat with AI chatbot (NLP engine should respond)
   - Book a car
   - Check "My Bookings"

---

## Troubleshooting

### Backend not responding
- Check Render logs: Dashboard → Service → Logs
- Verify MongoDB URI is correct
- Ensure all environment variables are set

### Frontend can't reach backend
- Check VITE_API_URL in Vercel environment variables
- Test API URL in browser console: `fetch('https://carental-api.onrender.com/api/cars')`
- Check browser console for CORS errors

### Build fails on Vercel
- Check build logs
- Ensure `npm run build` works locally
- Verify all dependencies are in `package.json`

---

## Auto-Deploy on Push

Both Render and Vercel watch your GitHub repository:
- Push to `main` branch → Auto deploy
- No manual deployment needed after initial setup

---

## Cost Information

**Render.com:**
- Free tier available (limited resources)
- Paid tier starts at $7/month for always-on services

**Vercel:**
- Free tier available (great for frontend)
- Paid tier for advanced features

---

## Next Steps

1. Create GitHub `.gitignore` entries for `.env`
2. Push code: `git push origin main`
3. Deploy backend to Render
4. Deploy frontend to Vercel
5. Test production URLs
6. Update any DNS/domain settings if needed

Good luck! 🚀
