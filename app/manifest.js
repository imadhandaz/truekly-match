export default function manifest() {
  return {
    name: "Truekly Match",
    short_name: "Truekly",
    description: "Intercambia productos haciendo match. Lo tuyo por lo suyo.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1612",
    theme_color: "#10b981",
    orientation: "portrait",
    categories: ["lifestyle", "shopping", "social"],
    lang: "es",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
