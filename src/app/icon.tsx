import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          viewBox="0 0 100 120"
          width="32"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue Background Document */}
          <path
            d="M22 6 C17.58 6 14 9.58 14 14 L14 92 C14 96.42 17.58 100 22 100 L78 100 C82.42 100 86 96.42 86 92 L86 28 L64 6 L22 6 Z"
            fill="#2563EB"
          />
          {/* Folded Corner */}
          <path d="M64 6 L64 24 C64 26.2 65.8 28 68 28 L86 28 Z" fill="#1E40AF" />
          <path d="M64 6 L86 28 L64 28 Z" fill="#93C5FD" opacity="0.6" />

          {/* Spreadsheet Card */}
          <rect
            x="6"
            y="24"
            width="76"
            height="66"
            rx="8"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="2"
          />

          {/* Grid lines */}
          <line x1="6" y1="42" x2="82" y2="42" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="6" y1="58" x2="82" y2="58" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="32" y1="24" x2="32" y2="72" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="56" y1="24" x2="56" y2="72" stroke="#CBD5E1" strokeWidth="2" />

          {/* Orange sun */}
          <circle cx="56" cy="50" r="6" fill="#F59E0B" />

          {/* Mountains */}
          <polygon points="6,90 32,54 58,90" fill="#0F172A" />
          <polygon points="40,90 64,60 84,90" fill="#1E293B" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
