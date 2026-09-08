import { prisma } from "@/lib/prisma";
import { deleteSubscriber } from "../actions";

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Mailing list</h1>
      <p className="mt-2 text-sm text-muted">
        People who subscribed from the site footer. Stored here so you can see names and emails — no Mailchimp
        connection is required.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        {subscribers.length === 0 ? <p className="p-5 text-sm text-muted">No subscribers yet.</p> : null}
        {subscribers.map((subscriber) => (
          <div
            key={subscriber.id}
            className="flex flex-wrap items-center justify-between gap-3 border-t border-forest/10 px-5 py-4 first:border-t-0"
          >
            <div>
              <p className="font-medium text-forest">{subscriber.name}</p>
              <p className="text-sm text-muted">{subscriber.email}</p>
              <p className="mt-1 text-xs text-muted">{subscriber.createdAt.toLocaleString()}</p>
            </div>
            <form action={deleteSubscriber}>
              <input type="hidden" name="id" value={subscriber.id} />
              <button className="text-sm text-clay">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
