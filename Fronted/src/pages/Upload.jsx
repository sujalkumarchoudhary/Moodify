import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function Upload() {
  // ─── Music upload state ────────────────────────────────────────────────────
  const [musicFile, setMusicFile] = useState(null);
  const [musicTitle, setMusicTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ─── Album state ──────────────────────────────────────────────────────────
  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedMusicIds, setSelectedMusicIds] = useState([]);
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  // Fetched music list for album song-picker
  // Backend: GET /api/music → { musics: [{ _id, name, artist }] }
  const [allMusics, setAllMusics] = useState([]);
  const [loadingMusics, setLoadingMusics] = useState(true);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const res = await api.get("/api/music");
        setAllMusics(res.data.musics);
      } catch (err) {
        console.error("Failed to fetch musics:", err);
      } finally {
        setLoadingMusics(false);
      }
    };
    fetchMusics();
  }, [uploadSuccess]); // re-fetch after a new upload so newly uploaded songs appear

  // ─── Upload music ─────────────────────────────────────────────────────────
  // Backend: POST /api/music/upload
  //   body (FormData): title, music (file)
  //   artist is read from JWT — NOT sent from frontend
  const uploadMusic = async (e) => {
    e.preventDefault();
    if (!musicFile) return alert("Please select an audio file.");

    setUploading(true);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append("title", musicTitle);
      formData.append("music", musicFile); // field name must be "music" (multer config)

      await api.post("/api/music/upload", formData);

      setMusicTitle("");
      setMusicFile(null);
      setUploadSuccess(true);
      alert("Music uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // ─── Create album ─────────────────────────────────────────────────────────
  // Backend: POST /api/music/album
  //   body: { title: string, musics: [ObjectId, ...] }
  //   artist is read from JWT — NOT sent from frontend
  const createAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle.trim()) return alert("Album title is required.");

    setCreatingAlbum(true);
    try {
      await api.post("/api/music/album", {
        title: albumTitle,
        musics: selectedMusicIds, // array of _id strings
      });

      setAlbumTitle("");
      setSelectedMusicIds([]);
      alert("Album created successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create album.");
    } finally {
      setCreatingAlbum(false);
    }
  };

  // Toggle a song in/out of the album selection
  const toggleMusicSelection = (id) => {
    setSelectedMusicIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <MainLayout>
      <div className="grid md:grid-cols-2 gap-8">

        {/* ── UPLOAD MUSIC ──────────────────────────────────────────────────── */}
        <div className="bg-zinc-900 rounded-[30px] p-6 border border-zinc-800">
          <h1 className="text-3xl font-black">Upload Music</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Share your latest tracks with listeners
          </p>

          <form onSubmit={uploadMusic} className="mt-8 space-y-5">
            {/* Title — maps to backend musicModel.name */}
            <div>
              <label className="text-sm text-zinc-400">Song Title</label>
              <input
                type="text"
                placeholder="Enter song title"
                value={musicTitle}
                required
                onChange={(e) => setMusicTitle(e.target.value)}
                className="w-full mt-2 bg-zinc-800 rounded-2xl p-4 outline-none border border-zinc-700 focus:border-green-500 transition"
              />
            </div>

            {/* Audio file — multer field name must be "music"
                Using a hidden input + custom label to prevent the native
                file input from inserting a long filename into the DOM,
                which causes horizontal overflow and makes mobile unresponsive */}
            <div>
              <label className="text-sm text-zinc-400">Audio File</label>

              {/* Hidden real input */}
              <input
                id="audio-file-input"
                type="file"
                accept="audio/*"
                className="sr-only" /* visually hidden but accessible */
                onChange={(e) => setMusicFile(e.target.files[0] || null)}
              />

              {/* Custom trigger button — clicking this opens the file picker */}
              <label
                htmlFor="audio-file-input"
                className="mt-2 w-full flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 hover:border-green-500 rounded-2xl p-4 cursor-pointer transition group"
              >
                <span className="text-2xl">🎵</span>
                <span className="text-sm font-semibold text-zinc-300 group-hover:text-green-400 transition">
                  {musicFile ? "Change Audio File" : "Choose Audio File"}
                </span>
              </label>
            </div>

            {/* Selected file preview — fully bounded, filename always truncated */}
            {musicFile && (
              <div className="bg-zinc-800 border border-green-500/30 p-4 rounded-2xl flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0 text-lg">
                  🎵
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-xs text-zinc-400">Selected file</p>
                  {/* truncate prevents long filenames from overflowing */}
                  <p className="font-bold text-sm truncate">{musicFile.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {(musicFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {/* Clear button */}
                <button
                  type="button"
                  onClick={() => {
                    setMusicFile(null);
                    // Reset the hidden input so the same file can be re-selected
                    document.getElementById("audio-file-input").value = "";
                  }}
                  className="shrink-0 text-zinc-500 hover:text-red-400 transition text-lg leading-none"
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            )}


            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-green-500 text-black font-black py-4 rounded-2xl hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading…" : "Upload Music"}
            </button>
          </form>
        </div>

        {/* ── CREATE ALBUM ──────────────────────────────────────────────────── */}
        <div className="bg-zinc-900 rounded-[30px] p-6 border border-zinc-800">
          <h1 className="text-3xl font-black">Create Album</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Group your songs into an album
          </p>

          <form onSubmit={createAlbum} className="mt-8 space-y-5">
            {/* Album title — maps to albumModel.title */}
            <div>
              <label className="text-sm text-zinc-400">Album Title</label>
              <input
                type="text"
                placeholder="Enter album title"
                value={albumTitle}
                required
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="w-full mt-2 bg-zinc-800 rounded-2xl p-4 outline-none border border-zinc-700 focus:border-green-500 transition"
              />
            </div>

            {/* Music picker — maps to albumModel.musics (array of ObjectIds) */}
            <div>
              <label className="text-sm text-zinc-400">
                Add Songs{" "}
                <span className="text-zinc-600">
                  ({selectedMusicIds.length} selected)
                </span>
              </label>

              <div className="mt-2 bg-zinc-800 rounded-2xl p-3 max-h-52 overflow-y-auto space-y-1">
                {loadingMusics ? (
                  <p className="text-zinc-500 text-sm text-center py-4">Loading songs…</p>
                ) : allMusics.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-4">
                    No songs yet. Upload some first.
                  </p>
                ) : (
                  allMusics.map((song) => {
                    const selected = selectedMusicIds.includes(song._id);
                    return (
                      <button
                        key={song._id}
                        type="button"
                        onClick={() => toggleMusicSelection(song._id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                          selected
                            ? "bg-green-500/20 border border-green-500/50"
                            : "hover:bg-zinc-700"
                        }`}
                      >
                        {/* Checkbox indicator */}
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                            selected ? "bg-green-500 border-green-500" : "border-zinc-600"
                          }`}
                        >
                          {selected && <span className="text-black text-xs font-black">✓</span>}
                        </div>

                        <div className="min-w-0">
                          {/* song.name from backend musicModel */}
                          <p className="font-semibold text-sm truncate">{song.name}</p>
                          {/* song.artist.username from backend populate */}
                          <p className="text-zinc-400 text-xs">{song.artist?.username}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={creatingAlbum}
              className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingAlbum ? "Creating…" : "Create Album"}
            </button>
          </form>
        </div>

      </div>
    </MainLayout>
  );
}