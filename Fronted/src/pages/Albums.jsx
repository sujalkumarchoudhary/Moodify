import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import AlbumCard from "../components/AlbumCard";
import api from "../services/api";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlbums = async () => {
    try {
      // GET /api/music/albums → { albums: [{ _id, title, artist: { username } }] }
      const res = await api.get("/api/music/albums");
      setAlbums(res.data.albums);
    } catch (err) {
      console.error("Failed to fetch albums:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  // Use the first album as the featured one, fall back to a placeholder
  const featuredAlbum = albums[0] || null;

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black">Albums Collection</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            {loading ? "Loading…" : `${albums.length} album${albums.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      {/* FEATURED BANNER — shows first real album from API */}
      {!loading && featuredAlbum && (
        <div className="mt-8 bg-zinc-900 rounded-[30px] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80"
            alt={featuredAlbum.title}
            className="w-full md:w-64 aspect-square object-cover rounded-3xl shrink-0"
          />

          <div className="min-w-0">
            <p className="uppercase text-green-500 tracking-widest text-xs font-bold">
              Featured Album
            </p>

            {/* Real album title from backend */}
            <h2 className="text-4xl md:text-5xl font-black mt-3 leading-tight">
              {featuredAlbum.title}
            </h2>

            {/* Real artist name from backend — populated via .populate('artist','username') */}
            <p className="text-zinc-400 mt-2">
              by {featuredAlbum.artist?.username || "Unknown Artist"}
            </p>

            <p className="text-zinc-500 mt-3 text-sm leading-relaxed">
              Enjoy this curated collection of tracks.
            </p>
          </div>
        </div>
      )}

      {/* Loading skeleton for featured banner */}
      {loading && (
        <div className="mt-8 bg-zinc-900 rounded-[30px] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 animate-pulse">
          <div className="w-full md:w-64 aspect-square bg-zinc-800 rounded-3xl shrink-0" />
          <div className="w-full space-y-4">
            <div className="h-4 bg-zinc-800 rounded w-1/4" />
            <div className="h-10 bg-zinc-800 rounded w-2/3" />
            <div className="h-4 bg-zinc-800 rounded w-1/3" />
          </div>
        </div>
      )}

      {/* ALBUMS GRID */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-5">All Albums</h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-zinc-900 rounded-3xl p-4 animate-pulse">
                <div className="bg-zinc-800 aspect-square rounded-2xl" />
                <div className="h-4 bg-zinc-800 rounded mt-4" />
                <div className="h-3 bg-zinc-800 rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : albums.length === 0 ? (
          <p className="text-zinc-500 text-center py-16">
            No albums yet. Artists can create albums from the Upload page.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {albums.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}