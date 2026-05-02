# Deployment Guide - Vertex Ecommerce

This project is a MERN stack application. To deploy it on platforms like Vercel or Netlify, you need to follow these steps.

## Option 1: Vercel (Recommended for Full Stack)

Vercel can host both your Frontend and Backend in a single project.

### 1. Configure Vercel
I have already added a `vercel.json` and a root `package.json` to your project. These tell Vercel:
- To treat `ecommerce-backend/server.js` as a Node.js function.
- To build the React app in `ecommerce-frontend`.
- To route all `/api/*` requests to the backend.

### 2. Environment Variables
In your Vercel Project Settings, add the following Environment Variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://...`).
- `JWT_SECRET`: A secret string for your tokens.
- `NODE_ENV`: Set to `production`.

### 3. Deploy
1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Vercel will automatically detect the settings from `vercel.json`.

---

## Option 2: Netlify (Frontend) + Render/Railway (Backend)

Netlify is excellent for static frontends, but a persistent Express server is better hosted on **Render** or **Railway**.

### 1. Deploy Backend on Render
1. Create a new "Web Service" on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set **Root Directory** to `ecommerce-backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `node server.js`.
6. Add your Environment Variables (`MONGODB_URI`, `JWT_SECRET`).

### 2. Deploy Frontend on Netlify
1. Create a new site on [Netlify](https://www.netlify.com/).
2. Connect your GitHub repository.
3. Set **Base Directory** to `ecommerce-frontend`.
4. Set **Build Command** to `npm run build`.
5. Set **Publish Directory** to `ecommerce-frontend/build`.
6. Add an Environment Variable:
   - `REACT_APP_API_URL`: The URL of your backend on Render (e.g., `https://your-backend.onrender.com/api`).

---

## Important Notes
- **MongoDB Atlas**: Ensure your MongoDB database is hosted on MongoDB Atlas and that you have added `0.0.0.0/0` (Allow all) to your IP Access List so your serverless functions can connect.
- **Proxy**: The `"proxy": "http://localhost:5001"` in `ecommerce-frontend/package.json` only works during local development. Deployment relies on the `REACT_APP_API_URL` variable.
