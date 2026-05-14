import { Home, Disc3, Upload, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MobileNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    // Sits just above the BottomPlayer (which is 68px tall → bottom-[68px])
    // Only visible on mobile (md:hidden)
    <div className="fixed bottom-[68px] left-0 right-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800">
      <div className="flex items-center justify-around px-2 py-2">
        <MobileNavItem
          icon={<Home size={22} />}
          label="Home"
          to="/"
          active={isActive("/")}
        />

        <MobileNavItem
          icon={<Disc3 size={22} />}
          label="Albums"
          to="/albums"
          active={isActive("/albums")}
        />

        {/* Upload only shown for artists */}
        {user?.role === "artist" && (
          <MobileNavItem
            icon={<Upload size={22} />}
            label="Upload"
            to="/upload"
            active={isActive("/upload")}
          />
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-zinc-400 hover:text-red-400 transition"
        >
          <LogOut size={22} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

function MobileNavItem({ icon, label, to, active }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition ${
        active ? "text-green-500" : "text-zinc-400 hover:text-white"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
