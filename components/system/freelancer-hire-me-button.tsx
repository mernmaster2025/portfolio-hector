"use client";

import { useContext } from "react";
import { SiFreelancer } from "react-icons/si";
import { ThemeContext } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

const FREELANCER_USERNAME = "hectorortiz26";
const FREELANCER_HIRE_ME_URL = `https://www.freelancer.com/u/${FREELANCER_USERNAME}`;

export function FreelancerHireMeButton() {
  const { mode } = useContext(ThemeContext);
  const badgeTheme = mode;

  return (
    <a
      href={FREELANCER_HIRE_ME_URL}
      rel="nofollow noreferrer"
      target="_blank"
      title="Freelancer.com"
      aria-label="Hire me on Freelancer"
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border px-3 transition hover:-translate-y-1",
        badgeTheme === "light"
          ? "border-slate-200 bg-white text-slate-900 shadow-sm"
          : "border-slate-700 bg-[#0c2d44] text-white",
      )}
    >
      <SiFreelancer className={cn("h-4 w-4 shrink-0", badgeTheme === "light" ? "text-[#29B2FE]" : "text-[#7fd3ff]")} />
      <span className="whitespace-nowrap text-[11px] font-semibold leading-none">Hire me</span>
    </a>
  );
}
