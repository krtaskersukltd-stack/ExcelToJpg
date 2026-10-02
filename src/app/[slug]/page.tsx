import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LEGAL_PAGES, LegalPageId } from "@/lib/legal-data";
import { NAV_TOOL_IDS, resolveToolSlug, getToolConfig } from "@/lib/converter-tools";
import LegalPageView from "@/components/LegalPageView";
import ConverterPageView from "@/components/ConverterPageView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  // Legal pages
  for (const key of Object.keys(LEGAL_PAGES)) {
    params.push({ slug: key });
  }

  // Converter tools
  for (const toolId of NAV_TOOL_IDS) {
    params.push({ slug: toolId });
    if (toolId.includes("-")) {
      const parts = toolId.split("-");
      if (parts.length === 2) {
        params.push({ slug: `${parts[0]}-to-${parts[1]}` });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (LEGAL_PAGES[slug as LegalPageId]) {
    const page = LEGAL_PAGES[slug as LegalPageId];
    return {
      title: `${page.titlePrefix} ${page.titleHighlight} | Excel To JPG`,
      description: page.subtitle,
    };
  }

  const resolvedTool = resolveToolSlug(slug);
  if (resolvedTool) {
    const config = getToolConfig(resolvedTool);
    return {
      title: `${config.label} Converter | Online Free Spreadsheet Tool | ExcelToJpg`,
      description: config.subtitle,
    };
  }

  return { title: "Page Not Found | ExcelToJpg" };
}

export default async function DynamicSlugPage({ params }: Props) {
  const { slug } = await params;

  if (LEGAL_PAGES[slug as LegalPageId]) {
    return <LegalPageView pageId={slug as LegalPageId} />;
  }

  const resolvedTool = resolveToolSlug(slug);
  if (resolvedTool) {
    return <ConverterPageView initialTool={resolvedTool} />;
  }

  notFound();
}
