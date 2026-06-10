const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

// ============ LANG CONTEXT ============
const LangCtx = createContext({ lang: "de", t: window.I18N.de, setLang: () => {} });
const useT = () => useContext(LangCtx);

// ============ STATIC DATA ============
const CONTACT = {
  email: "info@starantor.com",
  phone: "078 712 46 24",
  phoneHref: "tel:+41787124624",
  instagram: "https://www.instagram.com/starantor.production",
  tiktok: "https://www.tiktok.com/@starantor.production",
};

const CLIENT_LOGOS = [
  { src: "assets/clients/ghostgrip.png", name: "Ghost Grip", h: 28 },
  { src: "assets/clients/peaq.webp", name: "PEAQ", h: 34 },
  { src: "assets/clients/alpiger.jpg", name: "Alpiger Holzbau", h: 42 },
  { src: "assets/clients/realdrive.png", name: "Real Drive", h: 48 },
  { src: "assets/clients/fta.png", name: "Freestyle Trampoline", h: 54 },
];

// PLACEHOLDER VIDEOS — replace `video` with your own hosted .mp4 files (assets/work/*.mp4).
const WORK_MEDIA = [
  { video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", tone: "#16213E" },
  { video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", tone: "#1B1B22" },
  { video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", tone: "#101826" },
  { video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", tone: "#171320" },
  { video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", tone: "#0F1B1A" },
];
// PLACEHOLDER VIDEO — hero background loop, replace with your own showreel .mp4.
const HERO_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const REDUCED = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============ VIEWFINDER CORNERS (signature) ============
function Corners() {
  return (
    <>
      <span className="vf-c vf-tl" aria-hidden="true"/>
      <span className="vf-c vf-tr" aria-hidden="true"/>
      <span className="vf-c vf-bl" aria-hidden="true"/>
      <span className="vf-c vf-br" aria-hidden="true"/>
    </>
  );
}

// ============ REVEAL (scroll animation) ============
function Reveal({ children, delay = 0, y = 22, style, as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (REDUCED() || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : `translateY(${y}px)`,
      transition: `opacity 700ms cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      ...style,
    }} {...rest}>{children}</Tag>
  );
}

// ============ SECTION HEAD ============
function SectionHead({ eyebrow, a, b, sub }) {
  return (
    <div className="section-head">
      <Reveal>
        <div className="eyebrow"><span className="rec-dot"/>{eyebrow}</div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="display-lg">{a} <span className="accent">{b}</span></h2>
      </Reveal>
      {sub && <Reveal delay={160}><p>{sub}</p></Reveal>}
    </div>
  );
}

// ============ TIMECODE (scroll-linked, signature detail) ============
function Timecode() {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const frames = Math.round((window.scrollY / max) * 60 * 24); // 60s timeline @ 24fps
      const f = frames % 24, s = Math.floor(frames / 24) % 60, m = Math.floor(frames / (24 * 60));
      const p = (n) => String(n).padStart(2, "0");
      setTc(`00:${p(m)}:${p(s)}:${p(f)}`);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div aria-hidden="true" className="timecode" style={{
      position: "fixed", left: 24, bottom: 20, zIndex: 60,
      display: "flex", alignItems: "center", gap: 10,
      fontVariantNumeric: "tabular-nums", fontSize: 11.5, letterSpacing: "0.16em",
      color: "var(--text-faint)", pointerEvents: "none",
    }}>
      <span className="rec-dot" style={{ width: 6, height: 6 }}/>
      <span>REC {tc}</span>
      <style>{`@media (max-width: 900px) { .timecode { display: none !important; } }`}</style>
    </div>
  );
}

// ============ LANG SWITCH ============
function LangSwitch() {
  const { lang, setLang } = useT();
  return (
    <div style={{ display: "inline-flex", border: "1px solid var(--line-strong)", borderRadius: 999, padding: 2 }}>
      {["de", "en"].map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} style={{
          background: lang === l ? "var(--text)" : "transparent",
          color: lang === l ? "#0B0C0F" : "var(--text-muted)",
          border: "none", padding: "6px 13px", borderRadius: 999,
          fontSize: 11.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          transition: "all 160ms ease",
        }}>{l}</button>
      ))}
    </div>
  );
}

// ============ NAV ============
function Nav({ onNav, scrolled }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const items = [
    { id: "work", label: t.nav.work },
    { id: "services", label: t.nav.services },
    { id: "social", label: t.nav.social },
    { id: "process", label: t.nav.process },
    { id: "about", label: t.nav.about },
  ];

  useEffect(() => { document.body.classList.toggle("menu-open", open); return () => document.body.classList.remove("menu-open"); }, [open]);
  const go = (id) => { setOpen(false); onNav(id); };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "var(--nav-h)",
        display: "flex", alignItems: "center",
        background: scrolled || open ? "rgba(11,12,15,0.78)" : "transparent",
        backdropFilter: scrolled || open ? "saturate(1.4) blur(16px)" : "none",
        WebkitBackdropFilter: scrolled || open ? "saturate(1.4) blur(16px)" : "none",
        borderBottom: `1px solid ${scrolled || open ? "var(--line)" : "transparent"}`,
        transition: "background 240ms ease, border-color 240ms ease",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <button onClick={() => go("home")} aria-label="Starantor — Start" style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center" }}>
            <img src="assets/logo-web.png" alt="Starantor" style={{ height: 38, width: "auto" }}/>
          </button>

          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 30 }}>
            {items.map(n => (
              <button key={n.id} onClick={() => onNav(n.id)} className="nav-link" style={{
                background: "none", border: "none", padding: "6px 0", fontSize: 14.5, fontWeight: 500,
                color: "var(--text-muted)", transition: "color 180ms ease",
              }}>{n.label}</button>
            ))}
          </div>

          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <LangSwitch/>
            <button className="btn btn-fill btn-sm" onClick={() => onNav("contact")}>
              {t.nav.cta} <span className="arr">→</span>
            </button>
          </div>

          <button className="nav-burger" onClick={() => setOpen(v => !v)} aria-label="Menu" aria-expanded={open} style={{
            display: "none", background: "transparent", border: "1px solid var(--line-strong)", borderRadius: 8,
            width: 44, height: 40, alignItems: "center", justifyContent: "center", padding: 0,
          }}>
            <div style={{ position: "relative", width: 18, height: 12 }}>
              <span style={{ position: "absolute", left: 0, right: 0, top: open ? 5 : 0, height: 2, background: "var(--text)", transform: open ? "rotate(45deg)" : "none", transition: "all 200ms" }}/>
              <span style={{ position: "absolute", left: 0, right: 0, top: open ? 5 : 10, height: 2, background: "var(--text)", transform: open ? "rotate(-45deg)" : "none", transition: "all 200ms" }}/>
            </div>
          </button>
        </div>
      </nav>

      {open && (
        <div style={{ position: "fixed", inset: 0, paddingTop: "var(--nav-h)", zIndex: 99, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
          <div className="container" style={{ paddingTop: 28, paddingBottom: 28, display: "flex", flexDirection: "column" }}>
            {items.map((n, i) => (
              <button key={n.id} onClick={() => go(n.id)} style={{
                background: "none", border: "none", textAlign: "left", color: "var(--text)",
                padding: "18px 0", fontFamily: "Anton, sans-serif", textTransform: "uppercase",
                fontSize: 32, letterSpacing: "0.01em", borderBottom: "1px solid var(--line)",
              }}>
                <span className="tc" style={{ marginRight: 16 }}>0{i + 1}</span>{n.label}
              </button>
            ))}
            <button className="btn btn-blue" onClick={() => go("contact")} style={{ width: "100%", height: 54, marginTop: 28 }}>
              {t.nav.cta} <span className="arr">→</span>
            </button>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}><LangSwitch/></div>
          </div>
        </div>
      )}

      <style>{`
        .nav-link:hover { color: var(--text) !important; }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ============ HERO ============
function Hero({ onNav }) {
  const { t } = useT();
  const videoRef = useRef(null);
  const bgRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const conn = navigator.connection;
    if (REDUCED() || (conn && (conn.saveData || /2g/.test(conn.effectiveType || "")))) { setVideoFailed(true); return; }
    const onOk = () => setVideoReady(true);
    const onErr = () => setVideoFailed(true);
    v.addEventListener("loadeddata", onOk);
    v.addEventListener("error", onErr);
    const to = setTimeout(() => { if (!v.readyState) setVideoFailed(true); }, 5000);
    return () => { v.removeEventListener("loadeddata", onOk); v.removeEventListener("error", onErr); clearTimeout(to); };
  }, []);

  // Subtle parallax on the background layer
  useEffect(() => {
    if (REDUCED()) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.22}px)`;
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="home" style={{ padding: 0, borderTop: "none", minHeight: "100svh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <div ref={bgRef} aria-hidden="true" style={{ position: "absolute", inset: "-12% 0", zIndex: 0, willChange: "transform" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1100px 640px at 78% 16%, rgba(61,91,255,0.30), transparent 62%), radial-gradient(820px 560px at 8% 88%, rgba(61,91,255,0.14), transparent 60%), var(--bg)" }}/>
        {!videoFailed && (
          <video ref={videoRef} autoPlay muted loop playsInline preload="metadata"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: videoReady ? 0.5 : 0, transition: "opacity 900ms ease" }}>
            <source src={HERO_VIDEO} type="video/mp4"/>
          </video>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(11,12,15,0.92) 0%, rgba(11,12,15,0.7) 42%, rgba(11,12,15,0.38) 75%, rgba(11,12,15,0.72) 100%)" }}/>
        <div style={{ position: "absolute", inset: 0, opacity: 0.18, mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>")` }}/>
      </div>

      {/* Viewfinder frame around the whole hero */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 20, zIndex: 2, pointerEvents: "none", border: "1px solid rgba(255,255,255,0.07)" }}>
        <span style={{ position: "absolute", top: -1, left: -1, width: 26, height: 26, borderTop: "2px solid rgba(255,255,255,0.6)", borderLeft: "2px solid rgba(255,255,255,0.6)" }}/>
        <span style={{ position: "absolute", top: -1, right: -1, width: 26, height: 26, borderTop: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)" }}/>
        <span style={{ position: "absolute", bottom: -1, left: -1, width: 26, height: 26, borderBottom: "2px solid rgba(255,255,255,0.6)", borderLeft: "2px solid rgba(255,255,255,0.6)" }}/>
        <span style={{ position: "absolute", bottom: -1, right: -1, width: 26, height: 26, borderBottom: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)" }}/>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 3, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "calc(var(--nav-h) + 40px)", paddingBottom: 56 }}>
        <Reveal>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 10, padding: "7px 14px", border: "1px solid var(--line-strong)", borderRadius: 999, background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", marginBottom: 34 }}>
            <span className="rec-dot"/>
            <span className="eyebrow" style={{ color: "var(--text)" }}>{t.hero.badge}</span>
          </div>
        </Reveal>

        <h1 className="display-xl" style={{ marginBottom: 28, maxWidth: 1100 }}>
          <Reveal as="span" delay={60} style={{ display: "block" }}>{t.hero.line1}</Reveal>
          <Reveal as="span" delay={160} style={{ display: "block" }}><span className="outline">{t.hero.line2}</span></Reveal>
          <Reveal as="span" delay={260} style={{ display: "block" }}><span className="accent">{t.hero.line3}</span></Reveal>
        </h1>

        <Reveal delay={360}>
          <p style={{ fontSize: "clamp(16px, 1.5vw, 19px)", color: "var(--text-muted)", maxWidth: 560, margin: "0 0 40px", lineHeight: 1.6 }}>{t.hero.sub}</p>
        </Reveal>

        <Reveal delay={440}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn btn-blue" onClick={() => onNav("contact")}>{t.hero.ctaPrimary} <span className="arr">→</span></button>
            <button className="btn btn-ghost" onClick={() => onNav("work")}>{t.hero.ctaSecondary}</button>
          </div>
        </Reveal>
      </div>

      <div style={{ position: "relative", zIndex: 3, borderTop: "1px solid var(--line)", background: "rgba(11,12,15,0.5)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
        <div className="container" style={{ paddingTop: 22, paddingBottom: 22, display: "flex", alignItems: "center", gap: 36 }}>
          <div className="eyebrow hero-trust" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>{t.hero.trustedBy}</div>
          <div className="ticker" style={{ flex: 1 }}>
            <div className="ticker-track">
              {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", height: 44, flexShrink: 0 }}>
                  <img src={logo.src} alt={logo.name} loading="lazy" style={{ height: Math.min(logo.h, 32), width: "auto", maxWidth: 150, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.6 }}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .hero-trust { display: none; } .ticker-track { gap: 48px !important; animation-duration: 46s !important; } }`}</style>
    </section>
  );
}

// ============ WORK (portfolio + case overlay) ============
function Work() {
  const { t } = useT();
  const [openIdx, setOpenIdx] = useState(null);
  const items = t.work.items;
  return (
    <section id="work">
      <div className="container">
        <SectionHead eyebrow={t.work.eyebrow} a={t.work.h2a} b={t.work.h2b} sub={t.work.sub}/>
        <div className="work-grid">
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 2) * 90} style={{ gridColumn: i === 0 ? "span 2" : "span 1" }} className="work-cell">
              <WorkCard it={it} media={WORK_MEDIA[i % WORK_MEDIA.length]} idx={i} wide={i === 0} openLabel={t.work.open} onOpen={() => setOpenIdx(i)}/>
            </Reveal>
          ))}
        </div>
      </div>
      {openIdx !== null && (
        <CaseOverlay item={items[openIdx]} media={WORK_MEDIA[openIdx % WORK_MEDIA.length]} idx={openIdx} onClose={() => setOpenIdx(null)}/>
      )}
      <style>{`
        .work-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        @media (max-width: 760px) {
          .work-grid { grid-template-columns: 1fr; }
          .work-grid .work-cell { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  );
}

function WorkCard({ it, media, idx, wide, openLabel, onOpen }) {
  const vidRef = useRef(null);
  const [hover, setHover] = useState(false);

  // Hover preview: play silently while hovered
  useEffect(() => {
    const v = vidRef.current;
    if (!v || REDUCED()) return;
    if (hover) { v.play().catch(() => {}); } else { v.pause(); v.currentTime = 0; }
  }, [hover]);

  return (
    <button onClick={onOpen} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      aria-label={`${openLabel}: ${it.title} — ${it.client}`}
      style={{ background: "none", border: "none", padding: 0, textAlign: "left", display: "block", width: "100%", color: "var(--text)" }}>
      <div className="vf" style={{
        position: "relative", aspectRatio: wide ? "21/9" : "16/10", background: media.tone,
        borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--line)",
        transform: hover ? "translateY(-3px)" : "none", transition: "transform 260ms cubic-bezier(.3,.7,.3,1), border-color 260ms",
      }}>
        <Corners/>
        <video ref={vidRef} muted loop playsInline preload="metadata"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: hover ? 0.85 : 0.55, transition: "opacity 300ms ease, transform 600ms cubic-bezier(.2,.7,.2,1)", transform: hover ? "scale(1.04)" : "scale(1)" }}>
          <source src={media.video} type="video/mp4"/>
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,12,15,0.75), transparent 55%)" }}/>
        <div style={{ position: "absolute", top: 18, right: 44, display: "flex", gap: 8 }}>
          <span className="tc" style={{ color: "rgba(255,255,255,0.8)", background: "rgba(11,12,15,0.55)", padding: "5px 10px", borderRadius: 999, backdropFilter: "blur(8px)" }}>{it.tag}</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 28px 22px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "Anton, sans-serif", textTransform: "uppercase", fontSize: wide ? "clamp(24px, 3vw, 38px)" : "clamp(20px, 2.2vw, 28px)", lineHeight: 1 }}>{it.title}</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>{it.client} · {it.year}</div>
          </div>
          <div style={{
            width: 54, height: 54, borderRadius: "50%", flexShrink: 0,
            background: hover ? "var(--blue)" : "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "background 220ms ease, transform 220ms ease",
            transform: hover ? "scale(1.08)" : "scale(1)",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff" aria-hidden="true"><path d="M4 2 L13 8 L4 14 Z"/></svg>
          </div>
        </div>
      </div>
    </button>
  );
}

// ============ CASE OVERLAY (separate layer: big video + scroll-in description, blurred page behind) ============
function CaseOverlay({ item, media, idx, onClose }) {
  const { t } = useT();
  const scrollerRef = useRef(null);
  const stageVideoRef = useRef(null);
  const closeRef = useRef(null);
  const overlayRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Lock + blur the page behind, manage focus
  useEffect(() => {
    const prevFocus = document.activeElement;
    document.body.classList.add("case-open");
    requestAnimationFrame(() => { setMounted(true); closeRef.current && closeRef.current.focus(); });
    return () => {
      document.body.classList.remove("case-open");
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };
  }, []);

  // ESC to close + minimal focus trap
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const root = overlayRef.current;
      if (!root) return;
      const els = root.querySelectorAll('button, [href], input, textarea, video, [tabindex]:not([tabindex="-1"])');
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Scroll inside overlay drives the blur on the video stage
  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const p = Math.min(1, el.scrollTop / (window.innerHeight * 0.55));
    setProgress(p);
  }, []);

  useEffect(() => {
    const v = stageVideoRef.current;
    if (v) v.play().catch(() => {});
  }, []);

  const sec = t.work.sections;
  const blocks = [
    { label: sec.task, text: item.task },
    { label: sec.approach, text: item.approach },
    { label: sec.result, text: item.result },
  ];

  const overlay = (
    <div ref={overlayRef} role="dialog" aria-modal="true" aria-label={`${item.title} — ${item.client}`}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "rgba(8,9,12,0.6)",
        opacity: mounted ? 1 : 0, transition: "opacity 360ms ease",
      }}>
      {/* Close (X) */}
      <button ref={closeRef} onClick={onClose} aria-label={t.work.close} style={{
        position: "fixed", top: 22, right: 22, zIndex: 30,
        width: 48, height: 48, borderRadius: "50%",
        background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 200ms ease, transform 200ms ease",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--blue)"; e.currentTarget.style.transform = "rotate(90deg)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "none"; }}>
        <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 3 L15 15 M15 3 L3 15"/>
        </svg>
      </button>

      {/* Scroll container */}
      <div ref={scrollerRef} onScroll={onScroll} style={{ position: "absolute", inset: 0, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        {/* Sticky video stage — blurs and dims as the description scrolls in */}
        <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "max(5vh, 48px) 24px", zIndex: 1 }}>
          <div className="vf" style={{
            width: "min(1180px, 100%)", aspectRatio: "16/9", maxHeight: "82vh",
            borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)",
            background: media.tone, position: "relative",
            boxShadow: "0 40px 120px -30px rgba(0,0,0,0.7)",
            filter: `blur(${(progress * 14).toFixed(1)}px) brightness(${(1 - progress * 0.5).toFixed(2)})`,
            transform: `scale(${(1 - progress * 0.035).toFixed(3)}) translateY(${mounted ? 0 : 24}px)`,
            transition: "transform 420ms cubic-bezier(.2,.7,.2,1)",
            willChange: "filter, transform",
          }}>
            <Corners/>
            <video ref={stageVideoRef} controls autoPlay muted loop playsInline preload="auto"
              style={{ width: "100%", height: "100%", objectFit: "cover", background: "#000" }}>
              <source src={media.video} type="video/mp4"/>
            </video>
            <div style={{ position: "absolute", top: 16, left: 44, display: "flex", alignItems: "center", gap: 10, pointerEvents: "none" }}>
              <span className="rec-dot"/>
              <span className="tc" style={{ color: "rgba(255,255,255,0.85)" }}>{t.work.caseLabel} 0{idx + 1} — {item.client}</span>
            </div>
          </div>

          {/* Scroll hint */}
          <div aria-hidden="true" style={{
            position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            opacity: Math.max(0, 1 - progress * 2.5), transition: "opacity 200ms ease", pointerEvents: "none",
          }}>
            <span className="tc" style={{ color: "rgba(255,255,255,0.7)" }}>{t.work.scrollHint}</span>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" aria-hidden="true">
              <rect x="1" y="1" width="12" height="18" rx="6"/>
              <line x1="7" y1="5" x2="7" y2="9" style={{ animation: REDUCED() ? "none" : "pulse 1.6s ease-in-out infinite" }}/>
            </svg>
          </div>
        </div>

        {/* Description layer — rises over the blurred stage */}
        <div style={{ position: "relative", zIndex: 2, marginTop: "-12vh", paddingBottom: "12vh" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px" }}>
            <div style={{
              background: "rgba(17,19,25,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--line-strong)", borderRadius: 18, padding: "clamp(32px, 5vw, 64px)",
              boxShadow: "0 -20px 80px -20px rgba(0,0,0,0.6)",
            }}>
              <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span className="rec-dot"/>{item.tag} · {item.year}
              </div>
              <h2 className="display-md" style={{ marginBottom: 6 }}>{item.title}</h2>
              <div style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 40 }}>{item.client}</div>

              <div style={{ display: "grid", gap: 0 }}>
                {blocks.map((b, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 24, padding: "26px 0", borderTop: "1px solid var(--line)" }} className="case-row">
                    <div className="tc" style={{ color: "var(--blue)", paddingTop: 3 }}>{b.label}</div>
                    <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.65, color: "var(--text)" }}>{b.text}</p>
                  </div>
                ))}
              </div>

              <button onClick={onClose} className="btn btn-ghost" style={{ marginTop: 36 }}>
                ← {t.work.close}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 560px) { .case-row { grid-template-columns: 1fr !important; gap: 8px !important; } }`}</style>
    </div>
  );

  return ReactDOM.createPortal(overlay, document.getElementById("overlay-root"));
}

// ============ SERVICES ============
function Services() {
  const { t } = useT();
  return (
    <section id="services" style={{ background: "var(--bg-raise)" }}>
      <div className="container">
        <SectionHead eyebrow={t.services.eyebrow} a={t.services.h2a} b={t.services.h2b} sub={t.services.sub}/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {t.services.items.map((s, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="srv-card vf" style={{
                background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: "var(--radius)",
                padding: "34px 30px", height: "100%", position: "relative", overflow: "hidden",
                transition: "border-color 240ms ease, transform 240ms cubic-bezier(.3,.7,.3,1)",
              }}>
                <Corners/>
                <div className="tc" style={{ color: "var(--blue)", marginBottom: 22 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ fontFamily: "Anton, sans-serif", textTransform: "uppercase", fontSize: 22, marginBottom: 12 }}>{s.t}</div>
                <p style={{ margin: 0, fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <p style={{ marginTop: 28, fontSize: 14.5, color: "var(--text-faint)" }}>{t.services.note}</p>
        </Reveal>
      </div>
      <style>{`.srv-card:hover { border-color: var(--line-strong); transform: translateY(-3px); }`}</style>
    </section>
  );
}

// ============ SOCIAL MEDIA (single section — price on request) ============
function SocialMedia({ onNav }) {
  const { t } = useT();
  return (
    <section id="social">
      <div className="container">
        <SectionHead eyebrow={t.social.eyebrow} a={t.social.h2a} b={t.social.h2b}/>
        <div className="social-grid">
          <div>
            <Reveal>
              <p style={{ fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.6, color: "var(--text)", margin: "0 0 44px", maxWidth: 560 }}>{t.social.lead}</p>
            </Reveal>
            <div style={{ display: "grid", gap: 0 }}>
              {t.social.points.map((p, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 20, padding: "24px 0", borderTop: "1px solid var(--line)" }}>
                    <div className="tc" style={{ color: "var(--blue)", paddingTop: 4 }}>{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{p.t}</div>
                      <p style={{ margin: 0, fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>{p.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <div className="vf" style={{
              position: "sticky", top: "calc(var(--nav-h) + 24px)",
              background: "linear-gradient(160deg, var(--bg-card), #10131C)",
              border: "1px solid var(--line-strong)", borderRadius: 16, padding: "clamp(32px, 3.5vw, 48px)",
              overflow: "hidden",
            }}>
              <Corners/>
              <div aria-hidden="true" style={{ position: "absolute", right: -100, top: -100, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(61,91,255,0.28), transparent 65%)", pointerEvents: "none" }}/>
              <div className="eyebrow" style={{ marginBottom: 26 }}>{t.social.priceLabel}</div>
              <div style={{ fontFamily: "Anton, sans-serif", textTransform: "uppercase", fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1, marginBottom: 20 }}>
                <span className="accent">{t.social.price}</span>
              </div>
              <p style={{ margin: "0 0 32px", fontSize: 15.5, color: "var(--text-muted)", lineHeight: 1.6 }}>{t.social.priceNote}</p>

              <div style={{ display: "grid", gap: 14, marginBottom: 36 }}>
                {t.social.facts.map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, paddingBottom: 14, borderBottom: "1px solid var(--line)", fontSize: 14.5 }}>
                    <span className="tc" style={{ paddingTop: 2 }}>{f.k}</span>
                    <span style={{ textAlign: "right", color: "var(--text)" }}>{f.v}</span>
                  </div>
                ))}
              </div>

              <button className="btn btn-blue" style={{ width: "100%", height: 54 }} onClick={() => onNav("contact")}>
                {t.social.cta} <span className="arr">→</span>
              </button>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        .social-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 64px; align-items: start; }
        @media (max-width: 900px) { .social-grid { grid-template-columns: 1fr; gap: 44px; } .social-grid .vf { position: static !important; } }
      `}</style>
    </section>
  );
}

// ============ PROCESS ============
function Process() {
  const { t } = useT();
  return (
    <section id="process" style={{ background: "var(--bg-raise)" }}>
      <div className="container">
        <SectionHead eyebrow={t.process.eyebrow} a={t.process.h2a} b={t.process.h2b} sub={t.process.sub}/>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
          {t.process.steps.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="proc">
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
                  <div className="proc-num" style={{
                    width: 60, height: 60, borderRadius: "50%", flexShrink: 0,
                    border: "1px solid var(--line-strong)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Anton, sans-serif", fontSize: 22,
                    transition: "background 240ms ease, border-color 240ms ease, box-shadow 240ms ease",
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, height: 1, background: "var(--line)" }}/>
                </div>
                <div style={{ fontFamily: "Anton, sans-serif", textTransform: "uppercase", fontSize: 24, marginBottom: 12 }}>{s.t}</div>
                <p style={{ margin: 0, fontSize: 15.5, color: "var(--text-muted)", lineHeight: 1.6 }}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`.proc:hover .proc-num { background: var(--blue); border-color: var(--blue); box-shadow: 0 10px 30px -10px var(--blue-glow); }`}</style>
    </section>
  );
}

// ============ ABOUT ============
function AboutUs() {
  const { t } = useT();
  const tints = ["linear-gradient(150deg, #1A2342, #10131C)", "linear-gradient(150deg, #14171E, #0D1119)"];
  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div>
            <SectionHead eyebrow={t.about.eyebrow} a={t.about.h2a} b={t.about.h2b}/>
            <Reveal><p style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.65, margin: "0 0 18px", maxWidth: 520 }}>{t.about.p1}</p></Reveal>
            <Reveal delay={80}><p style={{ fontSize: 15.5, color: "var(--text-muted)", lineHeight: 1.65, margin: "0 0 36px", maxWidth: 520 }}>{t.about.p2}</p></Reveal>
            <Reveal delay={140}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 14 }}>{t.about.gearLabel}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {t.about.gear.map((g, i) => (
                    <span key={i} className="tc" style={{ border: "1px solid var(--line-strong)", borderRadius: 999, padding: "7px 14px", color: "var(--text-muted)" }}>{g}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {t.about.founders.map((f, i) => (
              <Reveal key={f.name} delay={i * 110}>
                <div className="vf" style={{ aspectRatio: "4/5", background: tints[i], borderRadius: "var(--radius)", position: "relative", overflow: "hidden", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Corners/>
                  {/* PLACEHOLDER — replace with founder portraits (assets/team/*.jpg) */}
                  <div style={{ fontFamily: "Anton, sans-serif", fontSize: 52, color: "rgba(255,255,255,0.85)" }}>
                    {f.name.split(" ").map(n => n[0]).join("")}
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.45 }}>{f.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .about-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 72px; align-items: center; }
        @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr; gap: 48px; } }
      `}</style>
    </section>
  );
}

// ============ CLIENTS ============
function Clients() {
  const { t } = useT();
  return (
    <section id="clients" style={{ background: "var(--bg-raise)" }}>
      <div className="container">
        <SectionHead eyebrow={t.clients.eyebrow} a={t.clients.h2a} b={t.clients.h2b} sub={t.clients.sub}/>
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, background: "var(--line)", border: "1px solid var(--line)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            {CLIENT_LOGOS.map((logo, i) => (
              <div key={i} className="client-cell" style={{ background: "var(--bg-card)", padding: "44px 28px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 134, transition: "background 220ms ease" }}>
                <img src={logo.src} alt={logo.name} loading="lazy" style={{ height: logo.h, maxWidth: "78%", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.55, transition: "opacity 220ms ease" }}/>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <style>{`.client-cell:hover { background: #181C26 !important; } .client-cell:hover img { opacity: 0.95 !important; }`}</style>
    </section>
  );
}

// ============ CONTACT ============
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Contact() {
  const { t } = useT();
  const c = t.contact;
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim() || form.name.length > 120) errs.name = c.errors.name;
    if (!EMAIL_RE.test(form.email) || form.email.length > 254) errs.email = c.errors.email;
    if (!form.message.trim() || form.message.length > 4000) errs.message = c.errors.message;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const body = encodeURIComponent(`${c.labels.name}: ${form.name}\n${c.labels.email}: ${form.email}\n${c.labels.company}: ${form.company}\n\n${form.message}`);
    const subject = encodeURIComponent("Projektanfrage — Starantor");
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field = (key, label, ph, type = "text", as) => (
    <label>
      <div className="tc" style={{ marginBottom: 7, color: "var(--text-muted)" }}>{label}</div>
      {as === "textarea"
        ? <textarea rows={5} maxLength={4000} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} aria-invalid={!!errors[key]}/>
        : <input type={type} maxLength={254} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} aria-invalid={!!errors[key]} autoComplete={key === "email" ? "email" : key === "name" ? "name" : "organization"}/>}
      {errors[key] && <div role="alert" style={{ fontSize: 13, color: "#FF6B5E", marginTop: 6 }}>{errors[key]}</div>}
    </label>
  );

  return (
    <section id="contact" style={{ overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 540px at 80% 0%, rgba(61,91,255,0.14), transparent 60%)", pointerEvents: "none" }}/>
      <div className="container" style={{ position: "relative" }}>
        <div className="contact-grid">
          <div>
            <SectionHead eyebrow={c.eyebrow} a={c.h2a} b={c.h2b} sub={c.sub}/>
            <Reveal delay={100}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>{c.direct}</div>
              <div style={{ display: "grid", gap: 12, fontSize: 16 }}>
                <a href={`mailto:${CONTACT.email}`} className="contact-link">{CONTACT.email}</a>
                <a href={CONTACT.phoneHref} className="contact-link">{CONTACT.phone}</a>
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="contact-link">Instagram — @starantor.production</a>
                <a href={CONTACT.tiktok} target="_blank" rel="noopener noreferrer" className="contact-link">TikTok — @starantor.production</a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            {sent ? (
              <div className="vf" style={{ background: "var(--bg-card)", border: "1px solid var(--line-strong)", borderRadius: 16, padding: 44, position: "relative" }}>
                <Corners/>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l4 4L19 7"/></svg>
                </div>
                <div style={{ fontSize: 17 }}>{c.sent}</div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate style={{ display: "grid", gap: 16, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: 16, padding: "clamp(28px, 3vw, 40px)" }}>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {field("name", c.labels.name + " *", c.labels.namePh)}
                  {field("email", c.labels.email + " *", c.labels.emailPh, "email")}
                </div>
                {field("company", c.labels.company, c.labels.companyPh)}
                {field("message", c.labels.message + " *", c.labels.messagePh, "text", "textarea")}
                <button type="submit" className="btn btn-blue" style={{ height: 52, marginTop: 4 }}>{c.labels.send} <span className="arr">→</span></button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
      <style>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: 72px; align-items: start; }
        .contact-link { color: var(--text); border-bottom: 1px solid var(--line-strong); padding-bottom: 3px; width: fit-content; transition: border-color 180ms ease, color 180ms ease; }
        .contact-link:hover { color: var(--blue); border-color: var(--blue); }
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; gap: 44px; } }
        @media (max-width: 560px) { .form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

// ============ FOOTER ============
function Footer({ onNav }) {
  const { t } = useT();
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "64px 0 32px", background: "var(--bg)" }}>
      <div className="container">
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 44, marginBottom: 48 }}>
          <div>
            <img src="assets/logo-web.png" alt="Starantor" style={{ height: 44, marginBottom: 18 }}/>
            <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 280, lineHeight: 1.55, margin: 0 }}>{t.footer.tagline}</p>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>{t.footer.nav}</div>
            <div style={{ display: "grid", gap: 11, fontSize: 14 }}>
              {[["work", t.nav.work], ["services", t.nav.services], ["social", t.nav.social], ["about", t.nav.about]].map(([id, label]) => (
                <button key={id} onClick={() => onNav(id)} className="f-link" style={{ background: "none", border: "none", padding: 0, textAlign: "left", color: "var(--text-muted)", fontSize: 14, transition: "color 160ms ease" }}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>{t.footer.contact}</div>
            <div style={{ display: "grid", gap: 11, fontSize: 14, color: "var(--text-muted)" }}>
              <a href={`mailto:${CONTACT.email}`} className="f-link">{CONTACT.email}</a>
              <a href={CONTACT.phoneHref} className="f-link">{CONTACT.phone}</a>
              <span>Schweiz</span>
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>{t.footer.social}</div>
            <div style={{ display: "grid", gap: 11, fontSize: 14, color: "var(--text-muted)" }}>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="f-link">Instagram</a>
              <a href={CONTACT.tiktok} target="_blank" rel="noopener noreferrer" className="f-link">TikTok</a>
            </div>
            <div style={{ marginTop: 22 }}><LangSwitch/></div>
          </div>
        </div>
        <div style={{ paddingTop: 24, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, color: "var(--text-faint)" }}>{t.footer.rights}</div>
          <div style={{ fontSize: 13, color: "var(--text-faint)" }}>Luan Stauffer & Dominik Bürge</div>
        </div>
      </div>
      <style>{`
        .f-link:hover { color: var(--text) !important; }
        @media (max-width: 860px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 540px) { .footer-grid { grid-template-columns: 1fr !important; gap: 34px !important; } }
      `}</style>
    </footer>
  );
}

// ============ APP ============
function App() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem("starantor-lang");
      return stored === "en" || stored === "de" ? stored : "de";
    } catch { return "de"; }
  });

  const setLang = (l) => {
    if (l !== "de" && l !== "en") return;
    setLangState(l);
    try { localStorage.setItem("starantor-lang", l); } catch {}
  };

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = (id) => {
    if (id === "home") { window.scrollTo({ top: 0, behavior: REDUCED() ? "auto" : "smooth" }); return; }
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: REDUCED() ? "auto" : "smooth" });
  };

  const t = window.I18N[lang] || window.I18N.de;

  return (
    <LangCtx.Provider value={{ lang, setLang, t }}>
      <Nav onNav={nav} scrolled={scrolled}/>
      <main>
        <Hero onNav={nav}/>
        <Work/>
        <Services/>
        <SocialMedia onNav={nav}/>
        <Process/>
        <AboutUs/>
        <Clients/>
        <Contact/>
      </main>
      <Footer onNav={nav}/>
      <Timecode/>
    </LangCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
