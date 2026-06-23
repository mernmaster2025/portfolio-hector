"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { capabilities } from "@/lib/portfolio-data";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card } from "@/components/ui/card";

const storyPoints = [
  "Senior full stack engineer with 10+ years building web applications, native mobile products, backend services, and cloud infrastructure for high-growth startups and enterprise teams across fintech, delivery, SaaS, and platform engineering.",
  "I specialize in translating complex business goals into scalable system design, well-structured APIs, premium user experiences, and reliable delivery plans—balancing speed, code quality, and long-term maintainability from discovery through production.",
  "My work spans robust backend architecture, production integrations, and AI-powered product delivery—including assistants, automation, and LLM-driven workflows that help teams ship faster and create measurable business value.",
];

export function AboutSection() {
  return (
    <section id="about" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="About Me"
          title="A product-minded engineer for scalable digital products."
          description="I combine full-stack delivery, backend architecture, cloud systems, and technical leadership to help teams ship polished products with durable engineering."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal direction="right">
            <Card className="relative overflow-hidden p-8">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 p-3 shadow-glow light:border-slate-200">
                <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-white/20 bg-background/40 backdrop-blur-xl">
                  <Image
                    src="/assets/hector-rosales-ortiz.png"
                    alt="Portrait of Hector Rosales Ortiz"
                    fill
                    priority
                    sizes="(min-width: 1024px) 360px, 85vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent p-6">
                    <p className="font-sora text-2xl font-semibold">Hector Rosales Ortiz</p>
                    <p className="mt-2 text-sm text-muted-foreground">Senior AI & Full Stack Engineer</p>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>

          <div className="space-y-6">
            <Reveal>
              <Card className="p-8">
                <h3 className="font-sora text-2xl font-semibold">Full-stack leadership with product focus.</h3>
                <div className="mt-6 space-y-4">
                  {storyPoints.map((point) => (
                    <p key={point} className="leading-8 text-muted-foreground">
                      {point}
                    </p>
                  ))}
                </div>
              </Card>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {capabilities.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08}>
                  <Card className="group h-full p-5">
                    <motion.div
                      className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"
                      whileHover={{ rotate: 8, scale: 1.06 }}
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.div>
                    <h4 className="font-sora text-lg font-semibold">{item.title}</h4>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="mt-12">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-secondary to-accent sm:left-1/2" />
            {["Discovery", "Architecture", "Delivery", "Optimization"].map((item, index) => (
              <div key={item} className="relative mb-8 grid gap-6 sm:grid-cols-2">
                <div className={index % 2 === 0 ? "sm:text-right" : "sm:col-start-2"}>
                  <Card className="rounded-3xl p-5">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">0{index + 1}</span>
                    <h4 className="mt-2 font-sora text-xl font-semibold">{item}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {index === 0 && "Clarify outcomes, users, constraints, and the business value behind the work."}
                      {index === 1 && "Design scalable foundations across UI, API, data, AI, and cloud infrastructure."}
                      {index === 2 && "Ship maintainable products with strong code quality and high-performance UX."}
                      {index === 3 && "Measure, refine, automate, and improve reliability after launch."}
                    </p>
                  </Card>
                </div>
                <span className="absolute left-4 top-7 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-accent shadow-cyan-glow sm:left-1/2" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
