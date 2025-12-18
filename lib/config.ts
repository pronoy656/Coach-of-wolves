const isLocal =
  typeof window !== "undefined" && window.location.hostname === "localhost";
//it,s fort only frontend
export const BASE_URL = isLocal
  ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL
  : process.env.NEXT_PUBLIC_LIVE_BASE_URL;

//it,s fort only backend.
export const BASE_API = isLocal
  ? process.env.NEXT_PUBLIC_LOCAL_BASE_API
  : process.env.NEXT_PUBLIC_LIVE_BASE_API;

export const admin_email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
