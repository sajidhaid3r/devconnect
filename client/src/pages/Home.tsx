import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Home() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 sm:py-16 px-4 sm:px-6">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(124,58,237,0.2)]">
          <span className="w-2 h-2 rounded-full bg-magenta-400 animate-pulse" />
          The Modern Developer Network & Portfolio Platform
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.1] mb-6">
          Connect, Build & Showcase on{" "}
          <span className="gradient-headline block sm:inline">DevConnect</span>
        </h1>

        <p className="text-lavender-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Create your verified developer profile, showcase world-class projects, publish technical engineering insights, and endorse fellow builders.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          {user ? (
            <Link
              to="/dashboard"
              className="btn-primary btn-shimmer w-full sm:w-auto px-8 py-3.5 text-base font-semibold tracking-wide shadow-xl shadow-violet-600/30 text-center"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="btn-primary btn-shimmer w-full sm:w-auto px-8 py-3.5 text-base font-semibold tracking-wide shadow-xl shadow-violet-600/30 text-center"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="btn-secondary w-full sm:w-auto px-8 py-3.5 text-base font-medium text-center"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Floating Glass Stat Strip */}
      <div className="max-w-4xl mx-auto w-full mt-16">
        <div className="glass-card p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="font-display text-2xl sm:text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              10K+
            </p>
            <p className="text-xs sm:text-sm text-lavender-300/80 font-medium">Active Developers</p>
          </div>
          <div className="space-y-1">
            <p className="font-display text-2xl sm:text-4xl font-bold bg-gradient-to-r from-magenta-400 to-pink-400 bg-clip-text text-transparent">
              25K+
            </p>
            <p className="text-xs sm:text-sm text-lavender-300/80 font-medium">Projects Built</p>
          </div>
          <div className="space-y-1">
            <p className="font-display text-2xl sm:text-4xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              50K+
            </p>
            <p className="text-xs sm:text-sm text-lavender-300/80 font-medium">Endorsements</p>
          </div>
          <div className="space-y-1">
            <p className="font-display text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              99.9%
            </p>
            <p className="text-xs sm:text-sm text-lavender-300/80 font-medium">Uptime Reliability</p>
          </div>
        </div>
      </div>
    </div>
  );
}

