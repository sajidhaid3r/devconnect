// Shared TypeScript types used by both client and server (per PDF: /shared for types/utils)

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface UserPublic {
  id: string;
  email: string;
  username: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  createdAt: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface ProjectDTO {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export interface BlogPostDTO {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  contentMarkdown: string;
  excerpt: string;
  coverImageUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillDTO {
  id: string;
  name: string;
}

export interface EndorsementDTO {
  id: string;
  skillId: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
}

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ConnectionDTO {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: ConnectionStatus;
  createdAt: string;
}

export type NotificationType = "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED" | "ENDORSEMENT";

export interface NotificationDTO {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
}
