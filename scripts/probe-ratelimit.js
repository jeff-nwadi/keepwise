// Arcjet rate-limit probe — fire 15 sign-in requests back-to-back.
// First 10 should pass, 11+ should be denied by slidingWindow.
const BASE = "http://localhost:3001";
const N = 15;

(async () => {
  const results = [];
  for (let i = 0; i < N; i++) {
    const r = await fetch(BASE + "/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: BASE },
      body: JSON.stringify({ email: "bola@example.com", password: "keepwise-demo" }),
    });
    results.push({ n: i + 1, status: r.status });
  }
  console.table(results);
  const denied = results.filter((r) => r.status === 429 || r.status === 403);
  console.log(`${denied.length}/${N} denied.`);
})();
