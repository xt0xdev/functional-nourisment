import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/experiences", label: "Experiences" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/posts", label: "Journal" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-forest p-5 text-cream md:w-64">
        <p className="font-serif text-2xl">FN Admin</p>
        <p className="mt-1 text-xs text-cream/70">{user.email}</p>
        <nav className="mt-6 grid gap-2 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 hover:bg-white/10">
              {item.label}
            </Link>
          ))}
          <Link href="/" className="rounded-lg px-3 py-2 text-gold hover:bg-white/10">
            View site
          </Link>
          <LogoutButton />
        </nav>
      </aside>
      <div className="flex-1 p-4 md:p-8">{children}</div>
    </div>
  );
}
