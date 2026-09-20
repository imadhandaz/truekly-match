/**
 * Simple imperative toast — no context/provider needed.
 * Call toast("mensaje") from anywhere in client code.
 */
export function toast(msg, type = "success") {
  if (typeof window === "undefined") return;

  const el = document.createElement("div");

  const configs = {
    success: {
      bg: "rgba(10,22,18,0.92)",
      border: "1px solid rgba(16,185,129,0.45)",
      color: "#d1fae5",
      shadow: "0 8px 32px rgba(16,185,129,0.25), 0 2px 8px rgba(0,0,0,0.4)",
      accent: "#10b981",
    },
    error: {
      bg: "rgba(20,10,10,0.92)",
      border: "1px solid rgba(239,68,68,0.45)",
      color: "#fecaca",
      shadow: "0 8px 32px rgba(239,68,68,0.2), 0 2px 8px rgba(0,0,0,0.4)",
      accent: "#ef4444",
    },
    warning: {
      bg: "rgba(20,15,5,0.92)",
      border: "1px solid rgba(245,158,11,0.45)",
      color: "#fde68a",
      shadow: "0 8px 32px rgba(245,158,11,0.2), 0 2px 8px rgba(0,0,0,0.4)",
      accent: "#f59e0b",
    },
  };

  const cfg = configs[type] || configs.success;

  Object.assign(el.style, {
    position: "fixed",
    top: "env(safe-area-inset-top, 20px)",
    marginTop: "20px",
    left: "50%",
    transform: "translateX(-50%) translateY(-8px)",
    zIndex: "9999",
    background: cfg.bg,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    color: cfg.color,
    padding: "11px 20px 11px 14px",
    borderRadius: "999px",
    border: cfg.border,
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: cfg.shadow,
    pointerEvents: "none",
    whiteSpace: "nowrap",
    maxWidth: "90vw",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    opacity: "0",
    transition: "opacity 220ms ease, transform 220ms cubic-bezier(0.2,1.4,0.4,1)",
    fontFamily: "system-ui, -apple-system, sans-serif",
  });

  const dot = document.createElement("span");
  Object.assign(dot.style, {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: cfg.accent,
    flexShrink: "0",
    boxShadow: "0 0 6px " + cfg.accent,
  });
  el.appendChild(dot);

  const text = document.createElement("span");
  text.textContent = msg;
  el.appendChild(text);

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(-6px)";
    setTimeout(() => el.remove(), 300);
  }, 2800);
}
