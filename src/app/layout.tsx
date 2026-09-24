import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Excel To JPG Converter - Free, Fast & High Quality Sheet to Image",
  description:
    "Convert Excel spreadsheets (.xls, .xlsx, .csv, .xlsm) into crisp, high-resolution JPG images online. 300 DPI razor-sharp render engine with instant download.",
  keywords: [
    "Excel to JPG",
    "Spreadsheet to Image",
    "XLSX to JPG",
    "Convert Excel online",
    "Excel to PNG",
    "High DPI Excel Export",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Excel To JPG Converter - High Quality Sheet to Image",
    description: "Convert Excel spreadsheets into crisp, high-resolution JPG images online.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,600,500,400&display=swap"
        />
      </head>
      <body className="font-sans antialiased bg-[#FAFBFD] text-slate-900 selection:bg-blue-600 selection:text-white min-h-screen overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
