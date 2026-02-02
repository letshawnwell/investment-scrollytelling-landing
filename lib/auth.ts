import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";
const TOKEN = process.env.ADMIN_TOKEN || "poweradmin-token";

export function requireAuth() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token || token !== TOKEN) {
    return false;
  }
  return true;
}
