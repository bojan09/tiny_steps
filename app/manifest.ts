import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TinySteps — A gentler beginning",
    short_name: "TinySteps",
    description: "Small steps, a brighter tomorrow.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f5ee",
    theme_color: "#345b49",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
