import { Play, Pause, Music } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function BottomPlayer() {
  const { currentSong, isPlaying, progress, togglePlay } = usePlayer();

  return (
    <div className="fixed bottom-0 left-0 md:left-64 right-0 h-[68px] bg-zinc-950 border-t border-zinc-800 z-30 flex flex-col">
      {/* Progress bar — fills green based on playback progress */}
      <div className="h-0.5 bg-zinc-800 w-full">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Player controls */}
      <div className="flex-1 flex items-center justify-between px-4">
        {/* Song info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
            <Music size={16} className="text-green-500" />
          </div>

          <div className="min-w-0">
            <p className="font-bold text-sm truncate">
              {currentSong ? currentSong.name : "No song selected"}
            </p>
            <p className="text-zinc-400 text-xs truncate">
              {currentSong
                ? currentSong.artist?.username || "Unknown Artist"
                : "Tap a song to play"}
            </p>
          </div>
        </div>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={!currentSong}
          className="bg-green-500 p-2.5 rounded-full hover:scale-110 transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          {isPlaying ? (
            <Pause fill="black" color="black" size={18} />
          ) : (
            <Play fill="black" color="black" size={18} />
          )}
        </button>
      </div>
    </div>
  );
}