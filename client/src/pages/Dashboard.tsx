import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { useRespondConnection } from "../hooks/useConnections";
import DeveloperCard from "../components/DeveloperCard";

function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    const duration = 1200;
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easeOut * target));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    const animId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animId);
  }, [target]);

  return <span>{count}</span>;
}

export default function Dashboard() {
  const { data, isLoading } = useDashboard();
  const respond = useRespondConnection();

  if (isLoading || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-slide-up">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-glass h-24 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton-glass h-48 rounded-2xl" />
        <div className="skeleton-glass h-48 rounded-2xl" />
      </div>
    );
  }

  const { stats, pendingRequests, trendingPosts, suggestions } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-slide-up">
      {/* Stat Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-container">
        {[
          ["Connections", stats.connectionCount, "from-violet-400 to-indigo-300"],
          ["Endorsements", stats.endorsementCount, "from-magenta-400 to-pink-300"],
          ["Projects", stats.projectCount, "from-amber-300 to-amber-500"],
          ["Posts", stats.postCount, "from-emerald-400 to-teal-300"],
        ].map(([label, value, gradientClass]) => (
          <div
            key={label as string}
            className="glass-card-lift p-5 text-center flex flex-col justify-center animate-stagger-item"
          >
            <p className={`font-display text-3xl sm:text-4xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
              <AnimatedCount target={value as number} />
            </p>
            <p className="text-xs sm:text-sm text-lavender-300/70 font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Pending Connection Requests */}
      {pendingRequests.length > 0 && (
        <section className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-magenta-500 status-pulse" />
            <h2 className="font-display font-semibold text-lg text-lavender-50">
              Pending Connection Requests
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-magenta-500/20 text-magenta-300 font-bold border border-magenta-500/30">
              {pendingRequests.length}
            </span>
          </div>
          <div className="space-y-3 stagger-container">
            {pendingRequests.map((r: any) => (
              <div
                key={r.id}
                className="glass-card-lift p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-stagger-item"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-magenta-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                    {r.requester.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-lavender-50">{r.requester.fullName}</p>
                    <p className="text-xs text-lavender-300/60">@{r.requester.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => respond.mutate({ id: r.id, action: "ACCEPT" })}
                    className="btn-primary btn-shimmer px-4 py-1.5 text-xs font-semibold"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respond.mutate({ id: r.id, action: "REJECT" })}
                    className="btn-secondary px-3.5 py-1.5 text-xs font-medium text-lavender-300 hover:text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Suggested Developers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-lavender-50">
            Suggested Developers
          </h2>
          <Link
            to="/search"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Explore all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 stagger-container">
          {suggestions.map((u: any) => (
            <div key={u.id} className="animate-stagger-item">
              <DeveloperCard {...u} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Posts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-lavender-50">
            Trending Posts
          </h2>
          <Link
            to="/blog"
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Read blog →
          </Link>
        </div>
        <div className="space-y-3 stagger-container">
          {trendingPosts.map((p: any) => (
            <Link
              key={p.id}
              to={`/blog/${p.slug}`}
              className="glass-card-interactive block p-4 group animate-stagger-item"
            >
              <p className="font-display font-medium text-base text-lavender-50 group-hover:text-violet-300 transition-colors">
                {p.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-lavender-300/60">
                <span>by <strong className="text-lavender-200">{p.author.fullName}</strong></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

