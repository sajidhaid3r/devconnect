import { useParams } from "react-router-dom";
import { useState } from "react";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { useUserProjects, useCreateProject } from "../hooks/useProjects";
import { useAuthStore } from "../store/authStore";
import { useSendConnectionRequest, useMutualConnections } from "../hooks/useConnections";
import { api } from "../api/client";
import ProjectCard from "../components/ProjectCard";
import DeveloperCard from "../components/DeveloperCard";

export default function Profile() {
  const { username } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useProfile(username);
  const { data: projects } = useUserProjects(username);
  const updateProfile = useUpdateProfile();
  const createProject = useCreateProject();
  const sendRequest = useSendConnectionRequest();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "", techStack: "" });
  const [endorseSkill, setEndorseSkill] = useState("");

  const isOwnProfile = currentUser?.username === username;
  const { data: mutuals } = useMutualConnections(isOwnProfile ? undefined : username);

  if (isLoading || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-slide-up">
        <div className="skeleton-glass h-48 rounded-2xl" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="skeleton-glass h-40 rounded-2xl" />
          <div className="skeleton-glass h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  async function handleEndorse() {
    if (!endorseSkill) return;
    await api.post("/skills/endorse", { toUsername: username, skillName: endorseSkill });
    setEndorseSkill("");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-slide-up">
      {/* Glass Header Card */}
      <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-500/20 via-magenta-500/10 to-transparent blur-2xl pointer-events-none" />
        
        <div className="relative flex-shrink-0">
          <img
            src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.fullName}`}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-violet-500/60 ring-offset-4 ring-offset-dark-base shadow-[0_0_25px_rgba(124,58,237,0.5)]"
            alt={profile.fullName}
          />
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-dark-base rounded-full shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-lavender-50">
                {profile.fullName}
              </h1>
              <p className="text-lavender-300 text-sm mt-0.5 font-medium">
                @{profile.username} {profile.location && <span className="text-lavender-300/60">· 📍 {profile.location}</span>}
              </p>
            </div>

            <div>
              {isOwnProfile ? (
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn-secondary px-4 py-2 text-xs font-semibold"
                >
                  {editing ? "Cancel Edit" : "Edit Profile"}
                </button>
              ) : (
                <button
                  onClick={() => sendRequest.mutate(username!)}
                  disabled={sendRequest.isPending}
                  className="btn-primary btn-shimmer px-5 py-2 text-xs font-semibold tracking-wide disabled:opacity-60"
                >
                  {sendRequest.isPending ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>
          </div>

          <p className="text-lavender-200 mt-4 text-sm sm:text-base leading-relaxed">
            {profile.bio || "No bio added yet."}
          </p>

          {/* Gradient Skill Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.skills?.map((s: any) => (
              <span
                key={s.skill.name}
                className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-violet-500/20 via-purple-500/15 to-magenta-500/20 border border-violet-400/30 text-violet-200 font-medium shadow-sm"
              >
                {s.skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Bio Edit Form */}
      {isOwnProfile && editing && (
        <div className="glass-card p-6 space-y-4 animate-scale-in">
          <h3 className="font-display font-semibold text-base text-lavender-50">Update Your Bio</h3>
          <textarea
            placeholder="Tell other developers about your background, interests, and what you're building..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="glass-input w-full p-3 text-sm leading-relaxed"
          />
          <button
            onClick={() => {
              updateProfile.mutate({ bio });
              setEditing(false);
            }}
            className="btn-primary btn-shimmer px-5 py-2 text-xs font-semibold"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Endorse Skill Section */}
      {!isOwnProfile && (
        <div className="glass-card p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            placeholder="Endorse a skill (e.g. React, TypeScript, Rust)"
            value={endorseSkill}
            onChange={(e) => setEndorseSkill(e.target.value)}
            className="glass-input flex-1 px-4 py-2 text-sm"
          />
          <button
            onClick={handleEndorse}
            disabled={!endorseSkill.trim()}
            className="btn-primary btn-shimmer px-5 py-2 text-xs font-semibold disabled:opacity-50"
          >
            Endorse Skill
          </button>
        </div>
      )}

      {/* Mutual Connections */}
      {!isOwnProfile && mutuals && mutuals.length > 0 && (
        <div>
          <h2 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-lavender-300">
            {mutuals.length} Mutual Connection{mutuals.length > 1 ? "s" : ""}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 stagger-container">
            {mutuals.map((u: any) => (
              <div key={u.id} className="animate-stagger-item">
                <DeveloperCard {...u} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-lavender-50">Projects</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 stagger-container">
          {projects?.map((p: any) => (
            <div key={p.id} className="animate-stagger-item">
              <ProjectCard {...p} />
            </div>
          ))}
        </div>

        {projects?.length === 0 && (
          <div className="glass-card p-8 text-center text-lavender-300/70 text-sm">
            No projects published yet.
          </div>
        )}

        {/* Add Project Card */}
        {isOwnProfile && (
          <div className="glass-card p-6 border-dashed border-violet-400/30 space-y-3.5 mt-6">
            <h3 className="font-display font-semibold text-base text-lavender-50">
              Add a New Project
            </h3>
            <input
              placeholder="Project title (e.g. NextGen Distributed Cache)"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="glass-input w-full px-4 py-2 text-sm"
            />
            <textarea
              placeholder="Detailed description of what you built and tech highlights"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={3}
              className="glass-input w-full px-4 py-2 text-sm leading-relaxed"
            />
            <input
              placeholder="Tech stack, comma separated (e.g. React, Node.js, Redis, Tailwind)"
              value={newProject.techStack}
              onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
              className="glass-input w-full px-4 py-2 text-sm"
            />
            <button
              onClick={async () => {
                const formData = new FormData();
                formData.append("title", newProject.title);
                formData.append("description", newProject.description);
                newProject.techStack
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .forEach((t) => formData.append("techStack[]", t));
                await createProject.mutateAsync(formData);
                setNewProject({ title: "", description: "", techStack: "" });
              }}
              disabled={!newProject.title.trim() || createProject.isPending}
              className="btn-primary btn-shimmer px-5 py-2.5 text-xs font-semibold disabled:opacity-50"
            >
              {createProject.isPending ? "Adding Project..." : "Add Project"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

