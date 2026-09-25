import Link from "next/link";

export default function PrivacyPage() {
  return <main className="min-h-screen bg-[#f7f8ff] px-6 py-20"><article className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-xl sm:p-12"><Link href="/" className="text-sm font-semibold text-[#3d49f5]">← Back to Excel To JPG</Link><h1 className="mt-8 font-heading text-4xl">Privacy Policy</h1><p className="mt-6 leading-8 text-slate-600">We store the account details needed to authenticate you. Passwords are stored only as salted hashes, and the session cookie is HttpOnly. Uploaded source files are deleted immediately after processing. Generated files are temporary, can be downloaded only once, and are removed when the page is refreshed or closed. No time-based file retention limit is used. Do not upload files you are not authorized to process.</p></article></main>;
}
