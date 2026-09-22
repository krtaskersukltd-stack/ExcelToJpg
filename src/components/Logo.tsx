import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  layout?: "inline" | "stacked";
  className?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  layout = "inline",
  className = "",
}: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-9",
    md: "w-9 h-11",
    lg: "w-14 h-18",
  };

  return (
    <div className={`flex items-center gap-2.5 ${layout === "stacked" ? "flex-col text-center" : ""} ${className}`}>
      {/* SVG Icon matching exact Figma graphic */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-200 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <filter id="logoShadow" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.12"/>
            </filter>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6"/>
              <stop offset="100%" stopColor="#1D4ED8"/>
            </linearGradient>
            <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24"/>
              <stop offset="100%" stopColor="#F59E0B"/>
            </linearGradient>
            <clipPath id="logoCardClip">
              <rect x="6" y="24" width="76" height="66" rx="8"/>
            </clipPath>
          </defs>

          {/* Blue Background Document with Folded Corner */}
          <path
            d="M22 6 C17.58 6 14 9.58 14 14 L14 92 C14 96.42 17.58 100 22 100 L78 100 C82.42 100 86 96.42 86 92 L86 28 L64 6 L22 6 Z"
            fill="url(#blueGrad)"
          />
          {/* Folded Corner */}
          <path d="M64 6 L64 24 C64 26.2 65.8 28 68 28 L86 28 Z" fill="#1E40AF" opacity="0.9"/>
          <path d="M64 6 L86 28 L64 28 Z" fill="#93C5FD" opacity="0.4"/>

          {/* Glass Spreadsheet Card (Floating In Front) */}
          <g filter="url(#logoShadow)">
            <rect
              x="6"
              y="24"
              width="76"
              height="66"
              rx="8"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            
            {/* Spreadsheet Grid Lines */}
            <line x1="6" y1="37" x2="82" y2="37" stroke="#CBD5E1" strokeWidth="1"/>
            <line x1="6" y1="49" x2="82" y2="49" stroke="#CBD5E1" strokeWidth="1"/>
            <line x1="6" y1="61" x2="82" y2="61" stroke="#CBD5E1" strokeWidth="1"/>
            <line x1="6" y1="73" x2="82" y2="73" stroke="#CBD5E1" strokeWidth="1"/>

            <line x1="21" y1="24" x2="21" y2="73" stroke="#CBD5E1" strokeWidth="1"/>
            <line x1="36" y1="24" x2="36" y2="73" stroke="#CBD5E1" strokeWidth="1"/>
            <line x1="51" y1="24" x2="51" y2="73" stroke="#CBD5E1" strokeWidth="1"/>
            <line x1="66" y1="24" x2="66" y2="73" stroke="#CBD5E1" strokeWidth="1"/>

            {/* Grid cell fills */}
            <rect x="7" y="25" width="13" height="11" fill="#E2E8F0" opacity="0.5"/>
            <rect x="22" y="25" width="13" height="11" fill="#E2E8F0" opacity="0.5"/>
            <rect x="37" y="25" width="13" height="11" fill="#E2E8F0" opacity="0.5"/>
            <rect x="52" y="25" width="13" height="11" fill="#E2E8F0" opacity="0.5"/>
            <rect x="67" y="25" width="14" height="11" fill="#E2E8F0" opacity="0.5"/>

            {/* Orange Sun Circle */}
            <circle cx="56" cy="53" r="5" fill="url(#sunGrad)"/>

            {/* Dark Landscape Mountains */}
            <g clipPath="url(#logoCardClip)">
              <polygon points="26,90 48,56 68,90" fill="#1E293B"/>
              <polygon points="6,90 32,54 58,90" fill="#0F172A"/>
              <polygon points="44,90 64,62 84,90" fill="#1E293B"/>
              <polygon points="32,54 44,70 32,90 18,90" fill="#334155" opacity="0.4"/>
            </g>
          </g>
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          {layout === "stacked" ? (
            <div className="font-bold text-slate-900 leading-tight">
              <div className="text-base tracking-tight">Excel To</div>
              <div className="text-lg tracking-tight text-blue-600 font-extrabold -mt-0.5">JPG</div>
            </div>
          ) : (
            <>
              <div className="flex items-center font-bold tracking-tight text-slate-900 text-lg leading-tight">
                <span>Excel To</span>
                <span className="ml-1 text-blue-600 font-extrabold">JPG</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">RAZOR SHARP ENGINE</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
