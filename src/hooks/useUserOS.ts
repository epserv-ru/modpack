'use client';
import {useState} from "react";
import {APP_LINKS} from "@/constants/api.ts";

export interface ModpackLink {
  name: string
  link: string
}

function getUserOS(): ModpackLink {
  if (typeof window === "undefined") {
    return { name: "Windows", link: APP_LINKS.WINDOWS };
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.includes('win')) return { name : "Windows", link : APP_LINKS.WINDOWS };
  if (userAgent.includes('mac')) return { name: "MacOS", link: APP_LINKS.MACOS };
  if (userAgent.includes('linux')) return { name: "Linux", link: APP_LINKS.LINUX };
  return { name: "Windows", link: APP_LINKS.WINDOWS };
}

export function useUserOS() {
  const [os, setOS] = useState<ModpackLink | null>(null)

  if (typeof window !== "undefined" && os === null) {
    setOS(getUserOS())
  }

  return os;
}
