export const dynamic = "force-dynamic";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { resolveBookingUrl } from "@/lib/booking";
import { getSettings } from "@/lib/content";
import { getFooterMenu, getHeaderMenu } from "@/lib/menu";
import { JsonLd, practiceSchema } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, menu, footerGroups] = await Promise.all([
    getSettings(),
    getHeaderMenu(),
    getFooterMenu(),
  ]);

  return (
    <>
      <JsonLd data={practiceSchema(settings)} />
      <Header menu={menu} bookingUrl={resolveBookingUrl(settings)} />
      <main>{children}</main>
      <Footer settings={settings} groups={footerGroups} />
    </>
  );
}
