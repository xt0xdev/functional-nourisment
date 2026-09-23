import { notFound, redirect } from "next/navigation";
import { getEvent } from "@/lib/content";
import { eventSlug, isRetreatEvent } from "@/lib/events";

export default async function EventRegisterRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  if (isRetreatEvent(event)) {
    redirect(`/retreats/${eventSlug(event)}/register`);
  }
  redirect(`/calendar/${eventSlug(event)}/register`);
}
