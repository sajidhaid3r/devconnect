import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useAuth";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-violet-400 via-magenta-400 to-amber-300 bg-clip-text text-transparent hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-magenta-500 flex items-center justify-center text-white text-base shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            ⚡
          </span>
          DevConnect
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-lavender-300 hover:text-lavender-50 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
              >
                Dashboard
              </Link>
              <Link
                to="/search"
                className="text-lavender-300 hover:text-lavender-50 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
              >
                Discover
              </Link>
              <Link
                to="/blog"
                className="text-lavender-300 hover:text-lavender-50 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
              >
                Blog
              </Link>
              <Link
                to="/connections"
                className="text-lavender-300 hover:text-lavender-50 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
              >
                Connections
              </Link>
              <Link
                to={`/profile/${user.username}`}
                className="text-lavender-300 hover:text-lavender-50 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
              >
                My Profile
              </Link>
              <button
                onClick={async () => {
                  await logout.mutateAsync();
                  navigate("/login");
                }}
                className="btn-secondary px-3.5 py-1.5 text-xs font-medium hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-lavender-300 hover:text-lavender-50 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-primary btn-shimmer px-4 py-2 text-xs uppercase tracking-wider font-semibold shadow-lg shadow-violet-500/20"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

