import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useAuth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useRegister();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register.mutateAsync({ username, fullName, email, password });
      navigate("/dashboard"); // go straight to dashboard after registration
    } catch {
      /* error surfaced via register.error */
    }
  }

  const githubAuthUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/github`;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-md p-8 sm:p-10 animate-scale-in relative overflow-hidden">
        {/* Glow corner accent */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-magenta-600/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-violet-600/25 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-magenta-500 items-center justify-center text-white text-xl mb-4 shadow-[0_0_20px_rgba(124,58,237,0.5)]">
            ⚡
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-lavender-50">
            Create an account
          </h1>
          <p className="text-sm text-lavender-300/70 mt-1">
            Join the DevConnect builder community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-lavender-300 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input w-full px-4 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-lavender-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="glass-input w-full px-4 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-lavender-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full px-4 py-2.5 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-lavender-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full px-4 py-2.5 text-sm"
              required
            />
          </div>

          {register.isError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 text-center font-medium">
              {(register.error as any)?.message ||
                (register.error as any)?.response?.data?.message ||
                "Failed to register account"}
            </div>
          )}

          <button
            type="submit"
            disabled={register.isPending}
            className="btn-primary btn-shimmer w-full py-3 text-sm font-semibold tracking-wide disabled:opacity-60 mt-2"
          >
            {register.isPending ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-dark-base/80 text-xs text-lavender-300/60 uppercase tracking-wider">
            or continue with
          </span>
        </div>

        <a
          href={githubAuthUrl}
          className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium hover:text-white"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          Continue with GitHub
        </a>

        <p className="text-xs text-lavender-300/70 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-400 hover:text-magenta-400 font-semibold transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

