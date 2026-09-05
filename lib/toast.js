/**
 * Simple imperative toast — no context/provider needed.
 * Call toast("mensaje") from anywhere in client code.
 */
export function toast(msg, type = "success") {
  if (typeof window === "undefined") return;

  const el = document.createElement("div");
  const bg = type === "error" ? "#ef4444" : type === "warning" ? "#f59e0b" : "#111827";

  Object.assign(el.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "9999",
    background: bg,
    color: "#fff",
    padding: "12px 22px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    maxWidth: "90vw",
    textAlign: "center",
    animation: "fadeInUp 200ms ease-out both",
    transition: "opacity 300ms",
  });

  el.textContent = msg;
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2500);
}
