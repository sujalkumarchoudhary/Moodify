import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import MusicCard from "../components/MusicCard";
import api from "../services/api";

export default function Home() {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMusics = async () => {
    try {
      const res = await api.get("/api/music");

      setMusics(res.data.musics);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusics();
  }, []);

  return (
    <MainLayout>
      {/* HERO SECTION */}

      <div className="bg-gradient-to-r from-green-500 to-emerald-700 rounded-[30px] p-6 md:p-10 overflow-hidden relative">
        <div className="max-w-xl">
          <p className="uppercase tracking-widest text-sm text-white/70">
            Music For Everyone
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-3 leading-tight">
            Feel The Beat
          </h1>

          <p className="mt-4 text-white/80 text-sm md:text-base">
            Stream unlimited songs, albums and playlists
            anywhere anytime.
          </p>

          <button className="mt-6 bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition">
            Explore Music
          </button>
        </div>

        <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* TRENDING */}

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Trending Songs
          </h1>

          <button className="text-green-500">
            View All
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-zinc-900 rounded-3xl p-4 animate-pulse">
                <div className="bg-zinc-800 aspect-square rounded-2xl" />
                <div className="h-4 bg-zinc-800 rounded mt-4" />
                <div className="h-3 bg-zinc-800 rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : musics.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-5xl mb-4">🎵</p>
            <p className="text-lg font-semibold">No songs yet</p>
            <p className="text-sm mt-1">Artists can upload songs from the Upload page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
            {musics.map((music) => (
              <MusicCard key={music._id} music={music} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}