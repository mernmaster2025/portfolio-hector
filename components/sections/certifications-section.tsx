"use client";

import { Award, ExternalLink, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { certifications } from "@/lib/portfolio-data";

export function CertificationsSection() {
  return (
    <section id="certifications" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Certifications"
          title="Verified engineering credentials."
          description="Verified credentials from HackerRank and freeCodeCamp across frontend engineering, software engineering, JavaScript, SQL, Node.js, Python, algorithms, and problem solving."
        />

        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          {certifications.map((certification, index) => (
            <Reveal key={certification.href} delay={index * 0.06} className="h-full">
              <Card className="group h-full overflow-hidden p-0 sm:h-[9.75rem]">
                <div className="grid h-full sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <div className="relative h-32 overflow-hidden border-b border-white/10 bg-white light:border-slate-200 sm:h-full sm:border-b-0 sm:border-r">
                    <Image
                      src={certification.imageUrl}
                      alt={`${certification.title} certificate`}
                      fill
                      sizes="(min-width: 1024px) 12rem, (min-width: 640px) 12rem, 100vw"
                      className="object-contain object-center p-2 transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                  <div className="flex flex-col justify-between p-3.5">
                    <div>
                      <div className="flex items-center gap-2 text-accent">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em]">{certification.provider}</span>
                      </div>
                      <h3 className="mt-2 font-sora text-lg font-semibold leading-tight text-foreground">{certification.title}</h3>
                      <p className="mt-2 text-xs font-semibold text-primary">{certification.category}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-200 light:text-amber-700">
                        <Award className="h-3.5 w-3.5" />
                        Verified certificate
                      </div>
                      <a
                        href={certification.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground light:border-slate-200 light:bg-white"
                        aria-label={`Verify ${certification.title}`}
                      >
                        Verify
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
