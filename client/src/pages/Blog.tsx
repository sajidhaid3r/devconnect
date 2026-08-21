import { Link } from "react-router-dom";
import { usePosts } from "../hooks/useBlog";

export default function Blog() {
  const { data, isLoading } = usePosts(1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-lavender-50">
            Developer Blog
          </h1>
          <p className="text-sm text-lavender-300/70 mt-1">
            Engineering insights, architecture deep-dives, and tutorials
          </p>
        </div>
        <Link
          to="/blog/new"
          className="btn-primary btn-shimmer px-4 py-2 text-xs font-semibold tracking-wide"
        >
          Write a Post ✍️
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-glass h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4 stagger-container">
          {data?.posts?.map((p: any) => (
            <Link
              key={p.id}
              to={`/blog/${p.slug}`}
              className="glass-card-interactive block p-6 group animate-stagger-item"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-lavender-50 group-hover:text-violet-300 transition-colors">
                    {p.title}
                  </h2>
                  <p className="text-sm text-lavender-300/80 mt-2 line-clamp-2 leading-relaxed">
                    {p.excerpt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5 text-xs text-lavender-300/60 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-violet-600/40 border border-violet-400/30 flex items-center justify-center text-[10px] text-white">
                    {p.author.fullName.charAt(0)}
                  </span>
                  by <strong className="text-lavender-200">{p.author.fullName}</strong>
                </span>
                <span>·</span>
                <span>@{p.author.username}</span>
              </div>
            </Link>
          ))}

          {data?.posts?.length === 0 && (
            <div className="glass-card p-12 text-center max-w-lg mx-auto space-y-4 my-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-magenta-500/20 border border-violet-400/30 flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(124,58,237,0.25)]">
                📝
              </div>
              <h3 className="font-display font-semibold text-lg text-lavender-50">
                No blog posts yet
              </h3>
              <p className="text-sm text-lavender-300/70 leading-relaxed">
                Be the first to publish a technical post or tutorial for the community.
              </p>
              <Link
                to="/blog/new"
                className="btn-primary btn-shimmer inline-block px-5 py-2.5 text-xs font-semibold"
              >
                Write First Post
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

