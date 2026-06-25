// E2E sign-up probe — create a brand-new user, verify they land on /items,
// and that they have a fresh household with 0 items.
const BASE = "http://localhost:3000";

async function postJson(path, body, cookie) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: BASE, ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(body), redirect: "manual",
  });
  return { status: res.status, setCookie: res.headers.get("set-cookie") ?? "", body: await res.text() };
}
async function get(path, cookie) {
  const res = await fetch(BASE + path, { headers: cookie ? { Cookie: cookie } : {}, redirect: "manual" });
  return { status: res.status, location: res.headers.get("location"), body: await res.text() };
}
function mergeCookies(prev, setCookie) {
  const cookies = new Map();
  if (prev) for (const c of prev.split(";")) { const i = c.indexOf("="); if (i > 0) cookies.set(c.slice(0, i).trim(), c.slice(i + 1).trim()); }
  for (const part of setCookie.split(/,(?=\s*[a-zA-Z0-9_.-]+=)/)) {
    const [pair] = part.split(";"); const eq = pair.indexOf("=");
    if (eq < 0) continue; const k = pair.slice(0, eq).trim(); const v = pair.slice(eq + 1).trim();
    if (k) cookies.set(k, v);
  }
  return Array.from(cookies.entries()).map(([k, v]) => k + "=" + v).join("; ");
}

const email = `tester-${Date.now()}@example.com`;
const password = "keepwise-test-123";

(async () => {
  console.log(`creating user ${email}`);
  const r1 = await postJson("/api/auth/sign-up/email", {
    name: "Tester Demo",
    email,
    password,
  });
  console.log("sign-up:", r1.status, "body:", r1.body.slice(0, 200));
  if (r1.status >= 400) process.exit(1);
  const cookie = mergeCookies("", r1.setCookie);

  const r2 = await get("/api/auth/get-session", cookie);
  console.log("get-session:", r2.status);
  const session = JSON.parse(r2.body);
  console.log("user:", session.user?.email, "id:", session.user?.id);

  const r3 = await get("/items", cookie);
  console.log("/items:", r3.status);
  const h1 = r3.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  console.log("h1:", h1 ? h1[1].replace(/<[^>]+>/g, "").trim() : "(not found)");
  const empty = r3.body.includes("No items match");
  console.log("empty-state:", empty);

  const r4 = await get("/settings", cookie);
  const settingsH1 = r4.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  console.log("settings h1:", settingsH1 ? settingsH1[1].replace(/<[^>]+>/g, "").trim() : "(not found)");

  console.log("DONE.");
})().catch((e) => { console.error(e); process.exit(1); });
