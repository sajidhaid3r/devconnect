interface Props {
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
}

export default function ProjectCard({ title, description, techStack, repoUrl, liveUrl, imageUrl }: Props) {
  return (
    <div className="glass-card-interactive group flex flex-col justify-between overflow-hidden">
      <div>
        {imageUrl && (
          <div className="w-full h-40 overflow-hidden relative">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0B1E]/80 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
        <div className="p-5">
          <h3 className="font-display font-semibold text-lg text-lavender-50 group-hover:text-violet-300 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-lavender-300/80 mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {techStack.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-500/15 to-magenta-500/15 border border-violet-400/25 text-violet-200 font-medium shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      {(repoUrl || liveUrl) && (
        <div className="px-5 pb-5 pt-1 flex items-center gap-4 text-sm font-medium border-t border-white/5">
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Code ↗</span>
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-magenta-400 hover:text-magenta-300 hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Live demo ↗</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

