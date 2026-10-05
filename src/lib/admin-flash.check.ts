import { withErrorQuery, withSavedQuery } from "./admin-flash";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(withSavedQuery("/admin/settings") === "/admin/settings?saved=1", "settings save should flash saved=1");
assert(withSavedQuery("/admin/pages/abc") === "/admin/pages/abc?saved=1", "page save should keep the editor path");
assert(withSavedQuery("/admin/menu?tab=header") === "/admin/menu?tab=header&saved=1", "existing query params should be preserved");
assert(withErrorQuery("/admin/settings?saved=1") === "/admin/settings?error=1", "error flash should replace a leftover saved flag");
assert(withSavedQuery("/admin/events/1?error=1") === "/admin/events/1?saved=1", "saved flash should replace a leftover error flag");

console.log("admin-flash.check: ok");
