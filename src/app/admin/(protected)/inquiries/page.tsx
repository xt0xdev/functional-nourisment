import { prisma } from "@/lib/prisma";
import { deleteInquiry, markInquiryRead } from "../actions";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Inquiries</h1>
      <div className="mt-6 space-y-4">
        {inquiries.length === 0 ? <p className="text-muted">No messages yet.</p> : null}
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="rounded-2xl bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-forest">{inquiry.name}</p>
                <p className="text-sm text-muted">
                  {inquiry.email} {inquiry.phone ? `· ${inquiry.phone}` : ""} · {inquiry.topic}
                </p>
                <p className="mt-1 text-xs text-muted">{inquiry.createdAt.toLocaleString()}</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-clay">{inquiry.read ? "Read" : "New"}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-muted">{inquiry.message}</p>
            <div className="mt-4 flex gap-3">
              {!inquiry.read ? (
                <form action={markInquiryRead}>
                  <input type="hidden" name="id" value={inquiry.id} />
                  <button className="text-sm text-moss">Mark read</button>
                </form>
              ) : null}
              <form action={deleteInquiry}>
                <input type="hidden" name="id" value={inquiry.id} />
                <button className="text-sm text-clay">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
