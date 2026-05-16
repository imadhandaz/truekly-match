import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Truekly Match — Lo tuyo por lo suyo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 30%, #10b981 0%, transparent 60%), radial-gradient(circle at 70% 70%, #0ea5e9 0%, transparent 60%), #042f2e",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 50,
            background: "linear-gradient(135deg, #10b981, #0ea5e9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 140,
            fontWeight: 900,
            marginBottom: 40,
            boxShadow: "0 25px 50px rgba(14, 165, 233, 0.4)",
          }}
        >
          T
        </div>
        <div
          style={{
            fontSize: 90,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-0.03em",
          }}
        >
          Truekly Match
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#a7f3d0",
            marginTop: 16,
            fontWeight: 500,
          }}
        >
          Lo tuyo por lo suyo
        </div>
      </div>
    ),
    { ...size }
  );
}
