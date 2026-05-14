import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Backend uses: $or: [{ username }, { email }]
      // Send identifier as BOTH fields — whichever matches will be used
      await login({ email: identifier, username: identifier, password });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || "Invalid credentials. Please try again.");
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
          <h2 className="text-3xl md:text-4xl font-bold text-center">Welcome Back</h2>

          <p className="text-zinc-400 text-center mt-2 text-sm">
            Login with your email or username
          </p>

          {/* Error message */}
          {error && (
            <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-2xl px-4 py-3 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Single field — accepts email OR username */}
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                Email or Username
              </label>
              <input
                type="text"
                placeholder="you@example.com or your_username"
                value={identifier}
                required
                autoComplete="username"
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full mt-2 p-4 rounded-2xl bg-zinc-800 outline-none border border-zinc-700 focus:border-green-500 transition placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                required
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-4 rounded-2xl bg-zinc-800 outline-none border border-zinc-700 focus:border-green-500 transition placeholder-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-black font-bold py-4 rounded-2xl hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="text-center text-zinc-400 mt-5 text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-green-500 font-semibold">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}