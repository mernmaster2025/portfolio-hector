"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, Send, Sparkles } from "lucide-react";
import { Counter } from "@/components/motion/counter";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Typewriter } from "@/components/motion/typewriter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HeroCanvas } from "@/components/visual/hero-canvas";
import { profile, stats } from "@/lib/portfolio-data";

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.28], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.35]);

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-4 pb-20 pt-32">
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-24 mx-auto h-72 max-w-4xl rounded-full bg-mesh-gradient opacity-35 blur-3xl"
        animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <motion.div style={{ y, opacity }} className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge className="normal-case tracking-normal">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-accent" />
              Full-stack engineering for scalable enterprise platforms
            </Badge>
          </motion.div>

          <motion.h1
            className="mt-7 font-sora text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">{profile.name}</span>
            <span className="gradient-text mt-3 block text-4xl leading-tight sm:text-5xl lg:text-6xl">{profile.title}</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.75 }}
          >
            <Typewriter text={profile.subtitle} />
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.75 }}
          >
            <MagneticButton
              href="/assets/resume/hector-rosales-ortiz-resume.pdf"
              download
              className="w-full whitespace-nowrap px-5 text-sm sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </MagneticButton>
            <MagneticButton href="#contact" variant="secondary" className="w-full whitespace-nowrap px-5 text-sm sm:w-auto">
              <Send className="h-4 w-4" />
              Contact Me
            </MagneticButton>
            <MagneticButton href="#projects" variant="outline" className="w-full whitespace-nowrap px-5 text-sm sm:w-auto">
              View Projects
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="animated-border rounded-[2.5rem]">
            <div className="glass-panel rounded-[2.5rem] p-2">
              <HeroCanvas />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.75 } },
          }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
              }}
            >
              <Card className="rounded-3xl p-5">
                <div className="font-space text-3xl font-bold text-foreground">
                  <Counter value={stat.value} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
