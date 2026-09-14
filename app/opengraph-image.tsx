import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getSite } from "@/lib/content";
import { formatPhone } from "@/lib/phone";

export const alt = "DeLand Tennis Club";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const site = await getSite();
  const logoBuffer = await readFile(path.join(process.cwd(), "public", "logo-og.png"));
  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#cee3de",
          color: "#33454a",
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
              color: "#33454a",
              fontFamily: "sans-serif",
            }}
          >
            {`${site.address.city}, ${site.address.state} · Est. clay courts`}
          </div>
          <div style={{ fontSize: 84, lineHeight: 1, marginTop: 20, fontWeight: 600, color: "#33454a" }}>
            {site.name}
          </div>
          <div style={{ fontSize: 34, marginTop: 24, color: "#37474b", fontStyle: "italic" }}>
            {`${site.tagline}.`}
          </div>
          <div style={{ fontSize: 26, marginTop: 40, color: "#10161a", fontFamily: "sans-serif" }}>
            {`${formatPhone(site.phone)} · ${site.address.street}`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            background: "linear-gradient(160deg, #4e6165 0%, #33454a 55%, #202d30 100%)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* next/og requires a plain <img>, not next/image */}
          <img src={logoDataUrl} width={340} height={340} alt="" />
        </div>
      </div>
    ),
    { ...size },
  );
}
