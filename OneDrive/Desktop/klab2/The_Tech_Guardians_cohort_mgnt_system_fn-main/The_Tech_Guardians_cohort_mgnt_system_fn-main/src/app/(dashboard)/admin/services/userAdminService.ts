import { User } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// ── Core fetch helper ────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Types ────────────────────────────────────────────────────────────────────
export type InviteRole = "ADMIN" | "INSTRUCTOR" | "LEARNER";

export interface InvitePayload {
  email: string;
  role: InviteRole;
  cohort_id?: string;
}

export interface InvitationResult {
  email: string;
  role: InviteRole;
  token: string;
  expires_at: string;
}

export interface PromotePayload {
  uuid: string;       // target user's uuid
  admin_id: string;   // currently logged-in admin's uuid
}

// ── Service methods ──────────────────────────────────────────────────────────

/**
 * Fetch all users — Admin only.
 * GET /api/users
 */
export async function getAllUsers(): Promise<User[]> {
  const data = await apiFetch<{ users: User[] }>("/users");
  return data.users;
}

/**
 * Search users by name or email — Admin only.
 * GET /api/users/Search?query=…
 */
export async function searchUsers(query: string): Promise<User[]> {
  const data = await apiFetch<{ users: User[] }>(
    `/users/Search?query=${encodeURIComponent(query)}`
  );
  return data.users;
}

/**
 * Promote an Instructor to Admin.
 * PUT /api/users/:uuid  { role: "ADMIN", admin_id }
 */
export async function promoteToAdmin({ uuid, admin_id }: PromotePayload): Promise<User> {
  const data = await apiFetch<{ user: User }>(`/users/${uuid}`, {
    method: "PUT",
    body: JSON.stringify({ role: "ADMIN", admin_id }),
  });
  return data.user;
}

/**
 * Delete a user — Admin only.
 * DELETE /api/users/:uuid
 */
export async function deleteUser(uuid: string): Promise<void> {
  await apiFetch(`/users/${uuid}`, { method: "DELETE" });
}

/**
 * Create an invitation — Admin only.
 * POST /api/users/Invite
 */
export async function createInvitation(payload: InvitePayload): Promise<InvitationResult> {
  const data = await apiFetch<{ invitation: InvitationResult }>("/users/Invite", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.invitation;
}