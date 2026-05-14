<div align="center">

# 🎵 Moodify

### A full-stack music streaming app — discover songs, browse albums, and let artists share their music.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📸 Screenshots

### 🖥️ Desktop View

| Home | Albums | Upload |
|:----:|:------:|:------:|
| ![Desktop Home](screenshots/desktop-home.png) | ![Desktop Albums](screenshots/desktop-albums.png) | ![Desktop Upload](screenshots/desktop-upload.png) |

> **Add your screenshots:** Take a screenshot of each page and save them to a `screenshots/` folder at the root of the project.

---

### 📱 Mobile View

| Register | Home | Albums | Now Playing |
|:--------:|:----:|:------:|:-----------:|
| ![Mobile Register](screenshots/mobile-register.png) | ![Mobile Home](screenshots/mobile-home.png) | ![Mobile Albums](screenshots/mobile-albums.png) | ![Mobile Player](screenshots/mobile-player.png) |

---

## ✨ Features

- 🔐 **Authentication** — Register & login with email **or** username
- 🎭 **Role-based access** — `user` can stream, `artist` can upload
- 🎵 **Music streaming** — Click any song card to play it instantly
- 📻 **Persistent bottom player** — Progress bar, play/pause, song info
- 💿 **Albums** — Create albums, link songs, browse by artist
- ☁️ **Cloud storage** — Audio files stored on ImageKit CDN
- 📱 **Fully responsive** — Sidebar on desktop, bottom tab nav on mobile
- 🔒 **Secure cookies** — `httpOnly` JWT tokens, XSS-safe
- 🌙 **Dark UI** — Zinc/Green design system built with Tailwind CSS

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens | Authentication |
| bcrypt | Password hashing |
| ImageKit (`@imagekit/nodejs`) | Audio file CDN storage |
| Multer | Multipart file upload handling |
| CORS + cookie-parser | Security & cross-origin support |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework & dev server |
| React Router v6 | Client-side routing with route guards |
| Axios | HTTP client with cookie support |
| Tailwind CSS v4 | Utility-first styling |
| Lucide React | Icon library |
| Context API | Auth state + audio player state |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- ImageKit account (free tier works)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/moodify.git
cd moodify
```

---

### 2. Set up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file (use `.env.example` as a reference):

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net
JWT_SECRET=your_long_random_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
PORT=3000
NODE_ENV=development
# FRONTEND_URL=https://your-frontend.vercel.app   ← set in production
```

Start the backend:

```bash
npm run dev
```

The API will be running at **http://localhost:3000**

---

### 3. Set up the Frontend

```bash
cd ../Fronted
npm install
```

Create a `.env` file (optional for local dev):

```env
# Only needed in production — falls back to http://localhost:3000 in dev
# VITE_API_URL=https://your-backend.onrender.com
```

Start the frontend:

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Login (email **or** username) |
| `POST` | `/api/auth/logout` | — | Clear session cookie |

### Music — `/api/music`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/music` | User | Get all songs |
| `POST` | `/api/music/upload` | Artist | Upload a new song |
| `GET` | `/api/music/albums` | User | Get all albums |
| `POST` | `/api/music/album` | Artist | Create a new album |
| `GET` | `/api/music/albums/:id` | User | Get album + its songs |

---

## 🌍 Deployment

### Backend → [Render](https://render.com)

1. Create a new **Web Service** from your repo
2. Set **Build Command:** `npm install`
3. Set **Start Command:** `node server.js`
4. Add all environment variables from `.env.example`
5. Set `NODE_ENV=production` and `FRONTEND_URL=https://your-frontend.vercel.app`

### Frontend → [Vercel](https://vercel.com)

1. Import the `Fronted` folder as a new Vercel project
2. Set **Framework:** Vite
3. Set **Root Directory:** `Fronted`
4. Add `VITE_API_URL=https://your-backend.onrender.com`
5. Add `vercel.json` to the `Fronted` folder for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📁 Project Structure

```
Moodify/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # auth.controller.js, music.controller.js
│   │   ├── db/              # db.js (MongoDB connection)
│   │   ├── middlewares/     # auth.middleware.js (JWT + role check)
│   │   ├── models/          # user.model.js, music.model.js, album.model.js
│   │   ├── routes/          # auth.routes.js, music.routes.js
│   │   ├── services/        # storage.services.js (ImageKit)
│   │   └── app.js           # Express app + CORS config
│   ├── server.js            # Entry point
│   ├── .env.example
│   └── package.json
│
└── Fronted/
    ├── src/
    │   ├── components/      # Sidebar, Navbar, MusicCard, AlbumCard, BottomPlayer, MobileNav
    │   ├── context/         # AuthContext.jsx, PlayerContext.jsx
    │   ├── layouts/         # MainLayout.jsx
    │   ├── pages/           # Home, Albums, AlbumDetail, Upload, Login, Register
    │   └── services/        # api.js (Axios instance)
    ├── index.html
    ├── .env.example
    └── vite.config.js
```

---

## 🔐 Roles & Permissions

| Feature | User | Artist |
|---------|:----:|:------:|
| Browse & stream songs | ✅ | ✅ |
| Browse albums | ✅ | ✅ |
| Upload songs | ❌ | ✅ |
| Create albums | ❌ | ✅ |
| Upload button visible | ❌ | ✅ |

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ and 🎵 &nbsp;·&nbsp; <a href="https://github.com/your-username">@your-username</a>
</div>
