import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Github, Linkedin, Mail, Terminal, Code2, Server, Database, Menu, X, Globe, Layers, BookOpen, Clock, ArrowRight, FileText, Download, Briefcase, GraduationCap, Award, Check, Loader2, AlertCircle, SendHorizonal } from "lucide-react";
import { 
  SiPython, SiFastapi, SiPostgresql, SiDocker, 
  SiRedis, SiSqlalchemy, SiPydantic, SiLinux,
  SiReact, SiVite, SiBootstrap, SiTypescript
} from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const PROJECTS = [
  {
  title: "AI Solutions",
  description: "Production-grade authentication and identity platform designed as a reusable SaaS solution for any industry. Provides secure JWT-based authentication with access/refresh token rotation, role-based access control (RBAC), and Redis-backed token blacklisting for real-time session invalidation. Built to be integrated into production systems as a standalone identity service for web and mobile applications, supporting scalable multi-client usage.",
  stack: ["Django", "PostgreSQL", "Redis", "React"],
  url: "https://ai-solutions-ten.vercel.app"
},
{
  title: "NGAU Bazaar",
  description: "Scalable backend system for a multi-vendor marketplace with real-time communication capabilities. Implements WebSocket-based multi-room chat and Redis Pub/Sub for cross-instance synchronization, enabling horizontal scaling without sticky sessions. Includes persistent messaging with PostgreSQL.",
  stack: ["FastAPI", "PostgreSQL", "Redis", "WebSocket", "Supabase", "React", "Render"],
  url: "https://ngau-bazaar.vercel.app"
},
{
  title: "E-Commerce REST API",
  description: "Full-featured e-commerce backend system supporting product catalog, inventory management, order lifecycle, and Stripe payment integration. Includes asynchronous background tasks for order confirmation emails and inventory reconciliation to improve performance and responsiveness.",
  stack: ["FastAPI", "PostgreSQL", "Stripe"],
  url: "https://fastapi.tiangolo.com/tutorial/"
},
{
  title: "ML Model Serving API",
  description: "Low-latency machine learning inference API built around Scikit-learn models. Features Redis-backed caching to eliminate redundant computations, versioned inference endpoints for model lifecycle management, and structured logging for monitoring model performance and drift signals.",
  stack: ["FastAPI", "Redis", "NumPy", "Scikit-learn"],
  url: "https://fastapi.tiangolo.com/tutorial/"
},
{
  title: "URL Shortener Service",
  description: "High-throughput URL shortening service optimized for sub-millisecond redirect resolution using Redis in-memory storage. Includes asynchronous analytics pipeline for click tracking and reporting, designed for scalable, event-driven traffic handling.",
  stack: ["FastAPI", "Redis", "SQLite"],
  url: "https://fastapi.tiangolo.com/tutorial/"
}
];

const BACKEND_SKILLS = [
  { name: "Python", icon: SiPython, level: "Expert" },
  { name: "FastAPI", icon: SiFastapi, level: "Expert" },
  { name: "PostgreSQL", icon: SiPostgresql, level: "Advanced" },
  { name: "Docker", icon: SiDocker, level: "Advanced" },
  { name: "Redis", icon: SiRedis, level: "Advanced" },
  { name: "SQLAlchemy", icon: SiSqlalchemy, level: "Advanced" },
  { name: "Pydantic", icon: SiPydantic, level: "Expert" },
  { name: "Linux", icon: SiLinux, level: "Advanced" },
];

const FRONTEND_SKILLS = [
  { name: "React", icon: SiReact, level: "Proficient" },
  { name: "React Native", icon: SiReact, level: "Proficient" },
  { name: "TypeScript", icon: SiTypescript, level: "Proficient" },
  { name: "Vite", icon: SiVite, level: "Proficient" },
  { name: "Bootstrap", icon: SiBootstrap, level: "Proficient" },
];

function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(w => (w + 1) % words.length);
    }
    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const heroRole = useTypewriter(["Backend Engineer.", "FastAPI Developer.", "API Architect.", "Open Source Contributor."], 75, 2200);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Injan%20Thada%20-%20Resume';
    link.download = 'Injan_Thada_Resume.pdf';
    link.click();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setFormStatus("sending");
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setFormStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-primary font-bold text-xl cursor-pointer" onClick={() => scrollTo('hero')}>
            <Terminal className="w-6 h-6" />
            <span>injan.dev</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium font-mono text-muted-foreground">
            <button onClick={() => scrollTo('about')} className="hover:text-primary transition-colors" data-testid="nav-about">/about</button>
            <button onClick={() => scrollTo('projects')} className="hover:text-primary transition-colors" data-testid="nav-projects">/projects</button>
            <button onClick={() => scrollTo('skills')} className="hover:text-primary transition-colors" data-testid="nav-skills">/skills</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-primary transition-colors" data-testid="nav-contact">/contact</button>
            <Button size="sm" variant="outline" className="gap-2 border-primary/40 text-primary hover:bg-primary/10 font-mono" onClick={() => setResumeOpen(true)} data-testid="nav-resume">
              <FileText className="w-3.5 h-3.5" /> Resume
            </Button>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="nav-mobile-toggle">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-white/5 absolute top-16 w-full flex flex-col font-mono text-sm py-4 px-6 gap-4 shadow-xl">
            <button onClick={() => scrollTo('about')} className="text-left text-muted-foreground hover:text-primary">/about</button>
            <button onClick={() => scrollTo('projects')} className="text-left text-muted-foreground hover:text-primary">/projects</button>
            <button onClick={() => scrollTo('skills')} className="text-left text-muted-foreground hover:text-primary">/skills</button>
            <button onClick={() => scrollTo('contact')} className="text-left text-muted-foreground hover:text-primary">/contact</button>
            <button onClick={() => { setMobileMenuOpen(false); setResumeOpen(true); }} className="text-left text-primary hover:text-primary/80" data-testid="mobile-nav-resume">/resume</button>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center pt-16 relative overflow-hidden">
          {/* Animated dot-grid background */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="currentColor" className="text-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="max-w-3xl"
            >
              <motion.div variants={fadeUp} className="font-mono text-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-primary"></span>
                hello_world
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                Injan Thada.
                <br />
                <span className="text-muted-foreground min-h-[1.2em] inline-block">
                  {heroRole}<span className="animate-pulse text-primary">|</span>
                </span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Backend engineer with a focus on building reliable, high-throughput APIs and distributed systems using <strong className="text-foreground font-medium">FastAPI</strong> and <strong className="text-foreground font-medium">Python</strong>. I care deeply about correctness, performance, and maintainability — from database schema to deployment.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 font-mono">
                <Button onClick={() => scrollTo('projects')} className="gap-2 h-12 px-6" data-testid="btn-view-projects">
                  <Code2 className="w-4 h-4" />
                  View Projects
                </Button>
                <Button variant="outline" onClick={() => setResumeOpen(true)} className="gap-2 h-12 px-6 border-primary/40 text-primary hover:bg-primary/10" data-testid="btn-resume">
                  <FileText className="w-4 h-4" />
                  View Resume
                </Button>
                <Button variant="outline" onClick={() => scrollTo('contact')} className="gap-2 h-12 px-6 border-white/10 hover:bg-white/5" data-testid="btn-contact">
                  <Mail className="w-4 h-4" />
                  Contact Me
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-secondary/30 border-y border-white/5">
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl"
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 font-mono">
                <span className="text-primary">01.</span> About
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    I'm a backend software engineer with professional experience designing and shipping production APIs using <strong className="text-foreground font-medium">FastAPI</strong> and <strong className="text-foreground font-medium">Python</strong>. My work spans authentication services, real-time data pipelines, and ML inference APIs — systems where correctness and latency both matter.
                  </p>
                  <p>
                    I approach every project with the same discipline: typed interfaces via Pydantic, async-first I/O, clean layered architecture, and observable deployments. I write code that other engineers can read, extend, and trust in production.
                  </p>
                  <p>
                    Outside of work, I contribute to open-source tooling, write technical articles on FastAPI patterns, and continuously study distributed systems design.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-background rounded-lg border border-white/5 flex flex-col gap-3">
                    <Server className="w-8 h-8 text-primary" />
                    <h3 className="font-bold text-foreground">API Design</h3>
                    <p className="text-sm text-muted-foreground">RESTful & WebSocket architectures</p>
                  </div>
                  <div className="p-6 bg-background rounded-lg border border-white/5 flex flex-col gap-3">
                    <Database className="w-8 h-8 text-primary" />
                    <h3 className="font-bold text-foreground">Data Layer</h3>
                    <p className="text-sm text-muted-foreground">SQLAlchemy, Postgres, Redis</p>
                  </div>
                  <div className="p-6 bg-background rounded-lg border border-white/5 flex flex-col gap-3">
                    <Layers className="w-8 h-8 text-primary" />
                    <h3 className="font-bold text-foreground">Infrastructure</h3>
                    <p className="text-sm text-muted-foreground">Docker, CI/CD, Linux</p>
                  </div>
                  <div className="p-6 bg-background rounded-lg border border-white/5 flex flex-col gap-3">
                    <Code2 className="w-8 h-8 text-primary" />
                    <h3 className="font-bold text-foreground">Code Quality</h3>
                    <p className="text-sm text-muted-foreground">Typing, Testing, Pydantic</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 font-mono">
                <span className="text-primary">02.</span> Selected Works
              </h2>
              
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {PROJECTS.map((project, i) => (
                  <motion.div key={i} variants={fadeUp}>
                  <Card className="bg-secondary/20 border-white/5 flex flex-col hover:border-primary/50 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.3)] transition-all group h-full">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</CardTitle>
                      <CardDescription className="text-muted-foreground mt-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-2 font-mono text-xs">
                        {project.stack.map((tech, j) => (
                          <span key={j} className="px-2 py-1 rounded bg-background text-primary border border-primary/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-3 pt-4 border-t border-white/5">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary" size="sm" className="gap-2 w-full bg-background hover:bg-white/5 text-foreground" data-testid={`btn-demo-${i}`}>
                            <Globe className="w-4 h-4" /> Live Demo
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] flex flex-col bg-background border-white/10">
                          <DialogHeader>
                            <DialogTitle className="font-mono text-primary flex items-center gap-2">
                              <Terminal className="w-4 h-4" /> {project.title} — Live Preview
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex-grow rounded-md overflow-hidden border border-white/10 bg-black relative">
                            <iframe 
                              src={project.url} 
                              className="absolute inset-0 w-full h-full"
                              title={`${project.title} demo`}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline" size="sm" className="gap-2 w-full border-white/10 hover:bg-white/5" onClick={() => window.open('https://github.com', '_blank')} data-testid={`btn-github-${i}`}>
                        <Github className="w-4 h-4" /> GitHub
                      </Button>
                    </CardFooter>
                  </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 bg-secondary/30 border-y border-white/5">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 font-mono text-center justify-center">
                <span className="text-primary">03.</span> Tech Stack
              </h2>

              <div className="max-w-5xl mx-auto space-y-12">
                <div>
                  <p className="font-mono text-xs text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Server className="w-3.5 h-3.5" /> Backend &amp; Infrastructure
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {BACKEND_SKILLS.map((skill, i) => (
                      <div key={i} className="flex flex-col items-center gap-4 p-6 rounded-xl bg-background border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1">
                        <skill.icon className="w-12 h-12 text-muted-foreground hover:text-primary transition-colors" />
                        <div className="text-center">
                          <div className="font-bold text-foreground">{skill.name}</div>
                          <div className="text-xs font-mono text-primary/70">{skill.level}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" /> Frontend
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {FRONTEND_SKILLS.map((skill, i) => (
                      <div key={i} className="flex flex-col items-center gap-4 p-6 rounded-xl bg-background border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1">
                        <skill.icon className="w-12 h-12 text-muted-foreground hover:text-primary transition-colors" />
                        <div className="text-center">
                          <div className="font-bold text-foreground">{skill.name}</div>
                          <div className="text-xs font-mono text-primary/70">{skill.level}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* Contact Section */}
        <section id="contact" className="py-32 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 font-mono justify-center">
                <span className="text-primary">04.</span> Init Connection
              </h2>
              <p className="text-muted-foreground mb-12 text-lg">
                Currently open for new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
              </p>

              <Card className="bg-background/50 border-white/10 backdrop-blur text-left">
                <CardContent className="pt-6">
                  {formStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4 py-12 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">Message Sent</h3>
                      <p className="text-muted-foreground font-mono text-sm">Thanks for reaching out — I'll get back to you shortly.</p>
                    </motion.div>
                  ) : (
                    <form className="space-y-6" onSubmit={handleSendEmail}>
                      {formStatus === "error" && (
                        <div className="flex items-center gap-3 p-4 rounded-md bg-destructive/10 border border-destructive/30 text-sm font-mono text-destructive">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          Failed to send. Please try again or email directly.
                        </div>
                      )}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-mono text-muted-foreground">Name</label>
                          <Input
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                            placeholder="John Doe"
                            required
                            className="bg-secondary/50 border-white/10 font-mono"
                            data-testid="input-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-mono text-muted-foreground">Email</label>
                          <Input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleFormChange}
                            placeholder="john@example.com"
                            required
                            className="bg-secondary/50 border-white/10 font-mono"
                            data-testid="input-email"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-mono text-muted-foreground">Message</label>
                        <Textarea
                          name="message"
                          value={form.message}
                          onChange={handleFormChange}
                          placeholder="Hello..."
                          required
                          className="min-h-[150px] bg-secondary/50 border-white/10 font-mono"
                          data-testid="input-message"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={formStatus === "sending"}
                        className="w-full font-mono gap-2 h-12"
                        data-testid="btn-submit-contact"
                      >
                        {formStatus === "sending" ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                          <><SendHorizonal className="w-4 h-4" /> Send_Message()</>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-center gap-6 mt-12">
                <a href="#" className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-white/5" data-testid="link-github">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-white/5" data-testid="link-linkedin">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="mailto:hello@example.com" className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-white/5" data-testid="link-email">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* Resume Modal */}
      <Dialog open={resumeOpen} onOpenChange={setResumeOpen}>
        <DialogContent className="max-w-3xl w-[92vw] max-h-[90vh] overflow-y-auto bg-background border-white/10 text-foreground">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="font-mono text-primary flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5" /> Injan Thada — Resume
              </DialogTitle>
              <Button size="sm" className="gap-2 font-mono" onClick={handleDownloadResume} data-testid="btn-download-resume">
                <Download className="w-4 h-4" /> Download PDF
              </Button>
            </div>
          </DialogHeader>

          <Separator className="bg-white/10 my-2" />

          {/* Resume Body */}
          <div className="space-y-8 py-2 font-sans">

            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Injan Thada</h1>
              <p className="text-primary font-mono mt-1">Backend Engineer · FastAPI Specialist</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground font-mono">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> ennzaen@gmail.com</span>
                <span className="flex items-center gap-1"><Github className="w-3.5 h-3.5" /> https://github.com/MIMIIKK</span>
                <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5" /> linkedin.com/in/ennzaen</span>
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> injanthada.com.np</span>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Summary */}
            <div>
              <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" /> Professional Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Backend software engineer with 4+ years of experience designing and delivering production-grade REST APIs and microservices using <strong className="text-foreground">FastAPI</strong> and <strong className="text-foreground">Python</strong>. Specializes in async Python systems, relational and in-memory data layers (PostgreSQL, Redis), and containerized deployments. Consistent track record of reducing API latency, improving system reliability, and building architectures that scale with product demand.
              </p>
            </div>

            <Separator className="bg-white/10" />

            {/* Experience */}
            <div>
              <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-5 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Work Experience
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-foreground">Senior Backend Engineer</h3>
                      <p className="text-primary font-mono text-sm">TechCore Solutions</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs border-white/20 text-muted-foreground shrink-0">Jan 2024 – Present</Badge>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-none">
                    <li className="flex gap-2"><span className="text-primary mt-1">▸</span> Architected and led delivery of a multi-tenant authentication platform serving 200k+ users, built on FastAPI with JWT rotation and Redis token blacklisting.</li>
                    <li className="flex gap-2"><span className="text-primary mt-1">▸</span> Reduced average API response time by 38% through async SQLAlchemy 2.0 migration and strategic query optimization using PostgreSQL EXPLAIN ANALYZE.</li>
                    <li className="flex gap-2"><span className="text-primary mt-1">▸</span> Established team-wide code review standards for Python typing, Pydantic schema design, and FastAPI dependency injection patterns.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-foreground">Backend Engineer</h3>
                      <p className="text-primary font-mono text-sm">DataStream Labs</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs border-white/20 text-muted-foreground shrink-0">Mar 2022 – Dec 2023</Badge>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-none">
                    <li className="flex gap-2"><span className="text-primary mt-1">▸</span> Built a real-time WebSocket API supporting 10,000+ concurrent connections, using Redis Pub/Sub for cross-instance message routing.</li>
                    <li className="flex gap-2"><span className="text-primary mt-1">▸</span> Developed an ML model serving layer wrapping Scikit-learn classifiers behind a versioned FastAPI interface with Redis prediction caching.</li>
                    <li className="flex gap-2"><span className="text-primary mt-1">▸</span> Maintained full Docker-based CI/CD pipelines on GitHub Actions, reducing deployment cycle time by 50%.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-foreground">Junior Python Developer</h3>
                      <p className="text-primary font-mono text-sm">Nexus Software</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs border-white/20 text-muted-foreground shrink-0">Jun 2021 – Feb 2022</Badge>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-none">
                    <li className="flex gap-2"><span className="text-primary mt-1">▸</span> Contributed to an e-commerce REST API handling product catalog, inventory, and Stripe payment processing.</li>
                    <li className="flex gap-2"><span className="text-primary mt-1">▸</span> Wrote integration tests using pytest and maintained API documentation via OpenAPI schemas.</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Education */}
            <div>
              <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" /> Education
              </h2>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-foreground">B.Sc. Computer Science</h3>
                  <p className="text-muted-foreground text-sm">Faculty of Science and Technology</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-white/20 text-muted-foreground shrink-0">2017 – 2021</Badge>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Skills */}
            <div>
              <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" /> Technical Skills
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Languages", value: "Python, TypeScript, SQL, Bash" },
                  { label: "Backend", value: "FastAPI, SQLAlchemy, Pydantic" },
                  { label: "Frontend", value: "React, React Native, Vite, Bootstrap" },
                  { label: "Databases", value: "PostgreSQL, Redis, SQLite" },
                  { label: "Infrastructure", value: "Docker, Linux, GitHub Actions" },
                  { label: "Protocols", value: "REST, WebSocket, OpenAPI" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="font-mono text-primary text-xs w-28 shrink-0 pt-0.5">{item.label}</span>
                    <span className="text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      <footer className="py-8 border-t border-white/5 text-center font-mono text-sm text-muted-foreground bg-background">
          <p className="mt-2 flex items-center justify-center gap-2 opacity-50">
          <Terminal className="w-3 h-3" />
          Injan Thada &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}