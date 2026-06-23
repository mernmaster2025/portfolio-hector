"use client";

import { motion } from "framer-motion";
import { CalendarDays, ExternalLink, Globe2, Layers3, MapPin, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FaAndroid, FaApple, FaGithub } from "react-icons/fa";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { projects } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

type ProjectFilter = {
  label: string;
  match: (stack: string[]) => boolean;
};

const projectFilterDefinitions: ProjectFilter[] = [
  { label: "All", match: () => true },
  { label: "Flutter", match: (stack) => stack.includes("Flutter") },
  {
    label: "Mobile",
    match: (stack) =>
      stack.some((item) => ["Flutter", "React Native", "Swift", "Kotlin", "Native Mobile"].includes(item)),
  },
  { label: "React", match: (stack) => stack.includes("React") },
  { label: "Next.js", match: (stack) => stack.includes("Next.js") },
  { label: "React Native", match: (stack) => stack.includes("React Native") },
  { label: "Python", match: (stack) => stack.includes("Python") },
  { label: "TypeScript", match: (stack) => stack.includes("TypeScript") },
  { label: "Blockchain", match: (stack) => stack.some((item) => ["Blockchain", "Solidity", "Web3"].includes(item)) },
];

function ProjectLinkIcon({ href, type }: { href: string; type?: string }) {
  if (type === "ios") {
    return <FaApple className="h-4 w-4" />;
  }

  if (type === "android") {
    return <FaAndroid className="h-4 w-4" />;
  }

  if (type === "web") {
    return <Globe2 className="h-4 w-4" />;
  }

  if (type === "github" || href.includes("github.com")) {
    return <FaGithub className="h-4 w-4" />;
  }

  return <ExternalLink className="h-4 w-4" />;
}

function ProjectActionLink({
  href,
  label,
  type,
}: {
  href: string;
  label: string;
  type?: "web" | "ios" | "android" | "company" | "reference";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground light:border-slate-200 light:bg-white"
      aria-label={label}
      title={label}
    >
      <ProjectLinkIcon href={href} type={type} />
    </a>
  );
}

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeImages, setActiveImages] = useState<Record<string, string>>({});
  const [flippedProject, setFlippedProject] = useState<string | null>(null);

  const filters = useMemo(() => {
    return projectFilterDefinitions.filter(
      (filter) => filter.label === "All" || projects.some((project) => filter.match(project.stack)),
    );
  }, []);

  const filteredProjects = useMemo(() => {
    const activeDefinition = projectFilterDefinitions.find((filter) => filter.label === activeFilter);

    if (!activeDefinition || activeFilter === "All") {
      return projects;
    }

    return projects.filter((project) => activeDefinition.match(project.stack));
  }, [activeFilter]);

  return (
    <section id="projects" className="relative px-4 py-24">
      <div className="container relative z-10">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Selected projects shaped for scale, polish, and business outcomes."
          description="Enterprise AI, food delivery, mobile commerce, SaaS, and banking platform work with modern architectures and refined user experiences."
        />

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                activeFilter === filter.label
                  ? "border-primary bg-primary text-white shadow-glow"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/40 hover:text-foreground light:border-slate-200 light:bg-white",
              )}
              onClick={() => {
                setActiveFilter(filter.label);
                setFlippedProject(null);
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.08}>
              <div className="h-[34rem] [perspective:1600px]">
                <motion.article
                  className="relative h-full cursor-pointer [transform-style:preserve-3d]"
                  animate={{ rotateY: flippedProject === project.title ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setFlippedProject((current) => (current === project.title ? null : project.title))}
                >
                  <Card className="absolute inset-0 overflow-hidden p-0 [backface-visibility:hidden]">
                    <div className="relative h-[14rem] overflow-hidden rounded-t-[2rem] border-b border-white/10 bg-[#050816] light:border-slate-200">
                      {project.imageUrls?.[0] ? (
                        <>
                          <motion.div className="absolute inset-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.55 }}>
                            <Image
                              src={activeImages[project.title] ?? project.imageUrls[0]}
                              alt={`${project.company ?? project.title} project thumbnail`}
                              fill
                              sizes="(min-width: 1024px) 50vw, 100vw"
                              className="object-cover object-top"
                            />
                          </motion.div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/80 via-[#050816]/10 to-transparent" />
                          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-black/35 text-cyan-100 backdrop-blur-xl">
                              <Layers3 className="h-5 w-5" />
                            </div>
                            {project.featured ? <Badge>Featured</Badge> : null}
                          </div>
                        </>
                      ) : null}
                    </div>

                    {project.imageUrls?.length ? (
                      <div className="-mt-7 grid grid-cols-3 gap-2 px-5">
                        {project.imageUrls.slice(0, 3).map((imageUrl, imageIndex) => (
                          <button
                            key={imageUrl}
                            type="button"
                            className={cn(
                              "relative h-16 overflow-hidden rounded-2xl border bg-white/10 shadow-2xl transition",
                              (activeImages[project.title] ?? project.imageUrls?.[0]) === imageUrl
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-white/20 hover:border-primary/50",
                            )}
                            onClick={(event) => {
                              event.stopPropagation();
                              setActiveImages((current) => ({ ...current, [project.title]: imageUrl }));
                            }}
                            aria-label={`Show ${project.company ?? project.title} thumbnail ${imageIndex + 1}`}
                          >
                            <Image
                              src={imageUrl}
                              alt={`${project.company ?? project.title} thumbnail ${imageIndex + 1}`}
                              fill
                              sizes="160px"
                              className="object-cover object-top"
                            />
                          </button>
                        ))}
                      </div>
                    ) : null}

                    <div className="p-5 pb-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-sora text-2xl font-semibold">{project.company ?? project.title}</h3>
                          {project.company && project.title !== project.company ? (
                            <p className="mt-2 text-sm font-semibold text-primary">Project: {project.title}</p>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.role ? <Badge className="normal-case tracking-normal">{project.role}</Badge> : null}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {project.period ? (
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-accent" />
                            {project.period}
                          </span>
                        ) : null}
                        {project.location ? (
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-accent" />
                            {project.location}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.stack.slice(0, 7).map((technology) => (
                          <Badge key={technology} className="normal-case tracking-normal">
                            {technology}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
                        {project.links?.map((link) => (
                          <ProjectActionLink key={link.href} href={link.href} label={link.label} type={link.type} />
                        ))}
                        {project.demoUrl ? (
                          <ProjectActionLink href={project.demoUrl} label="Web" type="web" />
                        ) : null}
                        {project.githubUrl ? (
                          <ProjectActionLink href={project.githubUrl} label="GitHub" />
                        ) : null}
                      </div>
                    </div>
                  </Card>

                  <Card className="absolute inset-0 overflow-hidden p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-sora text-2xl font-semibold">{project.company ?? project.title}</h3>
                          <p className="mt-2 text-sm font-semibold text-primary">Project: {project.title}</p>
                        </div>
                        <button
                          type="button"
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground"
                          onClick={(event) => {
                            event.stopPropagation();
                            setFlippedProject(null);
                          }}
                          aria-label="Back to project summary"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="no-scrollbar mt-5 overflow-y-auto pr-2">
                        <p className="text-sm leading-7 text-muted-foreground">{project.description}</p>
                        <p className="mt-4 text-sm font-semibold leading-6 text-accent">{project.impact}</p>

                        {project.responsibilities?.length ? (
                          <div className="mt-6">
                            <h4 className="text-sm font-semibold text-foreground">Contributions</h4>
                            <ul className="mt-3 space-y-2">
                              {project.responsibilities.map((responsibility) => (
                                <li key={responsibility} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                  <span>{responsibility}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {project.achievements?.length ? (
                          <div className="mt-6">
                            <h4 className="text-sm font-semibold text-foreground">Impact</h4>
                            <ul className="mt-3 space-y-2">
                              {project.achievements.map((achievement) => (
                                <li key={achievement} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </motion.article>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
