import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreatePost } from "../hooks/useBlog";

export default function BlogEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createPost = useCreatePost();
  const navigate = useNavigate();

  async function handlePublish(published: boolean) {
    const post = await createPost.mutateAsync({ title, contentMarkdown: content, published });
    navigate(`/blog/${post.slug}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-slide-up">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-xs text-lavender-300 hover:text-violet-300 font-medium mb-6 transition-colors"
      >
        ← Back to all posts
      </Link>

      <div className="glass-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-lavender-50">
            Write a Post
          </h1>
          <p className="text-sm text-lavender-300/70 mt-1">
            Compose in Markdown with full support for code blocks, headers, and links
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-lavender-300 mb-1.5">
              Post Title
            </label>
            <input
              placeholder="e.g. Architecting Distributed Rate Limiters in Go"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input w-full px-4 py-3 text-base sm:text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-lavender-300 mb-1.5">
              Markdown Content
            </label>
            <textarea
              placeholder="Write your technical post here in Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="glass-input w-full p-4 text-sm font-mono leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => handlePublish(false)}
            disabled={!title.trim() || createPost.isPending}
            className="btn-secondary px-5 py-2.5 text-xs font-semibold disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handlePublish(true)}
            disabled={!title.trim() || createPost.isPending}
            className="btn-primary btn-shimmer px-6 py-2.5 text-xs font-semibold tracking-wide disabled:opacity-50"
          >
            {createPost.isPending ? "Publishing..." : "Publish Post 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}

