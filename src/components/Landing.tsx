"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { StudioController } from "./motion/core";
import { makerProfile } from "./motion/makerProfile";
import type { Settings } from "./MakerConsole";
import styles from "./Landing.module.css";

const Scene = dynamic(() => import("./Scene"), { ssr: false, loading: () => <div className={styles.loading}>Preparing object 001…</div> });
const settings: Settings = { wire:false, roughness:.63, transmission:.62, light:1, hidden:[] };
const view = { name:"45°", id:0 };
const exhibits = [
  { id:"002", name:"Game Boy", note:"Curiosity / Assembly", description:"Taking retro technology apart and putting it back together." },
  { id:"003", name:"Leather journal", note:"Craft / Patience", description:"Making something tangible, one detail at a time." },
  { id:"004", name:"Film camera", note:"Observation / Memory", description:"Finding another perspective through vintage photography." },
];
export default function Landing() {
  const [controller] = useState(() => new StudioController(makerProfile));
  const chapter = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const stageLabel = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = chapter.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const explode = media.matches ? 0 : Math.max(0, Math.min(1, (progress - .08) / .72));
      controller.setProgress(explode);
      if (indicator.current) indicator.current.style.transform = "scaleX(" + progress + ")";
      if (stageLabel.current) stageLabel.current.textContent = explode < .01 ? "ASSEMBLED" : explode > .99 ? "EXPLODED VIEW" : "EXPLORING STRUCTURE";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const preference = () => { setReduced(media.matches); schedule(); };
    controller.select("explode");
    preference();
    window.addEventListener("scroll", schedule, { passive:true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", preference);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); media.removeEventListener("change", preference); };
  }, [controller]);
  return (
    <main className={styles.site} id="top">
      <header className={styles.nav}>
        <a href="#top" className={styles.wordmark}>TING<span>.</span></a>
        <span className={styles.navCaption}>INDEPENDENT MAKER / PERSONAL ARCHIVE</span>
        <nav aria-label="Main navigation"><a href="#about">About</a><a href="#work">Work</a><a href="#collection">Objects</a><a href="#contact">Contact ↗</a></nav>
      </header>
      <section ref={chapter} className={styles.chapter} aria-label="Object 001 interactive exhibition">
        <div className={styles.sticky}>
          <div className={styles.heroMeta}><span>EXHIBITION / 01</span><span ref={stageLabel}>ASSEMBLED</span></div>
          <h1 className={styles.heroTitle}>The maker’s<br/>studio<span>.</span></h1>
          <div className={styles.canvas}>
            <Scene settings={settings} view={view} controller={controller} exhibition />
          </div>
          <div className={styles.objectLabel}><span>OBJECT — 001</span><strong>Maker Console</strong><span>Accounting × Automation × AI</span></div>
          <div className={styles.hints}><span>{reduced ? "STATIC EXHIBITION" : "DRAG TO ROTATE"}</span><a href="#about">SCROLL TO EXPLORE ↓</a></div>
          <div className={styles.progress} aria-hidden="true"><span ref={indicator}/></div>
        </div>
      </section>
      <section id="about" className={styles.about}>
        <div className={styles.sectionIndex}>01 / THE PERSON BEHIND THE OBJECT</div>
        <h2>Hello,<br/>I’m Ting<span>.</span></h2>
        <div className={styles.aboutBody}><p className={styles.lead}>Accountant.<br/>Maker.<br/>Curious mind.</p><div><p>I enjoy understanding how things work — whether it’s a retro handheld console, a leather notebook, or a financial workflow.</p><p>With five years of working experience in Japan and a background in accounting, I explore how automation and AI can make everyday work simpler. I’m currently preparing for the CPA qualification.</p><p lang="zh-Hant">喜歡親手創造，也喜歡讓繁瑣的工作變得簡單。</p></div></div>
        <div className={styles.tags}>{["Accounting","RPA","AI exploration","Workflow optimisation","Japan experience","CPA in progress","Retro technology","Leather craft","Photography","Maker mindset"].map(tag=><span key={tag}>{tag}</span>)}</div>
      </section>
      <section id="work" className={styles.editorial}>
        <div className={styles.sectionIndex}>02 / PRACTICE</div>
        <h2>Making work<br/>work better<span>.</span></h2>
        <p className={styles.intro}>The Accounting Maker — exploring the space between financial expertise and technology.</p>
        {[
          ["01","Accounting & finance","Understanding financial processes, structure and the details that matter."],
          ["02","Workflow automation","Exploring RPA and integrations to reduce repetitive manual tasks."],
          ["03","AI solutions","Open to collaborating on AI-assisted workflows and internal tools."],
        ].map(([id,title,description])=><article className={styles.workRow} key={id}><span>{id}</span><h3>{title}</h3><p>{description}</p></article>)}
      </section>
      <section id="collection" className={styles.editorial}>
        <div className={styles.sectionIndex}>03 / PERSONAL ARCHIVE</div>
        <h2>Objects of<br/>curiosity<span>.</span></h2>
        <p className={styles.intro}>A growing collection of things I love to make, take apart and observe.</p>
        <article className={styles.currentObject}><span>OBJECT 001 / ON DISPLAY</span><h3>Maker Console</h3><a href="#top">Explore the object ↗</a></article>
        <div className={styles.archive}>{exhibits.map(exhibit=><article key={exhibit.id}><span>OBJECT {exhibit.id} / PLANNED</span><strong>{exhibit.id}</strong><h3>{exhibit.name}</h3><span>{exhibit.note}</span><p>{exhibit.description}</p></article>)}</div>
      </section>
      <section id="contact" className={styles.contact}>
        <div className={styles.sectionIndex}>04 / COLLABORATION</div>
        <h2>Let’s make<br/>something<span>.</span></h2>
        <p>Accounting × Automation × AI</p><p className={styles.contactNote}>Open to discussing new projects. Contact details will be added before launch.</p>
        <a href="#top">Back to the exhibition ↑</a>
      </section>
      <footer className={styles.footer}><span>TING. / THE MAKER’S STUDIO</span><span>PERSONAL ARCHIVE — VOL. 01</span></footer>
    </main>
  );
}
