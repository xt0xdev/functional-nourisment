export const dynamic = "force-dynamic";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSettings } from "@/lib/content";
import { JsonLd, practiceSchema } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <JsonLd data={practiceSchema(settings)} />
      <Header />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
