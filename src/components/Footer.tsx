"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FAFBFD] pt-12 pb-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main White Footer Container Card */}
        <div className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 border-2 border-blue-400/50 shadow-[0_12px_45px_rgba(53,91,255,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left Column: Description & Social Icons */}
            <div className="md:col-span-5 space-y-5">
              <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed max-w-xs">
                The high-speed spreadsheet-to-image engine engineered for precision, pixel-perfection, and friction free asset export.
              </p>

              {/* Social Media Icons (Solid Blue) */}
              <div className="flex items-center gap-3 pt-1">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#355BFF] hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-[#355BFF] hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="w-8 h-8 rounded-lg bg-[#355BFF] hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-[#355BFF] hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 1: Company */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-[#355BFF] tracking-tight">
                Company
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-normal">
                <li><Link href="#about" className="hover:text-blue-600 transition-colors">About</Link></li>
                <li><Link href="#contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                <li><Link href="#changelog" className="hover:text-blue-600 transition-colors">Changelog</Link></li>
                <li><Link href="#careers" className="hover:text-blue-600 transition-colors">Careers</Link></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-[#355BFF] tracking-tight">
                Resources
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-normal">
                <li><Link href="#docs" className="hover:text-blue-600 transition-colors">Documentation</Link></li>
                <li><Link href="#api" className="hover:text-blue-600 transition-colors">API Reference</Link></li>
                <li><Link href="#formulas" className="hover:text-blue-600 transition-colors">Spreadsheet Formulas</Link></li>
                <li><Link href="#batch" className="hover:text-blue-600 transition-colors">Batch Processing</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-[#355BFF] tracking-tight">
                Legal
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-normal">
                <li><Link href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="#security" className="hover:text-blue-600 transition-colors">Security Overview</Link></li>
                <li><Link href="#gdpr" className="hover:text-blue-600 transition-colors">GDPR Compliance</Link></li>
              </ul>
            </div>

          </div>

          {/* Thin Horizontal Blue Line Divider */}
          <div className="h-[1.5px] bg-blue-200/80 w-full my-6" />

          {/* Sub-Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 font-normal">
            <div>
              @Excel To JPG. All rights reserved
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="#terms" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link>
              <Link href="#cookies" className="hover:text-blue-600 transition-colors">Cookies Settings</Link>
            </div>
          </div>
        </div>

        {/* Giant Watermark Typography matching Figma screenshot */}
        <div className="mt-8 sm:mt-12 text-center select-none pointer-events-none">
          <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[120px] font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#355BFF]/65 via-[#355BFF]/30 to-transparent">
            Excel To JPG
          </span>
        </div>

      </div>
    </footer>
  );
}
