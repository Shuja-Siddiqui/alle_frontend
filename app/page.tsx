"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EduPortal } from "../components/EduPortal";

export default function Home() {
  const featureCards = [
    {
      title: "Adaptive Missions",
      text: "Students move through guided phonics journeys with smart next-step logic, mastery checks, and resume-aware flow.",
    },
    {
      title: "Speech Intelligence",
      text: "STT, pronunciation scoring, and speech feedback transform speaking practice into measurable literacy growth.",
    },
    {
      title: "School Visibility",
      text: "Teachers and admins track completion, engagement trends, and outcomes through role-specific dashboards.",
    },
  ];
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main
      className="relative w-full overflow-hidden pb-0 pt-0 text-[#f3f6ff]"
      style={{ fontFamily: "var(--font-orbitron), system-ui, sans-serif" }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/background.png')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[#080b20cc]" />
      <div className="relative z-10 mx-auto w-full max-w-6xl bg-transparent">
        <motion.header
          className="flex items-center justify-between px-5 py-5 sm:px-8"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <EduPortal onClick={() => {}} />
          <div className="flex items-center gap-3">
            <Link href="/student/login" className="text-xs font-semibold uppercase tracking-wider text-[#d8dfff] hover:text-white hover:underline">
              Sign In
            </Link>
            <Link
              href="/student/signup"
              className="rounded-full bg-[linear-gradient(88.47deg,#F529F9_1.65%,#0756FF_57.2%,#FF21C8_89.22%)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:brightness-110"
            >
              Start Learning
            </Link>
          </div>
        </motion.header>

        <motion.section
          className="grid gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:items-center"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E451FE]">
              Belonging + Rigor + Measurable Growth
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              <span className="text-[#E451FE]">Edu</span>Portal grows confident readers with adaptive literacy journeys
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/90">
              We combine adaptive phonics missions, speech intelligence, and role-based analytics
              to help multilingual and emerging readers accelerate while teachers and school leaders
              stay fully equipped with real progress signals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/student/signup" className="rounded-full bg-[linear-gradient(88.47deg,#F529F9_1.65%,#0756FF_57.2%,#FF21C8_89.22%)] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:brightness-110">
                Start Student Journey
              </Link>
              <Link href="/admin/login" className="rounded-full border border-[#E451FEAA] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#f6f8ff] transition hover:bg-[#ffffff1a]">
                Teacher/Admin Login
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="relative mx-auto h-[320px] w-full max-w-[380px]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
          >
            <motion.div
              className="absolute left-8 top-0 h-60 w-60 rounded-full bg-[#E451FE33]"
              animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.8, 0.55] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-0 top-8 h-[260px] w-[220px] rounded-[8px] border border-[#E451FE99] bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/background.png')" }}
              whileHover={{ y: -6, rotate: -1.2 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-[220px] rounded-[8px] border border-[#E451FE88] bg-[#0F173AEE] p-4"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-xs uppercase tracking-wider text-[#E451FE]">Live outcomes</p>
              <p className="mt-2 text-sm text-white">Track lesson completion, speech growth, and engagement in one place.</p>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          className="px-5 py-10 sm:px-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#E451FE]">
            Platform capabilities
          </p>
          <motion.div
            className="grid gap-4 md:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {featureCards.map((item) => (
              <motion.article
                key={item.title}
                variants={fadeUp}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="rounded-[10px] border border-[#E451FE99] bg-[linear-gradient(154.52deg,#0B0F37_12.01%,#1B1F4E_94.63%)] p-5 transition hover:-translate-y-0.5"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/90">{item.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="grid lg:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <motion.div
            className="min-h-[300px] bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/background.png')" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          <motion.div
            className="bg-[#0f173a66] px-5 py-10 sm:px-8"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E451FE]">Our why</p>
            <h3 className="mt-3 text-3xl font-semibold leading-tight text-white">
              Human-centered literacy support inspired by proven newcomer education models
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/90">
              Zentu supports high expectations with safe and inclusive learning experiences. Students
              build language confidence through consistent, personalized practice while educators use
              data-informed signals to guide interventions.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs uppercase tracking-wider text-[#f2f5ff]">
              {[
                "Belonging-centered design",
                "Skill-level progression",
                "Speech + literacy integration",
                "Actionable school analytics",
              ].map((pill, i) => (
                <motion.div
                  key={pill}
                  className="rounded-[8px] border border-[#E451FE80] bg-[linear-gradient(154.52deg,#0B0F37_12.01%,#1B1F4E_94.63%)] px-3 py-2 text-white"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                >
                  {pill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          className="px-5 py-10 sm:px-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#E451FE]">
            What people value in EduPortal
          </p>
          <motion.div
            className="mt-7 grid gap-4 md:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            {[
              "Students stay motivated with mission flow, badges, and clear next steps.",
              "Teachers get clarity on each learner's progress and intervention needs.",
              "School leaders track engagement and completion trends with confidence.",
            ].map((quote) => (
              <motion.article
                key={quote}
                variants={fadeUp}
                transition={{ duration: 0.35, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="rounded-[10px] border border-[#E451FE99] bg-[linear-gradient(154.52deg,#0B0F37_12.01%,#1B1F4E_94.63%)] p-5"
              >
                <p className="text-sm leading-6 text-white/90">{quote}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="bg-[#110F32E6] px-5 py-10 text-center sm:px-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h3 className="text-3xl font-semibold text-white">Ready to grow literacy outcomes?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/90">
            Bring Zentu to your learners with an experience that blends academic acceleration,
            belonging, and real progress visibility.
          </p>
          <motion.div
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <Link
            href="/student/signup"
            className="mt-6 inline-flex rounded-full bg-[linear-gradient(88.47deg,#F529F9_1.65%,#0756FF_57.2%,#FF21C8_89.22%)] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:brightness-110"
          >
            Start Student Journey
          </Link>
          </motion.div>
        </motion.section>

        <footer className="bg-[#0B0F37] px-5 py-10 text-[#d8ddf1] sm:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="pointer-events-none">
                <EduPortal onClick={() => {}} />
              </div>
              <p className="mt-3 text-sm leading-6 text-[#c7cde8]">
                Adaptive literacy platform for students, teachers, and school communities.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E451FE]">Educators & Schools</h5>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-white" href="https://fugeesfamily.org/fundraise/" target="_blank" rel="noreferrer">Donate / Fundraise</a></li>
                <li><a className="hover:text-white" href="https://fugeesfamily.org/professional-trainings/" target="_blank" rel="noreferrer">Professional Development Trainings</a></li>
                <li><a className="hover:text-white" href="https://fugeesfamily.org/newcomer-model/" target="_blank" rel="noreferrer">English Language Learner Model</a></li>
                <li><a className="hover:text-white" href="https://fugeesfamily.org/what-we-do/" target="_blank" rel="noreferrer">District Partnerships</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E451FE]">Refugees & Immigrants</h5>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-white" href="https://fugeesfamily.org/" target="_blank" rel="noreferrer">Resource Library</a></li>
                <li><a className="hover:text-white" href="https://fugeesfamily.org/policy-and-advocacy/" target="_blank" rel="noreferrer">Policy and Advocacy</a></li>
                <li><a className="hover:text-white" href="https://fugeesfamily.org/about/join-our-team/" target="_blank" rel="noreferrer">Job Opportunities</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E451FE]">About & Results</h5>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-white" href="https://fugeesfamily.org/who-we-are/" target="_blank" rel="noreferrer">Who We Are</a></li>
                <li><a className="hover:text-white" href="https://fugeesfamily.org/our-why/" target="_blank" rel="noreferrer">Our Why</a></li>
                <li><a className="hover:text-white" href="https://fugeesfamily.org/our-results/" target="_blank" rel="noreferrer">Our Results</a></li>
                <li><a className="hover:text-white" href="https://fugeesfamily.org/our-team/" target="_blank" rel="noreferrer">Our Team</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
