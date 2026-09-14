import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";
import { formatPhone } from "@/lib/phone";

export const alt = "DeLand Tennis Club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const site = await getSite();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fbf7f0",
          color: "#15291d",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 64px",
            width: 760,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#9a4520",
              fontFamily: "sans-serif",
            }}
          >
            {`${site.address.city}, ${site.address.state} · Clay courts`}
          </div>
          <div style={{ fontSize: 88, lineHeight: 1, marginTop: 20, fontWeight: 600 }}>{site.name}</div>
          <div style={{ fontSize: 34, marginTop: 24, color: "#5c574f", fontStyle: "italic" }}>
            {`${site.tagline}.`}
          </div>
          <div style={{ fontSize: 26, marginTop: 40, color: "#1c1a17", fontFamily: "sans-serif" }}>
            {`${formatPhone(site.phone)} · ${site.address.street}`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            background: "linear-gradient(160deg, #c9673e 0%, #b4532a 50%, #8f3f1e 100%)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="360" height="240" viewBox="0 0 400 260" fill="none" stroke="#fff" strokeWidth="4">
            <rect x="40" y="30" width="320" height="200" />
            <line x1="70" y1="30" x2="70" y2="230" />
            <line x1="330" y1="30" x2="330" y2="230" />
            <line x1="70" y1="82" x2="330" y2="82" />
            <line x1="70" y1="178" x2="330" y2="178" />
            <line x1="200" y1="82" x2="200" y2="178" />
            <line x1="40" y1="130" x2="360" y2="130" strokeDasharray="8 7" strokeWidth="5" />
          </svg>
        </div>
      </div>
    ),
    { ...size },
  );
}
