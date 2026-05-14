import { Play, Pause } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function MusicCard({ music }) {
  const { currentSong, isPlaying, playSong } = usePlayer();

  // Is this card the currently loaded song?
  const isActive = currentSong?._id === music._id;

  return (
    <div
      className={`p-4 rounded-3xl group cursor-pointer transition ${
        isActive ? "bg-zinc-800 ring-2 ring-green-500" : "bg-zinc-900 hover:bg-zinc-800"
      }`}
      onClick={() => playSong(music)}
    >
      {/* Artwork */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80"
          alt={music.name}
          className="w-full aspect-square object-cover rounded-2xl"
        />

        {/* Play / Pause button overlay */}
        <div
          className={`absolute bottom-3 right-3 bg-green-500 p-3 rounded-full transition-all ${
            isActive ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
          }`}
        >
          {isActive && isPlaying ? (
            <Pause fill="black" size={18} color="black" />
          ) : (
            <Play fill="black" size={18} color="black" />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4">
        <h2 className={`font-bold text-base leading-tight ${isActive ? "text-green-400" : ""}`}>
          {music.name}
        </h2>
        <p className="text-zinc-400 text-sm mt-1">
          {music.artist?.username || "Unknown Artist"}
        </p>
      </div>
    </div>
  );
}