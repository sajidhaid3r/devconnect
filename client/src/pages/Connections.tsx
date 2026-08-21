import { Link } from "react-router-dom";
import { useConnections } from "../hooks/useConnections";
import { useAuthStore } from "../store/authStore";
import DeveloperCard from "../components/DeveloperCard";

export default function Connections() {
  const { data, isLoading } = useConnections();
  const currentUser = useAuthStore((s) => s.user);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-slide-up">
        <div className="skeleton-glass h-10 w-48 rounded-xl mb-4" />
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-glass h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-lavender-50">
            Your Connections
          </h1>
          {data && data.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30 status-pulse">
              {data.length} active
            </span>
          )}
        </div>
        <Link
          to="/search"
          className="btn-secondary px-3.5 py-1.5 text-xs font-semibold"
        >
          Discover More →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 stagger-container">
        {data?.map((c: any) => {
          const other = c.requester.id === currentUser?.id ? c.addressee : c.requester;
          return (
            <div key={c.id} className="animate-stagger-item">
              <DeveloperCard {...other} />
            </div>
          );
        })}
      </div>

      {data?.length === 0 && (
        <div className="glass-card p-12 text-center max-w-lg mx-auto space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-magenta-500/20 border border-violet-400/30 flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(124,58,237,0.25)]">
            🤝
          </div>
          <h3 className="font-display font-semibold text-lg text-lavender-50">
            No connections yet
          </h3>
          <p className="text-sm text-lavender-300/70 leading-relaxed">
            Expand your network by finding and connecting with developers building next-generation projects.
          </p>
          <Link
            to="/search"
            className="btn-primary btn-shimmer inline-block px-5 py-2.5 text-xs font-semibold"
          >
            Explore Developers
          </Link>
        </div>
      )}
    </div>
  );
}

