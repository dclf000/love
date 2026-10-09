/* Anonymous, session-scoped usage statistics; no names, IPs or persistent device IDs. */
(() => {
  const endpoint = "https://sflilptubekduvxqpiiw.supabase.co/rest/v1/heart_visits";
  const apiKey = "sb_publishable_PoY_xXp55Iz0ho4gg0cIhw_JUdGt7Yh";
  const standalone = window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  const device = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "iOS" :
    /Android/i.test(navigator.userAgent) ? "Android" : "Desktop/Other";
  let sessionId;
  try {
    sessionId = sessionStorage.getItem("heart_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("heart_session_id", sessionId);
    }
  } catch (_) { sessionId = crypto.randomUUID(); }
  const record = {
    event_type: standalone ? "home_screen_launch" : "page_view",
    device_type: device,
    display_mode: standalone ? "standalone" : "browser",
    session_id: sessionId
  };
  fetch(endpoint, {
    method: "POST",
    headers: { "apikey": apiKey, "Content-Type": "application/json", "Prefer": "return=minimal" },
    body: JSON.stringify(record),
    keepalive: true
  }).catch(() => { /* Animation must work even if analytics is unavailable. */ });
})();
