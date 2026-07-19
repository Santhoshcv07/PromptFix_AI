"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  PenLine,
  Brain,
  Wand2,
  Copy,
  Share2,
  ArrowLeft,
  Check,
  Send,
  ArrowDown,
  Lightbulb,
  Loader2,
  CheckCircle,
} from "lucide-react";

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: "easeInOut",
    },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

const checkPop: Variants = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

export default function Home() {
  const [showResult, setShowResult] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleImprove = async () => {
    if (!prompt.trim()) return;
    
    setShowResult(true);
    setIsLoading(true);
    setIsError(false);
    
    // Smooth transition feels better when we clear previous output
    setImprovedPrompt("");
    
    try {
      const response = await fetch("http://localhost:8000/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) throw new Error("Failed to generate");
      
      const data = await response.json();
      setImprovedPrompt(data.improved_prompt);
    } catch (err) {
      console.error("API Error:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!improvedPrompt) return;
    navigator.clipboard.writeText(improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!improvedPrompt) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'PromptFix AI',
          text: `Check out my improved prompt:\n\n${improvedPrompt}`,
        });
      } else {
        // Fallback
        handleCopy();
      }
    } catch (e) {
      console.log('Error sharing:', e);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showResult ? (
        /* ───────────────────── RESULT PAGE ───────────────────── */
        <motion.div
          key="result"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={pageTransition}
          className="page-shell min-h-screen md:min-h-0 flex flex-col overflow-x-hidden"
        >
          {/* Nav */}
          <nav className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-2.5 md:py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-text" />
              </div>
              <span className="font-semibold text-lg">
                PromptFix <span className="text-accent">AI</span>
              </span>
            </div>
            <motion.button
              onClick={handleShare}
              disabled={isLoading || !improvedPrompt}
              className="btn-hover flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg border border-card hover:bg-card/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.97 }}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Share</span>
            </motion.button>
          </nav>

          {/* Main */}
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 flex flex-col py-2 md:py-0 min-h-0">
            {/* Back */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="w-full flex justify-start mb-2 md:mb-2 shrink-0">
              <button
                onClick={() => {
                  setShowResult(false);
                  setCopied(false);
                }}
                className="flex items-center gap-2 text-sm text-text/80 hover:text-text transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </motion.div>

            {/* Success header */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center mb-3 md:mb-3 text-center shrink-0">
              <motion.div
                variants={checkPop}
                initial="hidden"
                animate="visible"
                className="w-9 h-9 rounded-full border border-accent flex items-center justify-center mb-1.5"
              >
                <Check className="w-4 h-4 text-accent" />
              </motion.div>
              <h1 className="text-xl sm:text-2xl font-serif mb-1">Your Prompt is Ready!</h1>
              <p className="text-text/70 text-xs sm:text-sm">Here&apos;s your improved prompt. Copy it and get better results.</p>
            </motion.div>

            {/* Original Prompt Card - Now Editable */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="w-full bg-surface border border-card rounded-xl p-3.5 md:p-4 mb-2 shrink-0">
              <div className="flex items-center gap-2 mb-2 text-text/90">
                <PenLine className="w-4 h-4" />
                <span className="font-medium text-sm">Original Prompt</span>
              </div>
              <div className="bg-background rounded-lg p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-0 sm:justify-between transition-shadow duration-300 focus-within:shadow-[0_0_0_1px_rgba(109,93,110,0.4)]">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none text-text/80 flex-1 text-sm min-h-[44px] py-1 scrollbar-hide"
                  rows={2}
                  placeholder="Type your prompt here..."
                />
                <motion.button
                  onClick={handleImprove}
                  disabled={isLoading || !prompt.trim()}
                  className="btn-hover w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-1.5 bg-accent rounded-lg text-sm font-medium sm:ml-4 hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.97 }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </motion.button>
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="flex justify-center mb-1.5 md:mb-1 shrink-0">
              <ArrowDown className="w-4 h-4 text-accent" />
            </motion.div>

            {/* Improved Prompt Card */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="w-full bg-surface border border-card rounded-xl p-3.5 md:p-4 mb-2.5 md:mb-2 flex flex-col min-h-0 md:flex-1">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium text-sm">Improved Prompt</span>
                </div>
                <span className="text-[11px] bg-accent/20 text-accent px-2.5 py-0.5 rounded-full">
                  AI optimized
                </span>
              </div>

              {/* Dynamic Content Area */}
              <div className="bg-background border border-card rounded-lg p-3.5 mb-2.5 md:mb-2 flex-1 min-h-[100px] md:min-h-0 whitespace-pre-wrap leading-relaxed text-sm text-text/90 overflow-y-auto scrollbar-hide relative">
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-text/50 gap-3"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-accent" />
                    <span className="text-sm font-medium">Optimizing your prompt...</span>
                  </motion.div>
                ) : isError ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-red-400 gap-2"
                  >
                    <span className="text-sm font-medium">Failed to generate prompt. Please try again.</span>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {improvedPrompt}
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-0 shrink-0">
                <motion.button
                  onClick={handleImprove}
                  disabled={isLoading || !prompt.trim()}
                  className="btn-hover flex items-center justify-center gap-2 px-3.5 py-1.5 bg-card rounded-lg text-sm font-medium hover:bg-card/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.97 }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Regenerate
                </motion.button>
                <motion.button
                  onClick={handleCopy}
                  disabled={isLoading || isError || !improvedPrompt}
                  className="btn-hover flex items-center justify-center gap-2 px-5 py-1.5 bg-accent rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.97 }}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Copied!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Prompt
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>

            {/* Tip Card */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-0 bg-card/30 border border-card rounded-lg p-2.5 md:p-3 mb-2 md:mb-1 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Tip: The more specific you are, <span className="text-text">the better the results.</span></p>
                  <p className="text-[11px] text-text/60 mt-0.5">Add context, details, and your goal for optimal prompts.</p>
                </div>
              </div>
              <button
                className="flex items-center gap-1 text-xs sm:text-sm text-text/80 hover:text-text shrink-0 transition-colors ml-10 sm:ml-0"
              >
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </main>
        </motion.div>
      ) : (
        /* ───────────────────── HOME PAGE ───────────────────── */
        <motion.div
          key="home"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={pageTransition}
          className="page-shell min-h-screen md:min-h-0 flex flex-col overflow-x-hidden"
        >
          {/* Nav */}
          <motion.nav variants={fadeIn} initial="hidden" animate="visible" className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-2.5 md:py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-text" />
              </div>
              <span className="font-semibold text-base sm:text-lg">
                PromptFix <span className="text-accent">AI</span>
              </span>
            </div>

            <div className="hidden sm:flex flex-col items-center">
              <span className="text-sm font-medium mb-0.5">Home</span>
              <div className="w-7 h-0.5 bg-accent rounded-full"></div>
            </div>

            <motion.button
              onClick={() => {
                if (prompt.trim()) {
                  handleImprove();
                } else {
                  setShowResult(true); // just go to result page to test
                }
              }}
              className="btn-hover flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent rounded-lg text-xs sm:text-sm font-medium hover:bg-accent/90 transition-colors"
              whileTap={{ scale: 0.97 }}
            >
              Try it free <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.nav>

          {/* Main content */}
          <main className="hero-glow flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex flex-col items-center justify-center relative z-10 py-3 md:py-0 min-h-0">
            {/* Badge */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="badge-hover flex items-center gap-1.5 px-3 py-1 rounded-full border border-card bg-card/30 mb-3 md:mb-3 shrink-0 cursor-default">
              <Sparkles className="w-3 h-3 text-text" />
              <span className="text-[11px] text-text/80">AI-Powered Prompt Optimizer</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible" className="heading-fluid font-serif text-center mb-2 md:mb-2.5 tracking-tight max-w-3xl shrink-0">
              Transform Ordinary<br className="hidden sm:block" />
              {" "}Prompts Into<br className="hidden sm:block" />
              {" "}<span className="text-warm">Powerful</span> AI Prompts.
            </motion.h1>

            {/* Subtitle */}
            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible" className="text-center text-text/70 text-xs sm:text-sm lg:text-base mb-4 md:mb-4 max-w-md px-2 shrink-0">
              Improve clarity, add context, and get better results
              from ChatGPT, Claude, Gemini, and more.
            </motion.p>

            {/* Input Card */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-2xl bg-surface border border-card rounded-xl p-3.5 sm:p-4 mb-4 md:mb-4 shrink-0">
              <div className="bg-background rounded-lg p-2.5 sm:p-3 border border-card flex flex-col min-h-[70px] md:min-h-[80px] mb-2.5 transition-shadow duration-300 focus-within:shadow-[0_0_0_1px_rgba(109,93,110,0.4)]">
                <div className="flex items-start gap-2">
                  <PenLine className="w-4 h-4 text-text/50 mt-0.5 shrink-0" />
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Paste your prompt here..."
                    className="w-full bg-transparent border-none outline-none resize-none text-text placeholder:text-text/40 min-h-[45px] md:min-h-[50px] text-sm scrollbar-hide"
                    maxLength={2000}
                  />
                </div>
                <div className="w-full flex justify-end">
                  <span className="text-[11px] text-text/40">{prompt.length} / 2000</span>
                </div>
              </div>
              <motion.button
                onClick={handleImprove}
                disabled={!prompt.trim() || isLoading}
                className="btn-hover w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 bg-accent rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isLoading ? "Optimizing..." : "Improve Prompt"}
              </motion.button>
            </motion.div>

            {/* Works great with */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-2xl flex flex-col items-center mb-3.5 md:mb-4 shrink-0">
              <div className="flex items-center gap-3 mb-2.5 w-full max-w-xs px-4">
                <div className="h-px bg-card flex-1"></div>
                <span className="text-[11px] text-text/50 tracking-wide font-medium whitespace-nowrap">Works great with</span>
                <div className="h-px bg-card flex-1"></div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 px-2">
                {[
                  { name: "ChatGPT", color: "#10A37F", icon: <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M22.28 9.37a5.83 5.83 0 0 0-.52-4.82A5.93 5.93 0 0 0 15.39 1.5a5.83 5.83 0 0 0-4.4-2A5.93 5.93 0 0 0 5.49 2.56a5.83 5.83 0 0 0-3.9 2.82A5.93 5.93 0 0 0 2.3 12.2a5.83 5.83 0 0 0 .52 4.82 5.93 5.93 0 0 0 6.37 3.05 5.83 5.83 0 0 0 4.4 2A5.93 5.93 0 0 0 19.09 19a5.83 5.83 0 0 0 3.9-2.82 5.93 5.93 0 0 0-.71-6.81z" fill="white"/></svg>, textColor: undefined },
                  { name: "Claude", color: "#D4A574", icon: <span className="text-[7px] font-bold text-white">✦</span>, textColor: "text-[#D4A574]" },
                  { name: "Gemini", color: "#4285F4", icon: <Sparkles className="w-2.5 h-2.5 text-white/90" />, textColor: undefined },
                  { name: "Copilot", color: "#8B5CF6", icon: <span className="text-[7px] font-bold text-white">🟪</span>, textColor: undefined },
                ].map((badge, i) => (
                  <motion.div
                    key={badge.name}
                    className="badge-hover flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md border border-card bg-card/20 cursor-default"
                    custom={i}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: (j: number) => ({
                        opacity: 1, y: 0,
                        transition: { delay: 0.4 + j * 0.06, duration: 0.35, ease: "easeInOut" },
                      }),
                    } as Variants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="w-3.5 h-3.5 rounded-sm flex items-center justify-center" style={{ backgroundColor: badge.color }}>
                      {badge.icon}
                    </div>
                    <span className={`text-xs font-medium ${badge.textColor || ""}`}>{badge.name}</span>
                  </motion.div>
                ))}
                <motion.div
                  className="badge-hover flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md border border-card bg-card/20 cursor-default"
                  custom={4}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { delay: 0.64, duration: 0.35, ease: "easeInOut" } },
                  } as Variants}
                  initial="hidden"
                  animate="visible"
                >
                  <span className="text-xs text-text/60">&</span>
                  <span className="text-xs font-medium">More</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Features */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-2.5 shrink-0">
              {[
                { icon: <Brain className="w-4 h-4 text-accent" />, title: "AI-Powered", desc: "Deep analysis to understand your prompt and fill the gaps." },
                { icon: <Wand2 className="w-4 h-4 text-accent" />, title: "Better Prompts", desc: "AI rewrites your prompt for clarity, structure, and impact." },
                { icon: <Copy className="w-4 h-4 text-accent" />, title: "One-Click Copy", desc: "Copy your improved prompt and use it anywhere." },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  custom={5 + i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="card-glow card-hover bg-card/20 border border-card rounded-lg p-3 flex items-start gap-2.5 cursor-default"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#4A2D5C] flex items-center justify-center shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5 text-sm">{feature.title}</h3>
                    <p className="text-[11px] text-text/60 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>

          {/* Footer */}
          <motion.footer variants={fadeIn} initial="hidden" animate="visible" className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-2.5 md:py-3 border-t border-card flex flex-col md:flex-row items-center justify-between gap-2 shrink-0">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-5 h-5 rounded bg-card flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-text" />
                </div>
                <span className="font-semibold text-sm">
                  PromptFix <span className="text-accent">AI</span>
                </span>
              </div>
              <p className="text-[11px] text-text/50">Better prompts. Better AI results.</p>
            </div>
            <p className="text-[11px] text-text/50">© 2025 PromptFix AI. All rights reserved.</p>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
