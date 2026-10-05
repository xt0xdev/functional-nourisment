import { redirect, unstable_rethrow } from "next/navigation";

export const ADMIN_SAVED_PARAM = "saved";
export const ADMIN_ERROR_PARAM = "error";

function withQuery(path: string, key: string, value: string, clear: string) {
  const [pathname, existing] = path.split("?");
  const params = new URLSearchParams(existing || "");
  params.set(key, value);
  params.delete(clear);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function withSavedQuery(path: string) {
  return withQuery(path, ADMIN_SAVED_PARAM, "1", ADMIN_ERROR_PARAM);
}

export function withErrorQuery(path: string) {
  return withQuery(path, ADMIN_ERROR_PARAM, "1", ADMIN_SAVED_PARAM);
}

export function redirectSaved(path: string): never {
  redirect(withSavedQuery(path));
}

export function redirectSaveError(path: string): never {
  redirect(withErrorQuery(path));
}

export async function finishAdminSave(fallbackPath: string, work: () => Promise<string | void>) {
  try {
    const path = (await work()) || fallbackPath;
    redirectSaved(path);
  } catch (error) {
    unstable_rethrow(error);
    redirectSaveError(fallbackPath);
  }
}
