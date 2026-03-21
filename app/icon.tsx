import { ImageResponse } from "next/og";
import { getLogoDataUrl } from "@/lib/logoDataUrl";

export const runtime = "nodejs";

/** Tab-Favicon; PNG-Ausgabe, sichtbar auch ohne WebP-Favicon-Support */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const logo = await getLogoDataUrl();

  if (logo) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0c0f0a",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={28} height={28} alt="" style={{ objectFit: "contain" }} />
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0f0a",
          color: "#bef264",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        TSV
      </div>
    ),
    { ...size },
  );
}
