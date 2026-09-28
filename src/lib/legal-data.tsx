import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  EyeOff, 
  Sparkles, 
  Cpu, 
  KeyRound, 
  Trash2, 
  Award, 
  Zap, 
  CreditCard, 
  ShieldAlert, 
  CheckCircle2,
  LucideIcon
} from "lucide-react";

export type LegalPageId = "privacy" | "terms" | "security";

export interface LegalPillar {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

export interface LegalSection {
  number: string;
  title: string;
  content: React.ReactNode;
}

export interface LegalPageConfig {
  id: LegalPageId;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  meta: React.ReactNode;
  pillars: LegalPillar[];
  sections: LegalSection[];
  highlightBox: {
    icon: LucideIcon;
    title: string;
    content: React.ReactNode;
    insertAfterSectionNumber: string; // e.g. "02" or "01"
  };
  contactBox: {
    title: string;
    subtitle: string;
    buttonText: string;
    email: string;
  };
}

export const LEGAL_TABS = [
  { id: "privacy" as const, href: "/privacy", label: "Privacy Policy" },
  { id: "terms" as const, href: "/terms", label: "Terms of Service" },
  { id: "security" as const, href: "/security", label: "Security & Compliance" },
];

export const LEGAL_PAGES: Record<LegalPageId, LegalPageConfig> = {
  privacy: {
    id: "privacy",
    titlePrefix: "Privacy",
    titleHighlight: "Policy",
    subtitle:
      "Your data privacy is our highest priority. Learn how ExcelToJpg processes, ephemeralizes, and protects your spreadsheets.",
    meta: (
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <span>Last Updated: September 26, 2026</span>
        <span>•</span>
        <span>Effective Date: Immediate</span>
      </div>
    ),
    pillars: [
      {
        icon: Clock,
        title: "1-Hour Auto-Purge",
        desc: "Uploaded Excel files and generated JPGs are permanently wiped within 60 minutes.",
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        icon: EyeOff,
        title: "Zero Data Selling",
        desc: "We never monetize, inspect, or sell your spreadsheet rows, figures, or metadata.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        icon: Lock,
        title: "256-Bit TLS Transit",
        desc: "All transmissions are shielded via modern TLS 1.3 cryptographic protocols.",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
      {
        icon: ShieldCheck,
        title: "GDPR & CCPA Aligned",
        desc: "Full international data subject rights including instant right-to-erasure.",
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
    ],
    highlightBox: {
      insertAfterSectionNumber: "02",
      icon: Sparkles,
      title: "Zero AI Model Training Guarantee",
      content: (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Your spreadsheets, formulas, financial balances, customer rosters, and charts are <strong>NEVER used to train, fine-tune, or calibrate artificial intelligence models</strong>. Processing occurs in isolated stateless compute containers.
        </p>
      ),
    },
    sections: [
      {
        number: "01",
        title: "Introduction & Scope",
        content: (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
            ExcelToJpg (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the online spreadsheet rasterization suite located at <span className="font-semibold text-slate-800">exceltojpg.com</span>. This Privacy Policy sets out how we handle user files, account credentials, and diagnostic data when you convert Microsoft Excel (<code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.xlsx</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.xls</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.xlsm</code>) or comma-separated (<code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.csv</code>) spreadsheets into high-resolution JPG images.
          </p>
        ),
      },
      {
        number: "02",
        title: "Information We Collect & Process",
        content: (
          <div className="pl-9 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              We prioritize data minimization. We only touch the data strictly necessary to execute high-fidelity raster rendering:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-700 font-normal">
              <li><strong className="text-slate-900">User Spreadsheets & Files:</strong> Uploaded solely for rendering. Evaluated in ephemeral sandbox workers and permanently deleted within 1 hour.</li>
              <li><strong className="text-slate-900">Cloud Storage Access (Google Drive & Dropbox):</strong> When using our cloud picker, we obtain short-lived scoped read tokens solely for the specific file you pick. We never inspect other folders in your cloud storage.</li>
              <li><strong className="text-slate-900">Technical Diagnostics:</strong> Browser user agent, screen resolution, and error codes used to maintain compatibility across desktop and mobile devices.</li>
            </ul>
          </div>
        ),
      },
      {
        number: "03",
        title: "Automated Data Lifecycle & Retention",
        content: (
          <div className="pl-9 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Our server architecture enforces automated hard deletion policies:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <p className="text-xs font-bold text-slate-900">Step 1: Upload</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Encrypted via TLS 1.3 to conversion sandbox.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <p className="text-xs font-bold text-slate-900">Step 2: 300 DPI Render</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Vectorized & output as crisp JPG image.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                <p className="text-xs font-bold text-emerald-800">Step 3: 60m Hard Purge</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">File shredded completely from storage.</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        number: "04",
        title: "Your Rights Under GDPR & CCPA",
        content: (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
            Under the EU General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you retain full authority over your data. Because we purge files automatically within 1 hour, residual personal data is effectively non-existent. You may request explicit confirmation or manual purge at any time by contacting our team.
          </p>
        ),
      },
    ],
    contactBox: {
      title: "Have questions about our privacy standards?",
      subtitle: "Our Data Protection Officer is ready to assist you.",
      buttonText: "Contact Privacy Team",
      email: "privacy@exceltojpg.com",
    },
  },

  terms: {
    id: "terms",
    titlePrefix: "Terms of",
    titleHighlight: "Service",
    subtitle:
      "Please read these terms carefully before utilizing our online spreadsheet rasterization services.",
    meta: (
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <span>Last Revised: September 26, 2026</span>
        <span>•</span>
        <span>Version 2.4</span>
      </div>
    ),
    pillars: [
      {
        icon: Award,
        title: "100% User Ownership",
        desc: "You retain total copyright & ownership over all uploaded sheets and rendered JPGs.",
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        icon: Zap,
        title: "Commercial Use OK",
        desc: "Exported images may be freely used in commercial client audits, decks, and reports.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        icon: CreditCard,
        title: "Transparent Billing",
        desc: "Monthly/Yearly subscriptions can be paused or cancelled anytime with no penalties.",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
      {
        icon: ShieldAlert,
        title: "Fair Use Enforced",
        desc: "Automated rate-limiting protects our conversion engine against malicious overload.",
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
    ],
    highlightBox: {
      insertAfterSectionNumber: "02",
      icon: CheckCircle2,
      title: "Intellectual Property & Complete User Ownership",
      content: (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>You retain 100% intellectual property ownership</strong> of any spreadsheet data, proprietary formulas, financial summaries, or graphical output processed through our service. ExcelToJpg asserts zero copyright claims, licensing claims, or ownership interest in your content.
        </p>
      ),
    },
    sections: [
      {
        number: "01",
        title: "Agreement to Terms",
        content: (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
            By visiting, uploading files to, or subscribing to services provided on <span className="font-semibold text-slate-800">ExcelToJpg.com</span>, you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree to all of these terms, you are explicitly prohibited from using the platform.
          </p>
        ),
      },
      {
        number: "02",
        title: "Description of Service & License",
        content: (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
            ExcelToJpg provides a high-fidelity web utility that converts spreadsheet formats (<code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.xlsx</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.xls</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.xlsm</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.csv</code>) into raster image formats (<code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.jpg</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.png</code>) and documents (<code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">.pdf</code>). We grant you a revocable, non-exclusive, non-transferable license to access our application in strict compliance with these terms.
          </p>
        ),
      },
      {
        number: "03",
        title: "Acceptable Use Policy",
        content: (
          <div className="pl-9 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>When utilizing ExcelToJpg, you agree NOT to:</p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700 font-normal">
              <li>Upload files containing malicious macro viruses, trojans, ransomware, or corrupt payloads.</li>
              <li>Attempt to bypass rate limits, server resource bounds, or security sandboxes.</li>
              <li>Use automated reverse-engineering or bots designed to duplicate our vectorization engine.</li>
              <li>Utilize the service for any unlawful activities or infringement of third-party IP rights.</li>
            </ul>
          </div>
        ),
      },
      {
        number: "04",
        title: "Subscription Plans & Cancellation",
        content: (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
            Paid plans (Basic, Advance, and Business) are billed in advance on a recurring monthly or yearly schedule. You may cancel your subscription at any time via your account portal or by contacting support. Upon cancellation, your subscription remains active until the end of the paid billing period.
          </p>
        ),
      },
      {
        number: "05",
        title: "Disclaimer of Warranties & Liability",
        content: (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
            While we maintain a 99.9% conversion accuracy target, the services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. ExcelToJpg is not liable for indirect, punitive, or consequential damages arising from conversion discrepancies or network interruptions.
          </p>
        ),
      },
    ],
    contactBox: {
      title: "Questions about our Terms of Service?",
      subtitle: "Our legal counsel team is available to assist.",
      buttonText: "Contact Legal Team",
      email: "legal@exceltojpg.com",
    },
  },

  security: {
    id: "security",
    titlePrefix: "Security &",
    titleHighlight: "Data Protection",
    subtitle:
      "Enterprise-grade cryptographic protection and stateless ephemeral compute for your sensitive financial & tabular datasets.",
    meta: (
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
        <span>Security Status: All Systems Encrypted & Operational</span>
        <span>•</span>
        <span className="text-emerald-600 font-semibold">TLS 1.3 Active</span>
      </div>
    ),
    pillars: [
      {
        icon: Lock,
        title: "End-to-End TLS 1.3",
        desc: "High-grade 256-bit encryption for all file uploads, previews, and downloads.",
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        icon: Cpu,
        title: "Isolated Sandboxes",
        desc: "Every conversion executes in a hardened, memory-confined ephemeral container.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        icon: Trash2,
        title: "Hard Ephemeral Purge",
        desc: "Strict automated cron routines permanently erase files and cache after 60 minutes.",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
      {
        icon: KeyRound,
        title: "OAuth 2.0 Scoped Auth",
        desc: "Cloud pickers read only the selected sheet with immediate token expiration.",
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
    ],
    highlightBox: {
      insertAfterSectionNumber: "01",
      icon: ShieldCheck,
      title: "Automated File Lifecycle & Destruction Pipeline",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[11px] font-bold text-blue-600 font-mono">01. INGESTION</span>
            <p className="text-xs font-bold text-slate-900 mt-1">Encrypted Transit</p>
            <p className="text-[11px] text-slate-500 mt-0.5">TLS 1.3 direct to conversion node.</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[11px] font-bold text-blue-600 font-mono">02. ISOLATION</span>
            <p className="text-xs font-bold text-slate-900 mt-1">Memory Sandbox</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Stateless process without disk writing.</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
            <span className="text-[11px] font-bold text-blue-600 font-mono">03. VECTORIZE</span>
            <p className="text-xs font-bold text-slate-900 mt-1">300 DPI Rendering</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Crisp pixel-perfect JPG generation.</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-600 font-mono">04. HARD PURGE</span>
            <p className="text-xs font-bold text-emerald-900 mt-1">Zero Remnants</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">File & memory wiped within 60 mins.</p>
          </div>
        </div>
      ),
    },
    sections: [
      {
        number: "01",
        title: "Security Architecture Overview",
        content: (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
            ExcelToJpg utilizes a defense-in-depth security model engineered specifically for temporary file processing. We believe the safest data is data that is not retained. Consequently, our conversion architecture is designed from the ground up as a stateless pipeline with zero long-term data persistence.
          </p>
        ),
      },
      {
        number: "02",
        title: "Cloud Integration Security (Google Drive & Dropbox)",
        content: (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
            When you import files from Google Drive or Dropbox, our client communicates directly through official SDKs with scoped OAuth 2.0 permissions. We only request read access to the specific spreadsheet file you click. We never retain access tokens or inspect any other documents in your cloud drives.
          </p>
        ),
      },
      {
        number: "03",
        title: "Infrastructure & DDoS Mitigation",
        content: (
          <div className="pl-9 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>To guarantee 99.9% availability and prevent system abuse:</p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700 font-normal">
              <li>Global Edge CDN filtering malicious HTTP traffic and mitigating DDoS attacks.</li>
              <li>Intelligent IP rate-limiting guarding compute instances from automated bot abuse.</li>
              <li>Automated security patch deployments and non-root Linux container execution.</li>
            </ul>
          </div>
        ),
      },
    ],
    contactBox: {
      title: "Found a vulnerability? Report to our Security Team",
      subtitle: "We appreciate responsible security disclosures and bug reports.",
      buttonText: "Submit Security Report",
      email: "security@exceltojpg.com",
    },
  },
};
