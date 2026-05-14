const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');

const app = express();

// Build an allowed-origins list from env:
//   FRONTEND_URL in production (e.g. https://moodify.vercel.app)
//   falls back to accepting any localhost port for local dev
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : [];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman, mobile apps)
        if (!origin) return callback(null, true);

        // Allow configured production origin
        if (allowedOrigins.includes(origin)) return callback(null, true);

        // Allow any localhost port in development
        if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);

        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;