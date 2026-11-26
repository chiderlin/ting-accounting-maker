"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { StudioController } from "./motion/core";
import { makerProfile } from "./motion/makerProfile";
import AnimationStudio from "./motion/AnimationStudio";
import { PARTS, type Settings } from "./MakerConsole";
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <div className="loading">Preparing the studio…</div>,
});
export default function Playground() {
  const [controller] = useState(() => new StudioController(makerProfile));
  const [s, set] = useState<Settings>({
    wire: false,
    roughness: 0.63,
    transmission: 0.62,
    light: 1,
    hidden: [],
  });
  const [view, setView] = useState({ name: "45°", id: 0 });
  return (
    <main>
      <header>
        <a href="/playground" className="brand">
          m<span>↗</span> / object lab
        </a>
        <span className="edition">INDEPENDENT DESIGN STUDIES — VOL. 001</span>
        <span className="status">● LIVE STUDIO</span>
      </header>
      <section className="workspace">
        <div className="stage">
          <div className="title">
            <p className="eyebrow">OBJECT STUDY / 001</p>
            <h1>
              Maker Console<span>01.</span>
            </h1>
            <p>A small instrument for big ideas.</p>
          </div>
          <Scene settings={s} view={view} controller={controller} />
          <div className="caption">
            <span>
              PROCEDURAL SERIES
              <br />
              <b>Soft industrial / Retro technology</b>
            </span>
            <span>DRAG TO ORBIT · SCROLL TO ZOOM</span>
          </div>
        </div>
        <aside>
          <div className="panel-heading">
            <span>Studio controls</span>
            <span>↗</span>
          </div>
          <p className="subtle">Explore the object, one detail at a time.</p>
          <section>
            <h2>01 / Perspective</h2>
            <div className="views">
              {["45°", "Front", "Side", "Back", "Top", "Bottom"].map((name) => (
                <button
                  className={view.name === name ? "active" : ""}
                  key={name}
                  onClick={() => setView({ name, id: view.id + 1 })}
                >
                  {name}
                </button>
              ))}
            </div>
            <button
              className="reset"
              onClick={() => setView({ name: "45°", id: view.id + 1 })}
            >
              ↺ Reset camera
            </button>
          </section>
          <section>
            <h2>02 / Surface & light</h2>
            {[
              ["roughness", "Plastic roughness", 0.15, 0.95],
              ["transmission", "Panel translucency", 0, 1],
              ["light", "Studio intensity", 0.3, 2],
            ].map(([key, label, min, max]) => (
              <label className="slider" key={key}>
                <span>
                  {label}
                  <output>
                    {s[key as "roughness" | "transmission" | "light"].toFixed(
                      2,
                    )}
                  </output>
                </span>
                <input
                  aria-label={String(label)}
                  type="range"
                  min={min}
                  max={max}
                  step="0.01"
                  value={s[key as "roughness" | "transmission" | "light"]}
                  onChange={(e) => set({ ...s, [key]: Number(e.target.value) })}
                />
              </label>
            ))}
            <label className="check">
              <input
                type="checkbox"
                checked={s.wire}
                onChange={(e) => set({ ...s, wire: e.target.checked })}
              />{" "}
              Wireframe inspection
            </label>
          </section>
          <section>
            <h2>03 / Assembly</h2>
            <p className="subtle">Toggle layers to inspect the construction.</p>
            {PARTS.map((p, i) => (
              <label className="part" key={p}>
                <span>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                  {p}
                </span>
                <input
                  aria-label={p}
                  type="checkbox"
                  checked={!s.hidden.includes(p)}
                  onChange={(e) =>
                    set({
                      ...s,
                      hidden: e.target.checked
                        ? s.hidden.filter((x) => x !== p)
                        : [...s.hidden, p],
                    })
                  }
                />
              </label>
            ))}
          </section>
          <AnimationStudio controller={controller} />
          <div className="note">
            BUILT TO BE TAKEN APART.
            <br />
            <span>Nine assemblies. One considered object.</span>
          </div>
        </aside>
      </section>
      <footer>
        <span>MAKER CONSOLE 01</span>
        <span>GEOMETRY PROTOTYPE · NOV 2026</span>
        <span>CRAFT × COMPUTATION</span>
      </footer>
    </main>
  );
}
