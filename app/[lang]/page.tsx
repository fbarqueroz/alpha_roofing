import { Site } from "@/components/Site";
import type { Lang } from "@/lib/content";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <Site lang={lang as Lang} />;
}
