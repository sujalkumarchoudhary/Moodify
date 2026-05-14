import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  // Dynamic greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-zinc-800 p-4">

      {/* Mobile layout: Moodify brand + user badge in one row */}
      <div className="flex items-center justify-between md:hidden mb-3">
        <h1 className="text-2xl font-bold text-green-500">Moodify</h1>

        {user && (
          <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black text-xs font-bold">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs font-medium capitalize text-zinc-300">
              {user.role}
            </span>
          </div>
        )}
      </div>

      {/* Main row — greeting + search */}
      <div className="flex items-center justify-between gap-4">

        {/* Greeting (desktop only — on mobile we show Moodify brand above) */}
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold">
            {greeting} {user ? `👋 ${user.username}` : "🎵"}
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Enjoy your music journey
          </p>
        </div>

        {/* Search bar — always visible (full width on mobile, fixed width on desktop) */}
        <div className="flex items-center bg-zinc-900 rounded-full px-4 py-3 w-full md:w-80">
          <Search size={18} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search songs, albums..."
            className="bg-transparent outline-none ml-3 w-full text-sm placeholder-zinc-500"
          />
        </div>
      </div>
    </div>
  );
}