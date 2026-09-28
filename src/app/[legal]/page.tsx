import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LEGAL_PAGES, LegalPageId } from "@/lib/legal-data";
import LegalPageView from "@/components/LegalPageView";

interface Props {
  params: Promise<{ legal: string }>;
}

export async function generateStaticParams() {
  return (Object.keys(LEGAL_PAGES) as LegalPageId[]).map((key) => ({
    legal: key,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legal } = await params;
  const page = LEGAL_PAGES[legal as LegalPageId];
  if (!page) return { title: "Page Not Found | Excel To JPG" };
  return {
    title: `${page.titlePrefix} ${page.titleHighlight} | Excel To JPG`,
    description: page.subtitle,
  };
}

export default async function DynamicLegalPage({ params }: Props) {
  const { legal } = await params;
  if (!LEGAL_PAGES[legal as LegalPageId]) {
    notFound();
  }
  return <LegalPageView pageId={legal as LegalPageId} />;
}
