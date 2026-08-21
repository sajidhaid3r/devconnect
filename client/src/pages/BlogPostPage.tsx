import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { usePost } from "../hooks/useBlog";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: post, isLoading } = usePost(slug);

  if (isLoading || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 animate-fade-slide-up">
        <div className="skeleton-glass h-12 w-3/4 rounded-xl" />
        <div className="skeleton-glass h-6 w-1/3 rounded-lg" />
        <div className="skeleton-glass h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-slide-up">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-xs text-lavender-300 hover:text-violet-300 font-medium mb-6 transition-colors"
      >
        ← Back to all posts
      </Link>

      <div className="glass-card p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-lavender-50 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 mt-4 pb-6 border-b border-white/10 text-sm text-lavender-300/80">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-magenta-600 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_rgba(124,58,237,0.4)]">
            {post.author.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-lavender-100">{post.author.fullName}</p>
            <p className="text-xs text-lavender-300/60">@{post.author.username}</p>
          </div>
        </div>

        <div className="dark-markdown mt-8 text-base leading-relaxed">
          <ReactMarkdown>{post.contentMarkdown}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}

