import { ImageResponse } from "next/og";
import { getLogoDataUrl } from "@/lib/logoDataUrl";

export const runtime = "nodejs";

/** Apple Touch Icon – 180×180 ist der übliche Standard */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
          <img src={logo} width={168} height={168} alt="" style={{ objectFit: "contain" }} />
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
          fontSize: 72,
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
