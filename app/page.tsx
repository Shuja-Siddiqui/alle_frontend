"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import type { MouseEvent } from "react";
import { PrimaryButton } from "../components/PrimaryButton";

export default function Home() {
  const router = useRouter();

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-[#0B0F37] text-white"
      style={{ fontFamily: "var(--font-orbitron), system-ui, sans-serif" }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-top bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/background.png')",
          backgroundSize: "100% auto",
        }}
      />
      <div className="relative z-10">
        <LandingNav onSignIn={() => router.push("/student/login")} />
        <HeroSection
          onStartStudentJourney={() => router.push("/student/signup")}
          onTeacherAdminLogin={() => router.push("/admin/login")}
        />
        <TrustStrip />
        <Capabilities />
        <OurWhy />
        <HowItWorks />
        <UserValue />
        <Analytics />
        <CTA
          onStartStudentJourney={() => router.push("/student/signup")}
          onTalkToTeam={() => {
            window.location.href = "mailto:hello@eduportal.app";
          }}
        />
        <Footer />
      </div>
    </main>
  );
}

function scrollToSection(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
  event.preventDefault();
  const target = document.getElementById(sectionId);
  if (!target) return;

  const headerOffset = 96;
  const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: "smooth",
  });
}

function LandingNav({ onSignIn }: { onSignIn: () => void }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-[1440px] mt-4 px-6 md:px-10">
        <div className="rounded-2xl border border-[#E451FE80] bg-[linear-gradient(135deg,rgba(16,22,66,0.72),rgba(27,31,78,0.58))] px-4 md:px-6 py-3 flex items-center justify-between backdrop-blur-2xl supports-backdrop-filter:bg-[linear-gradient(135deg,rgba(16,22,66,0.62),rgba(27,31,78,0.5))] shadow-[0_10px_35px_rgba(7,86,255,0.2),0_0_0_1px_rgba(255,255,255,0.14)_inset,0_0_32px_rgba(228,81,254,0.18)]">
          <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
            <Image src="/assets/icons/admin/logo.svg" alt="EduPortal logo" width={32} height={32} />
            <span><span className="text-[#E451FE]">Edu</span><span className="text-white">Portal</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#C6CDFD]">
            <a href="#capabilities" onClick={(e) => scrollToSection(e, "capabilities")} className="hover:text-white transition">Platform</a>
            <a href="#why" onClick={(e) => scrollToSection(e, "why")} className="hover:text-white transition">Our Why</a>
            <a href="#how" onClick={(e) => scrollToSection(e, "how")} className="hover:text-white transition">How it works</a>
            <a href="#analytics" onClick={(e) => scrollToSection(e, "analytics")} className="hover:text-white transition">Analytics</a>
          </nav>
          <div className="flex items-center gap-2">
            <PrimaryButton
              text="Sign in"
              size="navbar"
              variant="outline"
              hideStars
              onClick={onSignIn}
              className="hidden sm:inline-flex"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function HeroSection({
  onStartStudentJourney,
  onTeacherAdminLogin,
}: {
  onStartStudentJourney: () => void;
  onTeacherAdminLogin: () => void;
}) {
  return (
    <motion.section
      id="top"
      className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="absolute inset-0 opacity-20 bg-center bg-cover bg-no-repeat mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]"
        style={{ backgroundImage: "url('/assets/icons/others/circle_bg.svg')" }}
      />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-[#E451FE33] blur-[140px]" />
      <div className="absolute top-40 right-10 size-[280px] rounded-full bg-[#0756FF2A] blur-[100px]" />

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E451FE66] bg-[#ffffff0a] px-3 py-1.5 text-xs text-[#C6CDFD]">
          Adaptive literacy, built for multilingual classrooms
        </div>
        <div className="grid lg:grid-cols-12 gap-12 mt-8 items-center">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02]">
              <span className="bg-[linear-gradient(135deg,#fff,#d7e9ff)] bg-clip-text text-transparent">Belonging</span>{" "}
              <span className="text-white/60">+</span>{" "}
              <span className="text-white">Rigor</span>{" "}
              <span className="text-white/60">+</span>{" "}
              <span className="bg-[linear-gradient(135deg,#E451FE,#FF21C8)] bg-clip-text text-transparent">Measurable Growth</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[#C6CDFD] max-w-2xl leading-relaxed">
              EduPortal grows confident readers with adaptive literacy journeys powered by phonics, speech intelligence, and real progress tracking.
            </p>
            <motion.div
              className="mt-8 flex flex-nowrap items-center gap-2 md:gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
            >
              <PrimaryButton
                text="Start Your Journey"
                size="medium"
                className="w-auto! min-w-[250px] px-6"
                onClick={onStartStudentJourney}
              />
              <PrimaryButton
                text="Teacher / Admin Login"
                size="medium"
                variant="outline"
                hideStars
                className="w-auto! min-w-[250px] px-6"
                onClick={onTeacherAdminLogin}
              />
            </motion.div>
          </motion.div>
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.14 }}
          >
            <div className="relative rounded-3xl border border-[#E451FE66] bg-[#111744D9] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Lessons", value: "1,284", trend: "+12%" },
                  { label: "Fluency", value: "87%", trend: "+6%" },
                  { label: "Engaged", value: "94%", trend: "+3%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-[#1B1F4ECC] border border-[#E451FE55] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-[#C6CDFD]">{s.label}</div>
                    <div className="text-lg font-semibold mt-1">{s.value}</div>
                    <div className="text-[10px] text-[#66A3FF] mt-0.5">{s.trend}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-[#1B1F4ECC] border border-[#E451FE55] p-4">
                <div className="flex items-end justify-between h-28 gap-2">
                  {[40, 55, 48, 70, 62, 82, 76, 90].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-md bg-[linear-gradient(to_top,#E451FE,#0756FF)]"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: 0.35 + i * 0.04 }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-[#1B1F4ECC] border border-[#E451FE55] p-4 mt-4 flex items-center gap-3">
                <div className="text-[#66A3FF] text-xl">🎤</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Pronunciation score</div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-[linear-gradient(to_right,#E451FE,#0756FF)]"
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 0.9, delay: 0.55 }}
                    />
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#66A3FF]">78</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function SectionHeader({ eyebrow, title, subtitle, align = "left" }: { eyebrow?: string; title: string; subtitle?: string; align?: "left" | "center" }) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E451FE]">
          <span className="size-1.5 rounded-full bg-[#E451FE]" /> {eyebrow}
        </div>
      )}
      <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-white [text-shadow:0_0_18px_rgba(228,81,254,0.32)]">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-[#C6CDFD] leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function TrustStrip() {
  const stats = [
    { label: "Lesson completion", value: "92%", sub: "Avg. across districts" },
    { label: "Speech growth", value: "+34%", sub: "Pronunciation accuracy / term" },
    { label: "Engagement", value: "4.6×", sub: "Sessions per learner / week" },
  ];
  return (
    <section className="mx-auto max-w-[1440px] px-6 md:px-10 -mt-6 relative z-10">
      <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="rounded-2xl border border-[#E451FE66] bg-[#111744D9] p-5 flex items-center gap-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="grid place-items-center size-12 rounded-xl bg-[#E451FE33] text-[#0756FF]">✦</div>
            <div className="flex-1">
              <div className="text-2xl font-semibold tracking-tight">{s.value}</div>
              <div className="text-xs text-[#C6CDFD]">{s.label} · {s.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Capabilities() {
  const items = [
    { title: "Adaptive Missions", desc: "Guided phonics journeys with smart progression and mastery checks tuned to each learner's pace." },
    { title: "Speech Intelligence", desc: "Speech-to-text, pronunciation scoring, and real-time feedback for measurable speaking growth." },
    { title: "School Visibility", desc: "Role-based dashboards give teachers and administrators clarity on outcomes and intervention needs." },
  ];
  return (
    <section id="capabilities" className="relative overflow-hidden py-28 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/icons/others/shiny_bg.svg')", backgroundSize: "420px 420px" }}
      />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <SectionHeader
          eyebrow="Platform capabilities"
          title="A complete literacy stack — adaptive, spoken, and measurable."
          subtitle="Three core systems designed to work together so every learner moves forward, and every educator sees how."
        />
        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              className="rounded-2xl border border-[#E451FE66] bg-[#111744D9] p-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="size-12 rounded-xl bg-[linear-gradient(135deg,rgba(228,81,254,0.25),rgba(7,86,255,0.25))] grid place-items-center">✦</div>
              <h3 className="mt-6 text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-[#C6CDFD] leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurWhy() {
  const points = [
    "Belonging-centered design",
    "Skill-level progression",
    "Speech + literacy integration",
    "Actionable analytics",
  ];
  return (
    <section id="why" className="relative overflow-hidden py-28 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/icons/others/shiny_bg.svg')", backgroundSize: "420px 420px" }}
      />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              eyebrow="Our why"
              title="Human-centered literacy support."
              subtitle="Inspired by newcomer education models, EduPortal is built around safe, inclusive, high-expectation learning — for every reader."
            />
          </motion.div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {points.map((p, i) => (
              <motion.div
                key={p}
                className="rounded-2xl border border-[#E451FE66] bg-[#111744D9] p-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -3 }}
              >
                <h3 className="font-semibold">{p}</h3>
                <p className="mt-2 text-sm text-[#C6CDFD] leading-relaxed">EduPortal helps educators identify what to teach next, not just what has been completed.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    "Adaptive phonics missions",
    "Speech practice with AI feedback",
    "Structured fluency growth",
    "Teachers monitor and guide",
  ];
  return (
    <section id="how" className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[#E451FE22] blur-[160px] pointer-events-none" />
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/icons/others/shiny_bg.svg')", backgroundSize: "420px 420px" }}
      />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <SectionHeader
            eyebrow="How it works"
            title="A clear path from first sound to confident reader."
          />
        </motion.div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s}
              className="rounded-2xl border border-[#E451FE66] bg-[#111744D9] p-6"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="text-xs font-mono text-[#66A3FF]">{`0${i + 1}`}</div>
              <h3 className="mt-4 font-semibold text-lg">{s}</h3>
              <p className="mt-2 text-sm text-[#C6CDFD] leading-relaxed">
                Students progress with confidence through clear feedback loops and mastery checkpoints.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UserValue() {
  const groups = [
    {
      role: "Students",
      title: "Motivation that travels with them",
      bullets: ["Mission-based learning", "Badges & streaks", "Clear next steps"],
    },
    {
      role: "Teachers",
      title: "Visibility into every learner",
      bullets: ["Progress at a glance", "Intervention alerts", "Speech evidence"],
    },
    {
      role: "School Leaders",
      title: "Outcomes across the school",
      bullets: ["Engagement tracking", "Cohort comparisons", "Outcome insights"],
    },
  ];
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/icons/others/shiny_bg.svg')", backgroundSize: "420px 420px" }}
      />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <SectionHeader eyebrow="Built for everyone" title="One platform. Real value for every role." />
        </motion.div>
        <div className="mt-14 grid lg:grid-cols-3 gap-5">
          {groups.map((g, i) => (
            <motion.div
              key={g.role}
              className="rounded-2xl border border-[#E451FE66] bg-[#111744D9] p-7 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="text-xs uppercase tracking-[0.2em] text-[#C6CDFD]">{g.role}</div>
              <h3 className="mt-5 text-2xl font-semibold leading-tight">{g.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-[#C6CDFD]">
                {g.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#0756FF]" /> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-[#1B1F4ECC] border border-[#E451FE55] p-4 text-sm text-[#C6CDFD]">
                Role-specific dashboards and progress snapshots
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Analytics() {
  return (
    <section id="analytics" className="relative overflow-hidden py-28 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/icons/others/shiny_bg.svg')", backgroundSize: "420px 420px" }}
      />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              eyebrow="Data & analytics"
              title="See growth happen, week by week."
              subtitle="From a single learner to a whole district — EduPortal turns reading practice into evidence you can act on."
            />
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { k: "+34%", l: "Speech growth" },
                { k: "92%", l: "Mastery rate" },
                { k: "4.6×", l: "Engagement" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  className="rounded-xl border border-[#E451FE66] p-4 bg-[#111744D9]"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: 0.08 + i * 0.07 }}
                >
                  <div className="mt-2 text-xl font-semibold">{s.k}</div>
                  <div className="text-xs text-[#C6CDFD]">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 16, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
          >
            <div className="rounded-3xl border border-[#E451FE66] bg-[#111744D9] p-6">
              <div className="flex items-end justify-between h-44 gap-2">
                {[30, 36, 42, 50, 55, 62, 66, 72, 78, 82, 86, 90].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm bg-[linear-gradient(to_top,#E451FE,#0756FF)]"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                  />
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <MetricBar label="Lesson completion" value={92} color="#E451FE" />
                <MetricBar label="Pronunciation accuracy" value={78} color="#66A3FF" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-[#E451FE66] p-4">
      <div className="text-xs text-[#C6CDFD] mb-2">{label}</div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 text-sm font-semibold">{value}%</div>
    </div>
  );
}

function CTA({
  onStartStudentJourney,
  onTalkToTeam,
}: {
  onStartStudentJourney: () => void;
  onTalkToTeam: () => void;
}) {
  return (
    <section id="cta" className="relative overflow-hidden py-28 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/icons/others/shiny_bg.svg')", backgroundSize: "420px 420px" }}
      />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-[#E451FE66] bg-[#111744D9] p-10 md:p-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(228,81,254,0.2),transparent,rgba(7,86,255,0.2))] pointer-events-none" />
          <div className="relative max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Ready to grow <span className="bg-[linear-gradient(135deg,#E451FE,#FF21C8)] bg-clip-text text-transparent">literacy outcomes?</span>
            </h2>
            <p className="mt-5 text-lg text-[#C6CDFD]">
              Bring EduPortal to your learners with measurable progress and inclusive learning experiences.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton
                text="Start Student Journey"
                size="medium"
                className="w-auto! min-w-[300px] px-8"
                onClick={onStartStudentJourney}
              />
              <PrimaryButton
                text="Talk to our team"
                size="medium"
                variant="outline"
                hideStars
                className="w-auto! min-w-[260px] px-8"
                onClick={onTalkToTeam}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    {
      title: "Educators & Schools",
      links: [
        { label: "For Teachers", href: "https://fugeesfamily.org/professional-development-for-refugee-educators/" },
        { label: "For Admins", href: "https://fugeesfamily.org/partner-with-us/" },
        { label: "Implementation", href: "https://fugeesfamily.org/what-we-do/" },
        { label: "Pricing", href: "https://fugeesfamily.org/partner-with-us/" },
      ],
    },
    {
      title: "About & Results",
      links: [
        { label: "Our Story", href: "https://fugeesfamily.org/who-we-are/" },
        { label: "Outcomes", href: "https://fugeesfamily.org/our-results/" },
        { label: "Case Studies", href: "https://fugeesfamily.org/why-newcomer-education-models-work/" },
        { label: "Press", href: "https://fugeesfamily.org/about/in-the-press/" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "https://fugeesfamily.org/faq/" },
        { label: "Guides", href: "https://fugeesfamily.org/immigration-resources/featured-fugees-resources/" },
        { label: "Webinars", href: "https://fugeesfamily.org/immigration-resources/fugees-trainings/" },
        { label: "API", href: "https://fugeesfamily.org/professional-trainings/" },
      ],
    },
    {
      title: "Policy & Advocacy",
      links: [
        { label: "Accessibility", href: "https://fugeesfamily.org/accessibility-statement/" },
        { label: "Privacy", href: "https://fugeesfamily.org/privacy-policy/" },
        { label: "Equity", href: "https://fugeesfamily.org/policy-and-advocacy/" },
        { label: "Research", href: "https://fugeesfamily.org/our-results/" },
      ],
    },
    {
      title: "Contact / Careers",
      links: [
        { label: "Contact Sales", href: "https://fugeesfamily.org/partner-with-us/" },
        { label: "Support", href: "https://fugeesfamily.org/become-a-supporter/" },
        { label: "Careers", href: "https://fugeesfamily.applytojob.com/apply" },
        { label: "Partners", href: "https://fugeesfamily.org/partner-with-us/" },
      ],
    },
  ];
  return (
    <footer className="border-t border-[#E451FE66] pt-20 pb-10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 font-semibold">
              <Image src="/assets/icons/admin/logo.svg" alt="EduPortal logo" width={32} height={32} />
              <span><span className="text-[#E451FE]">Edu</span><span className="text-white">Portal</span></span>
            </div>
            <p className="mt-4 text-sm text-[#C6CDFD] max-w-sm leading-relaxed">
              Adaptive literacy for multilingual classrooms — belonging, rigor, and measurable growth in one platform.
            </p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-5 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-sm font-semibold mb-3">{c.title}</div>
                <ul className="space-y-2 text-sm">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-[#E451FE] transition"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-[#E451FE66] flex flex-col md:flex-row justify-between gap-4 text-xs text-[#C6CDFD]">
          <div>© {new Date().getFullYear()} EduPortal. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="https://fugeesfamily.org/terms-conditions/" target="_blank" rel="noreferrer" className="hover:text-white transition">Terms</a>
            <a href="https://fugeesfamily.org/privacy-policy/" target="_blank" rel="noreferrer" className="hover:text-white transition">Privacy</a>
            <a href="https://fugeesfamily.org/accessibility-statement/" target="_blank" rel="noreferrer" className="hover:text-white transition">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
