// Integration check: drives the real API-client module against a running
// backend. Run with the Django server up: npx tsx scripts/verify-api.ts
import { apiFetch, ApiError } from "../lib/api/client";
import { submitFeedback, submitProject } from "../lib/api/community";

let failures = 0;
const check = (label: string, ok: boolean) => {
  console.log(`${ok ? "✅" : "❌"} ${label}`);
  if (!ok) failures++;
};

async function main() {
  const email = `user${Date.now()}@algo.dev`;

  // 1. Community submits (no auth) — also verifies github_url field mapping.
  try {
    await submitFeedback({ name: "Tester", email, message: "Loving it!" });
    check("submitFeedback persists", true);
  } catch {
    check("submitFeedback persists", false);
  }
  try {
    await submitProject({
      name: "Tester",
      algorithm: "Merge Sort",
      githubUrl: "https://github.com/x/y",
      email,
    });
    check("submitProject persists (github_url mapping)", true);
  } catch (e) {
    check("submitProject persists (github_url mapping)", false);
    console.error(e);
  }

  // 2. Register through the client → returns tokens.
  const reg = await apiFetch<{ user: { email: string }; access: string }>(
    "/auth/register/",
    { method: "POST", body: { email, name: "Tester", password: "sortme123!" } },
  );
  check("register returns user + access", !!reg.access && reg.user.email === email);

  // 3. Login.
  const login = await apiFetch<{ access: string }>("/auth/login/", {
    method: "POST",
    body: { email, password: "sortme123!" },
  });
  check("login returns access", !!login.access);

  // 4. Bad login → ApiError 401.
  try {
    await apiFetch("/auth/login/", {
      method: "POST",
      body: { email, password: "wrong" },
    });
    check("bad login throws 401", false);
  } catch (e) {
    check("bad login throws 401", e instanceof ApiError && e.status === 401);
  }

  // 5. Bad community payload → ApiError 400 with field errors.
  try {
    await apiFetch("/community/contact/", {
      method: "POST",
      body: { name: "X", email: "notanemail", message: "hi there" },
    });
    check("invalid email throws 400 with fieldErrors", false);
  } catch (e) {
    check(
      "invalid email throws 400 with fieldErrors",
      e instanceof ApiError && e.status === 400 && !!e.fieldErrors.email,
    );
  }

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
