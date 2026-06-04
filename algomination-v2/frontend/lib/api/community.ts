/** Community form submissions (feedback / project / contact). */
import { apiFetch } from "./client";

export interface FeedbackPayload {
  name: string;
  email: string;
  message: string;
}

export interface ProjectPayload {
  name: string;
  algorithm: string;
  githubUrl: string;
  email: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  await apiFetch("/community/feedback/", { method: "POST", body: payload });
}

export async function submitProject(payload: ProjectPayload): Promise<void> {
  // Backend expects snake_case `github_url`.
  await apiFetch("/community/projects/", {
    method: "POST",
    body: {
      name: payload.name,
      algorithm: payload.algorithm,
      github_url: payload.githubUrl,
      email: payload.email,
    },
  });
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  await apiFetch("/community/contact/", { method: "POST", body: payload });
}
