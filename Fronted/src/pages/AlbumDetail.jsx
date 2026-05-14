import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MusicCard from "../components/MusicCard";
import { usePlayer } from "../context/PlayerContext";
import api from "../services/api";
import { ArrowLeft, Play, Disc3 } from "lucide-react";

export default function AlbumDetail() {
  const { id } = useParams(); // album _id from /albums/:id
  const navigate = useNavigate();
  const { playSong } = usePlayer();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        // GET /api/music/albums/:id
        // Response: { album: { _id, title, artist: { username }, musics: [{ _id, name, uri, artist: { username } }] } }
        const res = await api.get(`/api/music/albums/${id}`);
        setAlbum(res.data.album);
      } catch (err) {
        console.error("Failed to fetch album:", err);
        setError("Album not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  // Play the first song of the album
  const playAll = () => {
    if (album?.musics?.length > 0) {
      playSong(album.musics[0]);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-8 bg-zinc-800 rounded-full" />
          <div className="flex gap-6">
            <div className="w-48 h-48 bg-zinc-800 rounded-3xl shrink-0" />
            <div className="space-y-4 flex-1 pt-4">
              <div className="h-4 bg-zinc-800 rounded w-1/4" />
              <div className="h-10 bg-zinc-800 rounded w-2/3" />
              <div className="h-4 bg-zinc-800 rounded w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-zinc-900 rounded-3xl p-4">
                <div className="bg-zinc-800 aspect-square rounded-2xl" />
                <div className="h-4 bg-zinc-800 rounded mt-4" />
                <div className="h-3 bg-zinc-800 rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-24 text-zinc-500">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={() => navigate("/albums")}
            className="mt-6 bg-green-500 text-black font-bold px-6 py-3 rounded-full"
          >
            Back to Albums
          </button>
        </div>
      </MainLayout>
    );
  }

  const songCount = album.musics?.length || 0;

  return (
    <MainLayout>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-6"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* ── Album header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-[30px] p-6 md:p-8">
        {/* Artwork */}
        <div className="w-40 h-40 md:w-52 md:h-52 shrink-0 bg-zinc-800 rounded-3xl flex items-center justify-center">
          <Disc3 size={60} className="text-green-500 opacity-60" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-green-500 font-bold">Album</p>

          {/* album.title — from backend albumModel.title */}
          <h1 className="text-4xl md:text-5xl font-black mt-2 leading-tight">
            {album.title}
          </h1>

          {/* album.artist.username — from backend .populate('artist','username') */}
          <p className="text-zinc-400 mt-3">
            by{" "}
            <span className="text-white font-semibold">
              {album.artist?.username || "Unknown Artist"}
            </span>
          </p>

          <p className="text-zinc-500 text-sm mt-1">
            {songCount} {songCount === 1 ? "song" : "songs"}
          </p>

          {/* Play All button */}
          {songCount > 0 && (
            <button
              onClick={playAll}
              className="mt-5 flex items-center gap-2 bg-green-500 text-black font-bold px-7 py-3 rounded-full hover:bg-green-400 hover:scale-105 transition"
            >
              <Play fill="black" size={18} />
              Play All
            </button>
          )}
        </div>
      </div>

      {/* ── Songs list ────────────────────────────────────────────────────── */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-5">Songs</h2>

        {songCount === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <p className="text-4xl mb-3">🎵</p>
            <p>No songs in this album yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {/* album.musics — populated by backend:
                each song: { _id, name, uri, artist: { username } } */}
            {album.musics.map((song) => (
              <MusicCard key={song._id} music={song} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
