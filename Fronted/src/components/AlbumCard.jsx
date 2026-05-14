import { Link } from "react-router-dom";
import { Disc3 } from "lucide-react";

export default function AlbumCard({ album }) {
  return (
    // Navigate to /albums/:id on click — matches the new route
    <Link
      to={`/albums/${album._id}`}
      className="block bg-zinc-900 hover:bg-zinc-800 transition p-4 rounded-3xl cursor-pointer group"
    >
      {/* Album artwork */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80"
          alt={album.title}
          className="w-full aspect-square rounded-2xl object-cover"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <Disc3 size={32} className="text-green-400" />
        </div>
      </div>

      <div className="mt-4">
        {/* album.title — from backend albumSchema */}
        <h2 className="font-bold text-base leading-tight truncate">{album.title}</h2>
        {/* album.artist.username — from backend .populate('artist','username') */}
        <p className="text-zinc-400 text-sm mt-1 truncate">
          {album.artist?.username || "Unknown Artist"}
        </p>
      </div>
    </Link>
  );
}