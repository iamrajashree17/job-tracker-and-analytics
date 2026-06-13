"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

const AUTH_PATHS = ["/login", "/signup"];

export default function HeaderWrapper() {
  const pathname = usePathname();
  if (AUTH_PATHS.includes(pathname)) return null;
  return <Header />;
}
