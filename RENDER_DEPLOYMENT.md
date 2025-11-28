# Render.com Deployment Steps for Car Rental App

## Quick Start (5 minutes)

### Backend Deployment
1. **Go to Render.com** → https://render.com
2. **Sign up** with GitHub account
3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Select your GitHub repo
   - Name: `carental-api`
   - Environment: `Node`
   - Build: `cd server && npm install`
   - Start: `cd server && npm start`
4. **Add Environment Variables** (in Render dashboard):
   ```
   MONGODB_URI=mongodb+srv://devpatel:dev123@cluster0.hgjvbxn.mongodb.net/car-rental
   JWT_SECRET=secret@123
   NODE_ENV=production
   ```
5. **Deploy** - Click "Create Web Service"
6. **Wait for logs** - Look for "✓ Server listening on port 3020"
7. **Get URL** - Copy your render URL (e.g., `https://carental-api.onrender.com`)

### Frontend Deployment (Vercel)
1. **Go to Vercel.com** → https://vercel.com
2. **Import Project**:
   - Sign in with GitHub
   - Select your repo
3. **Configure**:
   - Framework: `Vite`
   - Root Directory: `client`
   - Build: `npm run build`
4. **Environment Variables**:
   - `VITE_API_URL=https://carental-api.onrender.com`
5. **Deploy** - Click "Deploy"
6. **Get URL** - Your Vercel URL (e.g., `https://carental.vercel.app`)

---

## Testing Production

1. Open your **Vercel URL** in browser
2. Test:
   - ✅ Cars load from MongoDB
   - ✅ Login works
   - ✅ Chatbot responds (NLP engine)
   - ✅ Can book cars
   - ✅ My Bookings page works

---

## Important Notes

- **MongoDB** is already on Atlas (no setup needed)
- **NLP Chatbot** works locally (no API keys!)
- **Render free tier** has sleep after 15 min idle (upgrade if needed)
- **Both services auto-deploy on GitHub push** to `main`

---

## If Something Goes Wrong

**Backend not starting:**
```
Check Render logs → look for MongoDB connection error
```

**Frontend can't reach backend:**
```
Check browser console → network tab
Verify VITE_API_URL in Vercel environment variables
```

**Questions?**
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

---

✅ **You're ready to deploy!**
