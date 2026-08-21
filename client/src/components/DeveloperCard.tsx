import { Link } from "react-router-dom";

interface Props {
  username: string;
  fullName: string;
  avatarUrl?: string | null;
  location?: string | null;
  skills?: { skill: { name: string } }[];
}

export default function DeveloperCard({ username, fullName, avatarUrl, location, skills = [] }: Props) {
  return (
    <Link
      to={`/profile/${username}`}
      className="glass-card-interactive p-4 flex items-center gap-3.5 group relative overflow-hidden"
    >
      <div className="relative flex-shrink-0">
        <img
          src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`}
          alt={fullName}
          className="w-13 h-13 w-12 h-12 rounded-full object-cover ring-2 ring-violet-400/50 ring-offset-2 ring-offset-dark-base shadow-[0_0_15px_rgba(124,58,237,0.35)] group-hover:ring-magenta-400/70 transition-all duration-300"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-dark-base rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display font-medium text-lavender-50 group-hover:text-violet-300 transition-colors truncate text-base">
          {fullName}
        </p>
        <p className="text-xs text-lavender-300/70 truncate mt-0.5">
          @{username}{location ? ` · ${location}` : ""}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {skills.slice(0, 3).map((s) => (
            <span
              key={s.skill.name}
              className="text-[11px] px-2 py-0.5 rounded-md bg-gradient-to-r from-violet-500/20 to-magenta-500/20 border border-violet-400/20 text-violet-200 font-medium"
            >
              {s.skill.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

