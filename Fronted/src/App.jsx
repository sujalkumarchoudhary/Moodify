import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumDetail from "./pages/AlbumDetail";
import Upload from "./pages/Upload";

// Redirects unauthenticated users to /register
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/register" replace />;
}

// Redirects already-logged-in users away from auth pages
function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

// Artist-only route — non-artists get sent to home
function ArtistRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/register" replace />;
  if (user.role !== "artist") return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* PlayerProvider wraps all routes so every page can control playback */}
        <PlayerProvider>
          <Routes>
            {/* Public routes — redirect to / if already logged in */}
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/albums" element={<ProtectedRoute><Albums /></ProtectedRoute>} />
            <Route path="/albums/:id" element={<ProtectedRoute><AlbumDetail /></ProtectedRoute>} />

            {/* Artist-only */}
            <Route path="/upload" element={<ArtistRoute><Upload /></ArtistRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/register" replace />} />
          </Routes>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;