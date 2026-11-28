"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { StudioController } from "./motion/core";
import { makerProfile } from "./motion/makerProfile";
import type { ExhibitId } from "./CollectionModels";
import type { Settings } from "./MakerConsole";
import EditionSelector from "./EditionSelector";
import { defaultMakerEdition, makerEditions, defaultGameBoyEdition, gameBoyEditions, type MakerEditionId, type GameBoyEditionId, defaultJournalEdition, journalEditions, type JournalEditionId, defaultCameraEdition, cameraEditions, type CameraEditionId } from "./editions";
import styles from "./Landing.module.css";

const Scene = dynamic(() => import("./Scene"), { ssr: false, loading: () => <div className={styles.loading}>Preparing object 001…</div> });
const settings: Settings = { wire:false, roughness:.63, transmission:.62, light:1, hidden:[] };
const view = { name:"45°", id:0 };
const exhibits = [
  { id:"001", name:"Maker Console", note:"Accounting · Automation · AI", description:"A small instrument for big ideas." },
  { id:"002", name:"Game Boy", note:"Curiosity / Assembly", description:"Taking retro technology apart and putting it back together." },
  { id:"003", name:"Leather journal", note:"Craft / Patience", description:"Making something tangible, one detail at a time." },
  { id:"004", name:"Film camera", note:"Observation / Memory", description:"Finding another perspective through vintage photography." },
];
const readingSections = ["ABOUT", "WORK", "OBJECTS", "CONTACT"] as const;

function MagneticArchiveLink({index,select}:{index:number;select:(index:number)=>void}) {
  const move = (event:PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect=event.currentTarget.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    event.currentTarget.style.setProperty("--mag-x",`${(x*12).toFixed(1)}px`);
    event.currentTarget.style.setProperty("--mag-y",`${(y*8).toFixed(1)}px`);
  };
  const reset = (event:PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.removeProperty("--mag-x");
    event.currentTarget.style.removeProperty("--mag-y");
  };
  return <a className={styles.archiveExplore} href="#top" onClick={()=>select(index)} onPointerMove={move} onPointerLeave={reset} onBlur={event=>{event.currentTarget.style.removeProperty("--mag-x");event.currentTarget.style.removeProperty("--mag-y");}}><span className={styles.archiveExploreInner}>Explore object<span className={styles.archiveExploreArrow} aria-hidden="true">↗</span></span></a>;
}
function ArchivePreviews({select}:{select:(index:number)=>void}) {
  const [controller] = useState(()=>new StudioController(makerProfile));
  const [images,setImages] = useState<Record<string,string>>({});
  const [index,setIndex] = useState(0);
  const [visible,setVisible] = useState(false);
  const archive = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const node=archive.current;
    if(!node)return;
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect();}},{rootMargin:"400px"});
    observer.observe(node);
    return ()=>observer.disconnect();
  },[]);
  const capture=useCallback((image:string)=>{
    const exhibit=exhibits[index];
    if(!exhibit)return;
    setImages(previous=>({...previous,[exhibit.id]:image}));
    setIndex(index+1);
  },[index]);
  useEffect(()=>{
    if(!visible || index>=exhibits.length)return;
    // Continue to the next exhibit if WebGL or image capture is unavailable.
    const timeout=window.setTimeout(()=>setIndex(i=>i===index?i+1:i),8000);
    return ()=>window.clearTimeout(timeout);
  },[visible,index]);
  return <div ref={archive} className={styles.archive}>
    {exhibits.map((exhibit,i)=><article key={exhibit.id}>
      <span>OBJECT {exhibit.id}</span>
      <a className={styles.archivePreview} href="#top" onClick={()=>select(i)} aria-label={"Explore "+exhibit.name}>
        {images[exhibit.id] ? <div className={styles.previewImage} role="img" aria-label={exhibit.name+" — 3D model preview"} style={{backgroundImage:"url("+images[exhibit.id]+")"}}/> : <span className={styles.previewPlaceholder}>{exhibit.name}</span>}
      </a>
      <h3>{exhibit.name}</h3><span>{exhibit.note}</span><p>{exhibit.description}</p><MagneticArchiveLink index={i} select={select}/>
    </article>)}
    {visible && index<exhibits.length && <div className={styles.captureStage} aria-hidden="true"><Scene key={index} settings={settings} view={view} controller={controller} exhibition exhibit={index===0?undefined:exhibits[index].id as ExhibitId} onCapture={capture}/></div>}
  </div>;
}
export default function Landing() {
  const [controller] = useState(() => new StudioController(makerProfile));
  const [active, setActive] = useState(0);
  const [edition, setEdition] = useState<MakerEditionId>(defaultMakerEdition);
  const [gameBoyEdition, setGameBoyEdition] = useState<GameBoyEditionId>(defaultGameBoyEdition);
  const [journalEdition, setJournalEdition] = useState<JournalEditionId>(defaultJournalEdition);
  const [cameraEdition, setCameraEdition] = useState<CameraEditionId>(defaultCameraEdition);
  const [direction, setDirection] = useState(1);
  const touch = useRef<{x:number;y:number}|null>(null);
  const select = (index:number) => { if(index<0 || index>=exhibits.length || index===active) return; setDirection(index>active?1:-1);setActive(index); };
  const object = exhibits[active];
  const chapter = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const stageLabel = useRef<HTMLSpanElement>(null);
  const readingIndicator = useRef<HTMLSpanElement>(null);
  const work = useRef<HTMLElement>(null);
  const [readingVisible,setReadingVisible] = useState(false);
  const [readingSection,setReadingSection] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections=["about","work","collection","contact"].map(id=>document.getElementById(id));
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = chapter.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - (el.firstElementChild?.clientHeight ?? window.innerHeight));
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      const explode = media.matches ? 0 : Math.max(0, Math.min(1, (progress - .08) / .72));
      controller.setProgress(explode);
      if (indicator.current) indicator.current.style.transform = "scaleX(" + progress + ")";
      if (stageLabel.current) stageLabel.current.textContent = explode < .01 ? "ON DISPLAY" : explode > .99 ? "EXPLORED" : "EXPLORING STRUCTURE";
      const aboutTop=sections[0]?.getBoundingClientRect().top;
      const contactBottom=sections[3]?.getBoundingClientRect().bottom;
      if (aboutTop!==undefined && contactBottom!==undefined) {
        const height=window.innerHeight;
        const readingProgress=Math.max(0,Math.min(1,(height*.55-aboutTop)/(contactBottom-aboutTop+height*.2)));
        if (readingIndicator.current) readingIndicator.current.style.transform=window.innerWidth<=700?`scaleX(${readingProgress})`:`scaleY(${readingProgress})`;
        setReadingVisible(aboutTop<=height*.55 && contactBottom>=height*.35);
        const current=sections.reduce((found,section,index)=>section && section.getBoundingClientRect().top<=height*.55?index:found,0);
        setReadingSection(current);
      }
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
  useEffect(()=>{
    const rows=work.current?.querySelectorAll<HTMLElement>("article");
    const titles=document.querySelectorAll<HTMLElement>("[data-motion-title]");
    if (!rows || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if (!entry.isIntersecting) return;
        const row=entry.target as HTMLElement;
        row.dataset.revealed="true";
        observer.unobserve(row);
      });
    },{rootMargin:"0px 0px -8% 0px",threshold:.05});
    rows.forEach(row=>{
      if (row.getBoundingClientRect().top<=window.innerHeight*.92) return;
      row.dataset.pending="true";
      observer.observe(row);
    });
    titles.forEach(title=>{
      if (title.getBoundingClientRect().top<=window.innerHeight*.92) return;
      title.dataset.pending="true";
      observer.observe(title);
    });
    return ()=>observer.disconnect();
  },[]);
  return (
    <main className={styles.site} id="top">
      <div className={styles.readingGuide} data-visible={readingVisible} aria-hidden="true">
        <span className={styles.readingCount}>{String(readingSection+1).padStart(2,"0")} / 04</span>
        <span className={styles.readingTrack}><span ref={readingIndicator}/></span>
        <span className={styles.readingName}>{readingSections[readingSection]}</span>
      </div>
      <header className={styles.nav}>
        <a href="#top" className={styles.wordmark}>TING<span>.</span></a>
        <span className={styles.navCaption}>INDEPENDENT MAKER / PERSONAL ARCHIVE</span>
        <nav aria-label="Main navigation"><a href="#about">About</a><a href="#work">Work</a><a href="#collection">Objects</a><a href="#contact">Contact ↗</a></nav>
      </header>
      <section ref={chapter} className={styles.chapter} aria-label="Interactive object exhibition">
        <div className={styles.sticky} onTouchStart={e=>{if ((e.target as HTMLElement).closest("canvas,button,a")) {touch.current=null;return;}const t=e.touches[0];touch.current={x:t.clientX,y:t.clientY};}} onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start)return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5)select(active+(dx<0?1:-1));}}>
          <div className={styles.heroMeta}><span>EXHIBITION / {object.id}</span><span ref={stageLabel}>ASSEMBLED</span></div>
          <h1 className={styles.heroTitle}>The maker’s<br/>studio<span>.</span></h1>
          <div className={styles.canvas}>
            <div className={styles.slide} key={active} data-direction={direction}><Scene settings={settings} edition={edition} gameBoyEdition={gameBoyEdition} journalEdition={journalEdition} cameraEdition={cameraEdition} view={view} controller={controller} exhibition exhibit={active===0?undefined:object.id as ExhibitId}/></div>
          </div>
          <div className={styles.objectLabel} aria-live="polite"><span>OBJECT — {object.id}</span><strong>{object.name}</strong><span>{object.note}</span>{active===0 && <EditionSelector choices={makerEditions} value={edition} onChange={setEdition}/>} {active===1 && <EditionSelector choices={gameBoyEditions} value={gameBoyEdition} onChange={setGameBoyEdition}/>} {active===2 && <EditionSelector choices={journalEditions} value={journalEdition} onChange={setJournalEdition}/>} {active===3 && <EditionSelector choices={cameraEditions} value={cameraEdition} onChange={setCameraEdition}/>}</div>
          <div className={styles.galleryControls} aria-label="Choose exhibit"><button aria-label="Previous object" disabled={active===0} onClick={()=>select(active-1)}>←</button>{exhibits.map((item,i)=><button key={item.id} aria-label={item.name} aria-pressed={active===i} onClick={()=>select(i)}>{item.id}</button>)}<button aria-label="Next object" disabled={active===exhibits.length-1} onClick={()=>select(active+1)}>→</button></div>
          <div className={styles.hints}><span>{reduced ? "STATIC EXHIBITION" : "DRAG TO ROTATE"}</span><a href="#about">SCROLL TO EXPLORE ↓</a></div>
          <div className={styles.progress} aria-hidden="true"><span ref={indicator}/></div>
        </div>
      </section>
      <section id="about" className={styles.about}>
        <div className={styles.sectionIndex}>01 / THE PERSON BEHIND THE OBJECT</div>
        <h2 className={styles.sectionTitle} data-motion-title>Hello,<br/>I’m Ting<span>.</span></h2>
        <div className={styles.aboutBody}><p className={styles.lead}>Accountant.<br/>Maker.<br/>Curious mind.</p><div><p>I enjoy understanding how things work — whether it’s a retro handheld console, a leather notebook, or a financial workflow.</p><p>I enjoy exploring how automation and AI can make everyday work simpler.</p></div></div>
        <div className={styles.tags}>{["Accounting","RPA","AI exploration","Workflow optimisation","Retro technology","Leather craft","Photography","Maker mindset"].map(tag=><span key={tag}>{tag}</span>)}</div>
      </section>
      <section id="work" ref={work} className={styles.editorial}>
        <div className={styles.sectionIndex}>02 / PRACTICE</div>
        <h2 className={styles.sectionTitle} data-motion-title>Making work<br/>work better<span>.</span></h2>
        <p className={styles.intro}>The Accounting Maker — exploring the space between financial expertise and technology.</p>
        {[
          ["01","Accounting & finance","Understanding financial processes, structure and the details that matter."],
          ["02","Workflow automation","Exploring RPA and integrations to reduce repetitive manual tasks."],
          ["03","AI solutions","Open to collaborating on AI-assisted workflows and internal tools."],
        ].map(([id,title,description])=><article className={styles.workRow} key={id}><span>{id}</span><h3>{title}</h3><p>{description}</p></article>)}
      </section>
      <section id="collection" className={styles.editorial}>
        <div className={styles.sectionIndex}>03 / PERSONAL ARCHIVE</div>
        <h2 className={styles.sectionTitle} data-motion-title>Objects of<br/>curiosity<span>.</span></h2>
        <p className={styles.intro}>A growing collection of things I love to make, take apart and observe.</p>
        <ArchivePreviews select={select}/>
      </section>
      <section id="contact" className={styles.contact}>
        <div className={styles.sectionIndex}>04 / COLLABORATION</div>
        <h2 className={styles.sectionTitle} data-motion-title>Let’s make<br/>something<span>.</span></h2>
        <p>Accounting × Automation × AI</p><p className={styles.contactNote}>Open to discussing new projects. Contact details will be added before launch.</p>
        <a href="#top">Back to the exhibition ↑</a>
      </section>
      <footer className={styles.footer}><span>TING. / THE MAKER’S STUDIO</span><span>PERSONAL ARCHIVE — VOL. 01</span></footer>
    </main>
  );
}
