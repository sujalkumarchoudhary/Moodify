import {
  Home,
  Music2,
  Disc3,
  Upload,
  LogOut,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen p-5 hidden md:flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold text-green-500 mb-10">
          Moodify
        </h1>

        <div className="space-y-2">
          <SidebarItem
            icon={<Home size={20} />}
            title="Home"
            link="/"
            active={isActive("/")}
          />

          <SidebarItem
            icon={<Disc3 size={20} />}
            title="Albums"
            link="/albums"
            active={isActive("/albums")}
          />

          {/* Only artists can see the Upload button */}
          {user?.role === "artist" && (
            <SidebarItem
              icon={<Upload size={20} />}
              title="Upload"
              link="/upload"
              active={isActive("/upload")}
            />
          )}
        </div>
      </div>

      {/* Bottom section: user info + logout */}
      <div>
        {user && (
          <div className="mb-4 px-4 py-3 bg-zinc-900 rounded-2xl">
            <p className="text-sm font-bold truncate">{user.username}</p>
            <p className="text-xs text-zinc-400 capitalize">{user.role}</p>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-zinc-900 transition text-zinc-400 hover:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, title, link, active }) {
  return (
    <Link
      to={link}
      className={`flex items-center gap-3 p-4 rounded-2xl transition font-medium ${
        active
          ? "bg-green-500 text-black"
          : "hover:bg-zinc-900 text-zinc-300 hover:text-white"
      }`}
    >
      {icon}
      {title}
    </Link>
  );
}