import Link from "next/link";

export default function TermsPage() {
  return <LegalPage title="Terms of Service">Use Excel To JPG lawfully and only with files you are authorized to process. Accounts are personal, and you are responsible for keeping your credentials secure. The service is provided as available; do not use it as the sole storage location for important files.</LegalPage>;
}

function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f7f8ff] px-6 py-20"><article className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-xl sm:p-12"><Link href="/" className="text-sm font-semibold text-[#3d49f5]">← Back to Excel To JPG</Link><h1 className="mt-8 font-heading text-4xl">{title}</h1><p className="mt-6 leading-8 text-slate-600">{children}</p></article></main>;
}
