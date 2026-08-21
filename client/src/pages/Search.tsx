import { useState } from "react";
import { useSearchDevelopers } from "../hooks/useProfile";
import DeveloperCard from "../components/DeveloperCard";

export default function Search() {
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSearchDevelopers({
    skill: skill || undefined,
    location: location || undefined,
    page,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-slide-up">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-lavender-50">
          Discover Developers
        </h1>
        <p className="text-sm text-lavender-300/70 mt-1">
          Search and connect with engineers across technologies and locations
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            placeholder="Filter by skill (e.g. React, Python, Rust)..."
            value={skill}
            onChange={(e) => {
              setSkill(e.target.value);
              setPage(1);
            }}
            className="glass-input w-full px-4 py-2.5 text-sm"
          />
        </div>
        <div className="relative flex-1">
          <input
            placeholder="Filter by location (e.g. San Francisco, Remote)..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
            className="glass-input w-full px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Results Content */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-glass h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4 stagger-container">
            {data?.users?.map((u: any) => (
              <div key={u.id} className="animate-stagger-item">
                <DeveloperCard {...u} />
              </div>
            ))}
          </div>

          {/* Styled Empty State */}
          {data?.users?.length === 0 && (
            <div className="glass-card p-12 text-center max-w-lg mx-auto space-y-4 my-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-magenta-500/20 border border-violet-400/30 flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(124,58,237,0.25)]">
                🔍
              </div>
              <h3 className="font-display font-semibold text-lg text-lavender-50">
                No developers found
              </h3>
              <p className="text-sm text-lavender-300/70 leading-relaxed">
                We couldn't find any developers matching your current filter criteria. Try searching for different skills or broader locations.
              </p>
              {(skill || location) && (
                <button
                  onClick={() => {
                    setSkill("");
                    setLocation("");
                    setPage(1);
                  }}
                  className="btn-secondary px-4 py-2 text-xs font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 text-sm font-medium">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary px-4 py-2 text-xs font-semibold disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-lavender-300">
                {page} / {data.totalPages}
              </span>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary px-4 py-2 text-xs font-semibold disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

