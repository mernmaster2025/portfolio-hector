"use client";

import { useContext } from "react";
import { ThemeContext } from "@/components/providers/app-providers";

const CONTRA_USERNAME = "papalotl_mk_ux4q3uiz";
const CONTRA_ANALYTICS_USER_ID = "ed821d13-81e8-4224-9601-0d425bd92db3";

export function ContraHireMeButton() {
  const { mode } = useContext(ThemeContext);
  const contraTheme = mode === "dark" ? "light" : "dark";
  const href = `https://contra.com/${CONTRA_USERNAME}?utm_campaign=HireMeOnContra&utm_medium=${CONTRA_ANALYTICS_USER_ID}`;
  const imageBase = `https://contra.com/static/embed/media/hiremeoncontra-${contraTheme}`;

  return (
    <a
      href={href}
      rel="nofollow noreferrer"
      target="_blank"
      title="Contra.com"
      aria-label="Hire me on Contra"
      className="inline-flex items-center transition hover:-translate-y-1"
    >
      <img
        alt="Hire Me on Contra"
        src={`${imageBase}.png`}
        srcSet={`${imageBase}.png 1x, ${imageBase}@2x.png 2x`}
        className="h-11 w-auto border-0"
      />
    </a>
  );
}
