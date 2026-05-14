import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/"); // logged in right after register
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        {/* Branding */}
        <h1 className="text-3xl font-black text-green-500 text-center mb-8">Moodify</h1>

        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Create Account
          </h2>

          {error && (
            <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-2xl px-4 py-3 text-center">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <input
              type="text"
              placeholder="Username"
              className="w-full p-4 rounded-2xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 rounded-2xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-2xl bg-zinc-800 outline-none"
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <select
              className="w-full p-4 rounded-2xl bg-zinc-800 outline-none text-white"
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            >
              <option value="user">User</option>
              <option value="artist">Artist</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-black font-bold py-4 rounded-2xl hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="text-center text-zinc-400 mt-5 text-sm">
            Already have account?{" "}
            <Link
              to="/login"
              className="text-green-500 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}