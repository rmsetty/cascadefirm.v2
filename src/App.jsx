import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// --- Primitives ---

const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ index, label }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="font-mono text-accent text-sm">{index}</span>
    <div className="h-[1px] w-8 bg-border-strong"></div>
    <span className="eyebrow">{label}</span>
  </div>
);

// --- Global Interactive Modals ---

const VideoModal = ({ isOpen, onClose, videoUrl }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl overflow-hidden aspect-video bg-surface border border-border shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors bg-background/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-border"
          >
            Close ✕
          </button>
          <iframe 
            src={videoUrl} 
            webkitallowfullscreen="true" 
            mozallowfullscreen="true" 
            allowfullscreen="true" 
            className="w-full h-full border-0"
            title="System Architecture Walkthrough"
          ></iframe>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const BookingModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg bg-background border border-border p-8 md:p-10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
          <div className="mb-6">
            <span className="eyebrow text-accent block mb-2">Boutique Partnership</span>
            <h3 className="display-serif text-3xl text-foreground">Initiate Scoping</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Select a confidential timeslot to map your current intake architecture and assess potential operational ROI.
          </p>
          
          {/* Static representation of an institutional booking widget */}
          <div className="space-y-4">
            <div className="border border-border p-4 rounded bg-surface hover:border-accent transition-colors cursor-pointer flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-foreground">15-Min Exploratory Call</div>
                <div className="text-xs text-muted-foreground">Initial alignment & bottleneck analysis</div>
              </div>
              <span className="text-accent text-sm">&rarr;</span>
            </div>
            <div className="border border-border p-4 rounded bg-surface hover:border-accent transition-colors cursor-pointer flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-foreground">45-Min Technical Deep Dive</div>
                <div className="text-xs text-muted-foreground">Legacy CRM & pipeline evaluation</div>
              </div>
              <span className="text-accent text-sm">&rarr;</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Next available openings: This week</span>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Layout Components ---

const Nav = ({ onBookCall }) => (
  <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/70 border-b border-border h-14">
    <div className="container-tight h-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
        <span className="font-medium tracking-tight text-foreground text-sm">Cascade Firm</span>
      </div>
      <div className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <a href="#problem" className="hover:text-foreground transition-colors">Approach</a>
        <a href="#infrastructure" className="hover:text-foreground transition-colors">Infrastructure</a>
        <a href="#process" className="hover:text-foreground transition-colors">Process</a>
        <a href="#case" className="hover:text-foreground transition-colors">Case study</a>
      </div>
      <button 
        onClick={onBookCall}
        className="hidden md:inline-flex bg-foreground text-background px-4 py-1.5 rounded-full text-xs font-medium hover:bg-accent hover:text-background transition-colors"
      >
        Book a call &rarr;
      </button>
    </div>
  </nav>
);

const Hero = ({ onWatchVideo, onBookCall }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={ref} id="top" className="relative pt-32 pb-20 overflow-hidden border-b border-border">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse at top, black, transparent 80%)'
      }}></div >
      
      <motion.div style={{ y, opacity }} className="container-tight relative z-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-1.5 rounded-sm bg-accent"></div>
            <span className="eyebrow">AI Systems For Lower-Middle-Market M&A</span>
          </div>
          <h1 className="display-serif text-[clamp(2.5rem,6vw,5rem)] max-w-4xl mb-6 text-foreground leading-[1.05]">
            Automate Your Deal Intake. <span className="italic text-accent">Close Faster.</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
            We are a specialized consulting & development shop that helps boutique M&A firms and business brokers eliminate the operational drag in their NDA execution and buyer routing.
          </p>
          <div className="flex items-center gap-6 mb-20">
            <button 
              onClick={onBookCall}
              className="bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
            >
              Book a Strategy Call &rarr;
            </button>
            <button 
              onClick={onWatchVideo}
              className="text-muted-foreground text-sm hover:text-foreground transition-colors border-b border-transparent hover:border-border flex items-center gap-1.5"
            >
              Watch 2-Min System Walkthrough
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-border border border-border">
          {[
            ["94%", "Reduction in NDA turnaround"],
            ["3.2x", "Faster buyer qualification"],
            ["0", "Manual data room emails"],
            ["24/7", "Always-on intake"]
          ].map(([stat, desc], i) => (
            <div key={i} className="bg-background p-6">
              <div className="display-serif text-4xl mb-2 text-foreground">{stat}</div>
              <div className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">{desc}</div>
            </div>
          ))}
        </Reveal>
      </motion.div>
    </section>
  );
};

const ProblemSolution = () => (
  <section id="problem" className="py-20 md:py-24 border-b border-border">
    <div className="container-tight">
      <SectionLabel index="01" label="The Shift" />
      <Reveal>
        <h2 className="display-serif text-4xl md:text-5xl max-w-2xl mb-12 text-foreground">
          From operational drag to <span className="italic text-accent">compounding leverage.</span>
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-border border border-border">
        <div className="bg-background p-8 md:p-10">
          <div className="eyebrow text-danger mb-5">The Drag</div>
          <p className="text-foreground text-xl display-serif mb-8">What's costing you the deal.</p>
          <ul className="space-y-6">
            {[
              "Manual NDA chasing",
              "Fragmented data rooms",
              "Scattered CRM updates",
              "Lost momentum on hot listings"
            ].map((item, i) => (
              <Reveal key={i} delay={0.1 + (i * 0.05)}>
                <li className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="text-border-strong">—</span>
                  <span>{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="bg-surface p-8 md:p-10 border-t-2 border-t-accent">
          <div className="eyebrow text-accent mb-5">The Leverage</div>
          <p className="text-foreground text-xl display-serif mb-8">What we put in its place.</p>
          <ul className="space-y-6">
            {[
              "Zero-touch NDA execution",
              "Automated buyer qualification",
              "Instantly provisioned data rooms",
              "Real-time partner alerts"
            ].map((item, i) => (
              <Reveal key={i} delay={0.1 + (i * 0.05)}>
                <li className="flex items-center gap-4 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                  <span>{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const Infrastructure = () => (
  <section id="infrastructure" className="py-20 md:py-24 bg-surface border-b border-border">
    <div className="container-tight">
      <SectionLabel index="02" label="Core Infrastructure" />
      <Reveal>
        <h2 className="display-serif text-4xl md:text-5xl max-w-3xl mb-12 text-foreground">
          Three systems. <span className="italic text-foreground">One intake pipeline.</span>
        </h2>
      </Reveal>
      <div className="flex flex-col gap-[1px] bg-border border border-border">
        {[
          {
            num: "I",
            title: "Automated NDA Execution",
            desc: "Lead submits form → AI classifies intent → Custom NDA auto-generates → Sent for signature via DocuSign / PandaDoc.",
            steps: ["Form", "Classify", "Generate", "Sign"]
          },
          {
            num: "II",
            title: "Intelligent CRM Routing",
            desc: "Signed NDAs trigger automated profile creation in your CRM, categorizing buyers by industry and liquidity criteria.",
            steps: ["NDA Signed", "Profile", "Categorize", "Route"]
          },
          {
            num: "III",
            title: "Data Room Provisioning",
            desc: "Qualified buyers are instantly granted gated access to the correct listing data room, removing the manual email bottleneck.",
            steps: ["Qualify", "Match Listing", "Provision", "Notify"]
          }
        ].map((sys, i) => (
          <Reveal key={i} delay={i * 0.1} className="bg-background p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
              <div className="md:col-span-1 display-serif text-4xl text-accent">{sys.num}</div>
              <div className="md:col-span-4">
                <h3 className="display-serif text-2xl md:text-3xl text-foreground">{sys.title}</h3>
              </div>
              <div className="md:col-span-7">
                <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">{sys.desc}</p>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  {sys.steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="border border-border px-2.5 py-1 rounded bg-background text-foreground">{step}</span>
                      {idx < sys.steps.length - 1 && <span className="text-muted-foreground">&rarr;</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      
      {/* Security & Compliance Guardrail Disclaimer */}
      <Reveal className="mt-8 flex items-start gap-4 p-5 border border-border bg-background rounded-lg max-w-3xl">
        <div className="text-accent text-sm font-mono mt-0.5">⚠️</div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Security & Compliance Guardrail:</strong> Systems are built utilizing strictly isolated, single-tenant private execution pipelines. Transaction details, buyer parameters, and legal documents are completely firewalled and never leveraged to train public artificial intelligence models.
        </div>
      </Reveal>
    </div>
  </section>
);

const Process = () => (
  <section id="process" className="py-20 md:py-24 border-b border-border">
    <div className="container-tight">
      <SectionLabel index="03" label="Our Process" />
      <Reveal>
        <h2 className="display-serif text-4xl md:text-5xl max-w-3xl mb-16 text-foreground">
          A measured, <span className="italic text-foreground">three-step engagement.</span>
        </h2>
      </Reveal>
      
      <div className="relative">
        <div className="hidden md:block absolute top-5 left-0 right-0 h-[1px] bg-border-strong z-0"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {[
            {
              num: "01",
              title: "Exploratory Call",
              desc: "In a brief call, we will map your current deal intake bottlenecks, show you where we see potential ROI, and determine if there's a fit."
            },
            {
              num: "02",
              title: "Scoping Engagement",
              desc: "We analyze your legacy CRM and current intake tools, then deliver a custom execution plan."
            },
            {
              num: "03",
              title: "Build & Integrate",
              desc: "We deploy the automation across your existing systems, training your brokers on the new, streamlined workflow."
            }
          ].map((step, i) => (
            <Reveal key={i} delay={i * 0.15} className="flex flex-col">
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center font-mono text-[10px] text-foreground mb-6">
                {step.num}
              </div>
              <h3 className="display-serif text-2xl mb-3 text-accent">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const CaseStudy = ({ onWatchVideo }) => (
  <section id="case" className="py-20 md:py-24 bg-surface border-b border-border overflow-hidden">
    <div className="container-tight">
      <SectionLabel index="04" label="Proof of Concept" />
      <Reveal>
        <div className="relative border border-border bg-background p-8 md:p-12 overflow-hidden">
          <div className="absolute -right-32 -top-32 w-[24rem] h-[24rem] bg-accent/30 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
            <div className="md:col-span-7">
              <div className="eyebrow text-accent mb-6">Featured Case Study</div>
              <h2 className="display-serif text-4xl md:text-5xl mb-6 text-foreground leading-tight">
                The Dallas Deal Flow <span className="italic">Prototype</span>
              </h2>
              <p className="text-muted-foreground text-base mb-8 max-w-xl leading-relaxed">
                See how we successfully mapped a legacy M&A firm's intake process to a modern routing system, stripping hours of manual touchpoints from their weekly operational drag.
              </p>
              <button 
                onClick={onWatchVideo}
                className="bg-foreground text-background px-5 py-3 rounded-full text-xs font-medium hover:bg-accent transition-colors inline-flex items-center gap-2"
              >
                Watch the 2-Minute Breakdown <span>&rarr;</span>
              </button>
            </div>
            <div className="md:col-span-5 grid grid-cols-2 gap-[1px] bg-border border border-border">
              {[
                ["−87%", "Manual touchpoints"],
                ["14 days", "From engagement to live"],
                ["6", "Tools integrated"],
                ["1", "Legacy CRM retired"]
              ].map(([stat, desc], i) => (
                <div key={i} className="bg-background p-6">
                  <div className="display-serif text-3xl mb-2 text-foreground">{stat}</div>
                  <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-10 border-t border-border">
    <div className="container-tight flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-1 rounded-sm bg-accent"></div>
        <span className="text-xs text-muted-foreground">Cascade Firm — AI for M&A Operations</span>
      </div>
      <div className="font-mono text-[10px] text-muted-foreground">
        &copy; 2026
      </div>
    </div>
  </footer>
);

export default function App() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  
  // Replace this placeholder string with your specific Loom embed video URL tonight
  const targetLoomEmbedUrl = "https://www.loom.com/embed/placeholder-id-here";

  return (
    <div className="antialiased min-h-screen">
      <Nav onBookCall={() => setBookingOpen(true)} />
      <main>
        <Hero 
          onWatchVideo={() => setVideoOpen(true)} 
          onBookCall={() => setBookingOpen(true)} 
        />
        <ProblemSolution />
        <Infrastructure />
        <Process />
        <CaseStudy onWatchVideo={() => setVideoOpen(true)} />
        
        <section id="contact" className="py-32 text-center container-tight border-b border-border">
          <Reveal>
             <div className="eyebrow mb-8 text-muted-foreground">Engage</div>
             <h2 className="display-serif text-4xl md:text-6xl max-w-3xl mx-auto mb-8 text-foreground leading-tight">
               Ready to remove the drag from your <span className="italic text-accent">intake pipeline?</span>
             </h2>
             <p className="text-muted-foreground text-base mb-10 max-w-lg mx-auto">
               Engagements are scoped quarterly. We work with a limited number of boutique firms at a time.
             </p>
             <button 
               onClick={() => setBookingOpen(true)}
               className="inline-flex bg-foreground text-background px-7 py-3.5 rounded-full text-sm font-medium hover:bg-accent transition-colors items-center gap-2"
             >
               Book a Strategy Call &rarr;
             </button>
          </Reveal>
        </section>
      </main>
      <Footer />

      {/* Shared Interactive Layer Overlay Components */}
      <VideoModal 
        isOpen={videoOpen} 
        onClose={() => setVideoOpen(false)} 
        videoUrl={targetLoomEmbedUrl} 
      />
      <BookingModal 
        isOpen={bookingOpen} 
        onClose={() => setBookingOpen(false)} 
      />
    </div>
  );
}