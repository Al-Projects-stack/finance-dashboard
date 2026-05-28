import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  IconBrandLogo, IconTrendUp, IconArrows, IconWallet, IconPercent, IconFilter, IconGrid,
} from '../components/Icons';
import styles from './LandingPage.module.css';

/* ══════════════════════════════════════════════════════════
   CANVAS  particle constellation
══════════════════════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId;
    const mouse = { x: -999, y: -999 };
    const COLS = ['139,92,246','6,182,212','168,85,247','34,211,238'];

    class P {
      constructor() { this.init(); }
      init() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - .5) * .4;
        this.vy = (Math.random() - .5) * .4;
        this.r  = Math.random() * 1.8 + .7;
        this.c  = COLS[Math.floor(Math.random() * COLS.length)];
        this.a  = Math.random() * .35 + .15;
      }
      tick() {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < 110) { this.vx += dx/d*.28; this.vy += dy/d*.28; }
        const sp = Math.hypot(this.vx, this.vy);
        if (sp > 2) { this.vx = this.vx/sp*2; this.vy = this.vy/sp*2; }
        this.vx *= .99; this.vy *= .99;
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${this.c},${this.a})`;
        ctx.fill();
      }
    }

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();

    const pts = Array.from({ length: 62 }, () => new P());

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i+1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${(1 - d/130)*.13})`;
            ctx.lineWidth = .7;
            ctx.stroke();
          }
        }
      }
      pts.forEach(p => { p.tick(); p.draw(); });
      animId = requestAnimationFrame(loop);
    };
    loop();

    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className={styles.canvas} />;
}

/* ══════════════════════════════════════════════════════════
   CURSOR AURORA
══════════════════════════════════════════════════════════ */
function CursorAurora() {
  useEffect(() => {
    const fn = e => {
      document.documentElement.style.setProperty('--cx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cy', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);
  return null;
}

/* ══════════════════════════════════════════════════════════
   MAGNETIC BUTTON
══════════════════════════════════════════════════════════ */
function Mag({ to, children, className, s = .42 }) {
  const r = useRef(null);
  const mv = e => {
    if (!r.current) return;
    const b = r.current.getBoundingClientRect();
    const x = (e.clientX - b.left - b.width/2)  * s;
    const y = (e.clientY - b.top  - b.height/2) * s;
    r.current.style.transform = `translate(${x}px,${y}px)`;
  };
  const lv = () => { if (r.current) r.current.style.transform = ''; };
  return <Link ref={r} to={to} className={className} onMouseMove={mv} onMouseLeave={lv}>{children}</Link>;
}

/* ══════════════════════════════════════════════════════════
   3-D TILT CARD
══════════════════════════════════════════════════════════ */
function Tilt({ children, className, depth = 13, style, ...rest }) {
  const card  = useRef(null);
  const shine = useRef(null);
  const mv = e => {
    if (!card.current) return;
    const b = card.current.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width  - .5;
    const y = (e.clientY - b.top)  / b.height - .5;
    card.current.style.transform = `perspective(900px) rotateY(${x*depth}deg) rotateX(${-y*depth}deg) scale(1.03)`;
    if (shine.current)
      shine.current.style.background = `radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%, rgba(255,255,255,0.07) 0%, transparent 62%)`;
  };
  const lv = () => {
    if (card.current)  card.current.style.transform  = '';
    if (shine.current) shine.current.style.background = '';
  };
  return (
    <div ref={card} className={className} style={{ transition:'transform .12s ease', ...style }}
      onMouseMove={mv} onMouseLeave={lv} {...rest}>
      <div ref={shine} className={styles.shine} />
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CHARACTER SPLIT ANIMATED TITLE
══════════════════════════════════════════════════════════ */
function Split({ text, delay = 0, cls }) {
  return (
    <span className={cls} aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} className={styles.ch} style={{ animationDelay:`${delay + i*32}ms` }} aria-hidden>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   CYCLING HEADLINE WORD
   Each letter shatters into particles one at a time,
   then the new word springs in letter by letter.
══════════════════════════════════════════════════════════ */
const CYCLE_WORDS = [
  'reimagined.',
  'simplified.',
  'unlocked.',
  'redefined.',
  'elevated.',
  'visualised.',
  'transformed.',
];

const P_COLS = [
  '168,85,247','192,132,252','216,180,254',
  '34,211,238','103,232,249','139,92,246',
];

const STAGGER = 60; // ms between each letter shattering

function WordCycle() {
  const canvasRef = useRef(null);
  const parts     = useRef([]);
  const rafId     = useRef(null);
  const looping   = useRef(false);
  const charRefs  = useRef([]);
  const idxRef    = useRef(0);
  const busy      = useRef(false);

  const [displayIdx, setDisplayIdx] = useState(0);
  const [phase,      setPhase]      = useState('idle'); // 'idle' | 'enter'
  const [hiddenSet,  setHiddenSet]  = useState(new Set());
  const hiddenRef = useRef(new Set());

  const word  = CYCLE_WORDS[displayIdx];
  const chars = [...word];

  /* fill-screen canvas */
  useEffect(() => {
    const resize = () => {
      const c = canvasRef.current;
      if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* render loop */
  const kickLoop = useCallback(() => {
    if (looping.current) return;
    looping.current = true;
    const cv = canvasRef.current;
    const loop = () => {
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.current = parts.current.filter(p => p.a > 0);
      parts.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += p.glow ? .045 : .13;
        p.vx *= .97;
        p.a  -= p.glow ? .011 : .022;
        p.sz *= p.glow ? .992 : .976;
        p.rot += p.rv;
        ctx.save();
        ctx.globalAlpha = Math.max(p.a, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.glow) {
          const g = ctx.createRadialGradient(0,0,0,0,0,p.sz);
          g.addColorStop(0,   `rgba(${p.col},${p.a})`);
          g.addColorStop(.45, `rgba(${p.col},${p.a*.28})`);
          g.addColorStop(1,   `rgba(${p.col},0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(0,0,p.sz,0,Math.PI*2); ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${p.col},${p.a})`;
          if (p.sq) ctx.fillRect(-p.sz/2,-p.sz*.38,p.sz,p.sz*.76);
          else { ctx.beginPath(); ctx.arc(0,0,Math.max(p.sz*.5,.1),0,Math.PI*2); ctx.fill(); }
        }
        ctx.restore();
      });
      if (parts.current.length > 0) rafId.current = requestAnimationFrame(loop);
      else looping.current = false;
    };
    rafId.current = requestAnimationFrame(loop);
  }, []);

  /* shatter one letter: particles originate inside its bounding box */
  const shatterChar = useCallback((el) => {
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;

    /* 22 shards spread across the letter rect, flying outward */
    for (let i = 0; i < 22; i++) {
      const px  = r.left + Math.random() * r.width;
      const py  = r.top  + Math.random() * r.height;
      const dx  = px - cx, dy = py - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const spd  = Math.random() * 6 + 2;
      parts.current.push({
        x: px, y: py,
        vx: (dx/dist) * spd + (Math.random()-.5) * 2,
        vy: (dy/dist) * spd - Math.random() * 2.5,
        a: 1, sz: Math.random() * 3 + .8,
        col: P_COLS[Math.floor(Math.random() * P_COLS.length)],
        rot: Math.random() * Math.PI * 2,
        rv:  (Math.random() - .5) * .35,
        sq:  Math.random() > .52,
        glow: false,
      });
    }
    /* 2 soft glow orbs bloom from the letter centre */
    for (let i = 0; i < 2; i++) {
      parts.current.push({
        x: cx + (Math.random()-.5)*r.width*.4,
        y: cy + (Math.random()-.5)*r.height*.4,
        vx: (Math.random()-.5)*2,
        vy: -(Math.random()*1.8+.4),
        a: .65, sz: Math.random()*9+5,
        col: Math.random()>.5 ? '168,85,247' : '34,211,238',
        rot:0, rv:0, sq:false, glow:true,
      });
    }
    kickLoop();
  }, [kickLoop]);

  /* run a full word swap */
  const triggerTransition = useCallback(() => {
    if (busy.current) return;
    busy.current = true;

    const len = [...CYCLE_WORDS[idxRef.current]].length;
    const els = charRefs.current.slice(0, len);

    /* shatter each letter one at a time, left to right */
    els.forEach((el, i) => {
      setTimeout(() => {
        /* instantly hide this letter -- particles take its place */
        hiddenRef.current = new Set(hiddenRef.current).add(i);
        setHiddenSet(new Set(hiddenRef.current));
        shatterChar(el);
      }, i * STAGGER);
    });

    /* once the last letter is gone, bring in the next word */
    const switchAt = (len - 1) * STAGGER + 80;
    setTimeout(() => {
      idxRef.current = (idxRef.current + 1) % CYCLE_WORDS.length;
      hiddenRef.current = new Set();
      setHiddenSet(new Set());
      setDisplayIdx(idxRef.current);
      setPhase('enter');

      /* unlock after the enter animation finishes */
      const newLen = [...CYCLE_WORDS[idxRef.current]].length;
      setTimeout(() => {
        setPhase('idle');
        busy.current = false;
      }, (newLen - 1) * 28 + 750);
    }, switchAt);
  }, [shatterChar]);

  useEffect(() => {
    const tid = setInterval(triggerTransition, 3200);
    return () => { clearInterval(tid); cancelAnimationFrame(rafId.current); };
  }, [triggerTransition]);

  return (
    <>
      <canvas ref={canvasRef}
        style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:50 }} />
      <span className={styles.cycleWordWrap} aria-live="polite" aria-label={word}>
        {chars.map((ch, i) => (
          <span
            key={`${displayIdx}-${i}`}
            ref={el => { charRefs.current[i] = el; }}
            className={`${styles.cycleChar} ${phase === 'enter' ? styles.cycleCharEnter : ''}`}
            style={{
              opacity: hiddenSet.has(i) ? 0 : 1,
              animationDelay: phase === 'enter' ? `${i * 28}ms` : '0ms',
            }}
            aria-hidden
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </span>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add(styles.vis); io.unobserve(e.target); }
      }),
      { threshold: .08 }
    );
    document.querySelectorAll('[data-sr]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ══════════════════════════════════════════════════════════
   INTERACTIVE MOCK CARD
══════════════════════════════════════════════════════════ */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const PERIODS = {
  '1M': { h:[65,72,80,68,85,70,90,76,82,88,74,91], l:['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'] },
  '3M': { h:[55,68,74,82,70,78,85,60,72,90,65,80], l:['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'] },
  '6M': { h:[48,56,62,70,68,82,75,65,80,58,72,84], l:['Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov'] },
  '1Y': { h:[42,68,52,84,60,78,65,90,70,82,58,75], l:MONTHS },
};

const INIT_TXS = [
  { id:1, cat:'Income',        name:'Salary',        amt:'+R 32 000', col:'#10b981' },
  { id:2, cat:'Food',          name:'Groceries',     amt:'-R 1 850',  col:'#f43f5e' },
  { id:3, cat:'Entertainment', name:'Netflix',       amt:'-R 199',    col:'#f43f5e' },
  { id:4, cat:'Transport',     name:'Uber',          amt:'-R 340',    col:'#f43f5e' },
  { id:5, cat:'Savings',       name:'Investment',    amt:'+R 5 000',  col:'#22d3ee' },
];
const LIVE_POOL = [
  { cat:'Coffee',    name:'Vida e Caffe',    amt:'-R 48',     col:'#f43f5e' },
  { cat:'Income',    name:'Freelance',       amt:'+R 4 500',  col:'#10b981' },
  { cat:'Utilities', name:'Electricity',    amt:'-R 890',    col:'#f43f5e' },
  { cat:'Shopping',  name:'Woolworths',     amt:'-R 620',    col:'#f43f5e' },
  { cat:'Savings',   name:'Emergency Fund', amt:'+R 2 000',  col:'#22d3ee' },
];
const DONUTS = [
  { label:'Savings',       pct:35, col:'#10b981' },
  { label:'Food',          pct:22, col:'#f43f5e' },
  { label:'Transport',     pct:18, col:'#f59e0b' },
  { label:'Entertainment', pct:12, col:'#c084fc' },
  { label:'Utilities',     pct:13, col:'#22d3ee' },
];
const MOCK_KPIS = [
  { label:'Balance',  raw:48500, fmt: v => `R ${Math.round(v).toLocaleString('en-ZA')}`, col:'#c084fc', trend:+8.2  },
  { label:'Income',   raw:32000, fmt: v => `R ${Math.round(v).toLocaleString('en-ZA')}`, col:'#10b981', trend:+3.5  },
  { label:'Expenses', raw:14200, fmt: v => `R ${Math.round(v).toLocaleString('en-ZA')}`, col:'#f43f5e', trend:-1.8  },
  { label:'Savings',  raw:55.6,  fmt: v => `${v.toFixed(1)}%`,                           col:'#22d3ee', trend:+12.4 },
];

function DonutChart({ data }) {
  const [hov, setHov] = useState(null);
  const cx = 60, cy = 60, R = 46, ri = 30;
  const total = data.reduce((s, d) => s + d.pct, 0);
  const toXY = (r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  let cum = 0;
  const slices = data.map((d, i) => {
    const start = cum; cum += (d.pct / total) * 360;
    return { ...d, start, sweep: (d.pct / total) * 360, i };
  });
  const arc = (ro, start, sweep) => {
    const end = start + sweep - 0.5;
    const lg  = sweep > 180 ? 1 : 0;
    const [sx,sy] = toXY(ro, start); const [ex,ey] = toXY(ro, end);
    const [ix,iy] = toXY(ri, end);   const [ox,oy] = toXY(ri, start);
    return `M${sx},${sy} A${ro},${ro} 0 ${lg},1 ${ex},${ey} L${ix},${iy} A${ri},${ri} 0 ${lg},0 ${ox},${oy}Z`;
  };
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" style={{ overflow:'visible', flexShrink:0 }}>
      {slices.map(s => {
        const on = hov === s.i;
        return (
          <path key={s.label} d={arc(on ? R + 6 : R, s.start, s.sweep)} fill={s.col}
            opacity={hov !== null && !on ? 0.25 : 0.85}
            style={{ transition:'all .2s ease', cursor:'pointer',
              filter: on ? `drop-shadow(0 0 8px ${s.col})` : 'none' }}
            onMouseEnter={() => setHov(s.i)} onMouseLeave={() => setHov(null)} />
        );
      })}
      <circle cx={cx} cy={cy} r={ri - 1} fill="rgba(8,6,20,.96)" />
      {hov !== null ? (<>
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="7" fontWeight="700" fill={data[hov].col}>{data[hov].label}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize="14" fontWeight="800" fill="#f8fafc">{data[hov].pct}%</text>
      </>) : (<>
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#64748b" letterSpacing="0.08em">SPENDING</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="6.5" fill="#475569">May 2025</text>
      </>)}
    </svg>
  );
}

function MockCard({ fwdRef }) {
  const [tab,       setTab]       = useState('overview');
  const [period,    setPeriod]    = useState('1Y');
  const [hovBar,    setHovBar]    = useState(null);
  const [catFilter, setCatFilter] = useState('All');
  const [txs,       setTxs]       = useState(INIT_TXS);
  const [flashId,   setFlashId]   = useState(null);
  const [toast,     setToast]     = useState(null);
  const liveIdx = useRef(0);
  const kpiEls  = useRef([]);

  const barData  = PERIODS[period];
  const allCats  = ['All', ...new Set(INIT_TXS.map(t => t.cat))];
  const shownTxs = catFilter === 'All' ? txs : txs.filter(t => t.cat === catFilter);

  useEffect(() => {
    if (tab !== 'overview') return;
    MOCK_KPIS.forEach((k, i) => {
      const el = kpiEls.current[i];
      if (!el) return;
      const dur = 820, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = k.fmt((1 - Math.pow(1 - p, 3)) * k.raw);
        if (p < 1) requestAnimationFrame(tick);
      };
      setTimeout(() => requestAnimationFrame(tick), i * 90);
    });
  }, [tab, period]);

  useEffect(() => {
    if (tab !== 'transactions') return;
    const tid = setInterval(() => {
      const base  = LIVE_POOL[liveIdx.current % LIVE_POOL.length];
      liveIdx.current++;
      const newTx = { ...base, id: Date.now() };
      setFlashId(newTx.id);
      setTxs(prev => [newTx, ...prev].slice(0, 7));
      setToast(newTx);
      setTimeout(() => setFlashId(null), 1400);
      setTimeout(() => setToast(null),   2600);
    }, 2800);
    return () => clearInterval(tid);
  }, [tab]);

  return (
    <div className={styles.mockCard} ref={fwdRef}>

      {toast && (
        <div className={styles.toast}>
          <span className={styles.livePip} />
          <span className={styles.toastTxt}>
            {toast.name}&ensp;<strong style={{ color:toast.col }}>{toast.amt}</strong>
          </span>
        </div>
      )}

      <div className={styles.titleBar}>
        <div className={styles.titleLeft}>
          <span className={`${styles.tDot} ${styles.tRed}`}   />
          <span className={`${styles.tDot} ${styles.tYellow}`}/>
          <span className={`${styles.tDot} ${styles.tGreen}`} />
          <span className={styles.livePip}   />
          <span className={styles.liveLabel}>LIVE</span>
        </div>
        <div className={styles.tabBar}>
          {['overview','transactions','analytics'].map(t => (
            <button key={t}
              className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (<>
        <div className={styles.mkpis}>
          {MOCK_KPIS.map((k, i) => (
            <div key={k.label} className={styles.mkpi}>
              <span className={styles.mkpiL}>{k.label}</span>
              <span className={styles.mkpiV} style={{ color:k.col }}
                ref={el => { kpiEls.current[i] = el; }}>
                {k.fmt(k.raw)}
              </span>
              <span className={`${styles.mkpiTrend} ${k.trend >= 0 ? styles.mkpiUp : styles.mkpiDown}`}>
                {k.trend >= 0 ? '↑' : '↓'} {Math.abs(k.trend)}%
              </span>
            </div>
          ))}
        </div>
        <div className={styles.mchart}>
          <div className={styles.mchartHead}>
            <span className={styles.mchartL}>Cash Flow</span>
            <div className={styles.periodBar}>
              {Object.keys(PERIODS).map(p => (
                <button key={p}
                  className={`${styles.periodBtn} ${period === p ? styles.periodActive : ''}`}
                  onClick={() => setPeriod(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.mbars}>
            {barData.h.map((h, i) => (
              <div key={`${period}-${i}`} className={styles.mbarT}
                onMouseEnter={() => setHovBar(i)}
                onMouseLeave={() => setHovBar(null)}>
                {hovBar === i && (
                  <div className={styles.barTip}>
                    <span className={styles.barTipMonth}>{barData.l[i]}</span>
                    <strong className={styles.barTipVal}>R {Math.round(h / 100 * 48000).toLocaleString('en-ZA')}</strong>
                  </div>
                )}
                <div className={`${styles.mbar} ${hovBar === i ? styles.mbarHov : ''}`}
                  style={{ height:`${h}%`, '--i':i }} />
              </div>
            ))}
          </div>
        </div>
      </>)}

      {tab === 'transactions' && (<>
        <div className={styles.catChips}>
          {allCats.map(c => (
            <button key={c}
              className={`${styles.catChip} ${catFilter === c ? styles.catChipActive : ''}`}
              onClick={() => setCatFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className={styles.mrows}>
          {shownTxs.length === 0
            ? <div className={styles.mEmpty}>No {catFilter} transactions yet</div>
            : shownTxs.map(tx => (
                <div key={tx.id}
                  className={`${styles.mrow} ${tx.id === flashId ? styles.mrowNew : ''}`}>
                  <span className={styles.mcat}>{tx.cat}</span>
                  <span className={styles.mname}>{tx.name}</span>
                  <span className={styles.mamt} style={{ color:tx.col }}>{tx.amt}</span>
                </div>
              ))
          }
          <div className={styles.mLiveHint}>
            <span className={styles.livePip} />
            New transactions appearing live
          </div>
        </div>
      </>)}

      {tab === 'analytics' && (
        <div className={styles.analytics}>
          <DonutChart data={DONUTS} />
          <div className={styles.donutLegend}>
            {DONUTS.map(d => (
              <div key={d.label} className={styles.legendRow}>
                <span className={styles.legendDot} style={{ background:d.col }} />
                <span className={styles.legendName}>{d.label}</span>
                <span className={styles.legendPct}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FEATURE DATA
══════════════════════════════════════════════════════════ */
const FEATS = [
  { Icon:IconArrows,   col:'purple', title:'Track Every Transaction',
    desc:'Log income and expenses with categories, dates, and notes. Add, edit, delete in seconds.' },
  { Icon:IconTrendUp,  col:'cyan',   title:'Visualise Your Trends',
    desc:'Line charts, bar charts and doughnut breakdowns reveal patterns you\'d never spot in a spreadsheet.' },
  { Icon:IconWallet,   col:'green',  title:'Know Your Balance',
    desc:'Live KPI cards show total balance, income, expenses and savings rate, updated the moment you add a record.' },
  { Icon:IconPercent,  col:'amber',  title:'Savings Rate at a Glance',
    desc:'See exactly how much of your income you\'re keeping. Set goals and watch your savings rate climb.' },
  { Icon:IconFilter,   col:'cyan',   title:'Smart Categories',
    desc:'Tag and organise every transaction your way. Filter, sort, and surface any record in under a second.' },
  { Icon:IconGrid,     col:'purple', title:'Full Dashboard View',
    desc:'One screen, every metric. Monthly cash flow, category breakdown and net balance, rendered live the moment you land.' },
];

const STEPS = [
  { n:'01', title:'Create your account',
    desc:'Takes about 30 seconds. No credit card, no long forms, just your email and a password.' },
  { n:'02', title:'Add your first transactions',
    desc:'Log income and expenses one by one or in bulk. Every entry goes straight into your dashboard.' },
  { n:'03', title:'Watch everything click into place',
    desc:'Charts update, KPIs recalculate, and trends emerge as soon as you hit save. That\'s it.' },
];

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  useReveal();
  const heroRef = useRef(null);
  const mockRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const mock = mockRef.current;
    if (!hero || !mock) return;
    const mv = e => {
      const b = hero.getBoundingClientRect();
      const x = ((e.clientX - b.left)/b.width  - .5) * 18;
      const y = ((e.clientY - b.top) /b.height - .5) * 11;
      mock.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-14px)`;
    };
    const lv = () => { mock.style.transform = 'perspective(1200px) rotateY(-5deg) rotateX(4deg) translateY(-14px)'; };
    hero.addEventListener('mousemove', mv);
    hero.addEventListener('mouseleave', lv);
    return () => { hero.removeEventListener('mousemove', mv); hero.removeEventListener('mouseleave', lv); };
  }, []);

  return (
    <div className={styles.page}>
      <CursorAurora />
      <ParticleCanvas />
      <div className={styles.cursorGlow} aria-hidden />

      {/* NAV */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}><IconBrandLogo size={19} /></span>
          <span className={styles.brandName}>FinanceOS</span>
        </Link>
        <div className={styles.navR}>
          <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Mag to="/register" className={`btn btn-primary btn-sm ${styles.navCta}`}>Get Started →</Mag>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.grid}   aria-hidden />
        <div className={styles.aurora} aria-hidden />

        <h1 className={styles.h1}>
          <Split text="Finances" delay={80} cls={styles.line1} />
          <br />
          <WordCycle />
        </h1>

        <p className={styles.sub} data-sr>
          Track income, monitor expenses and visualise your financial health,
          all in one beautiful, privacy-first dashboard.
        </p>

        <div className={styles.ctas} data-sr style={{ '--delay':'160ms' }}>
          <Mag to="/register" className={`btn btn-primary ${styles.ctaMain}`} s={.5}>
            <span>Start for Free</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Mag>
          <Link to="/login" className={`btn btn-ghost ${styles.ctaGhost}`}>See Demo</Link>
        </div>

        {/* 3-D mockup */}
        <div className={styles.mockWrap}>
          <div className={styles.mockGlow}  aria-hidden />
          <div className={styles.mockGlow2} aria-hidden />
          <MockCard fwdRef={mockRef} />
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.feats}>
        <span className={styles.pill} data-sr>Features</span>
        <h2 className={styles.featsH} data-sr>Everything to master your money</h2>
        <p  className={styles.featsSub} data-sr>
          Built for people who take their finances seriously. No fluff, just the data that matters.
        </p>
        <div className={styles.featGrid}>
          {FEATS.map((f, i) => (
            <div data-sr key={f.title} style={{ '--delay':`${i*90}ms` }}>
              <Tilt className={`${styles.feat} ${styles[`f_${f.col}`]}`}>
                <div className={`${styles.fIcon} ${styles[`fi_${f.col}`]}`}>
                  <f.Icon width={22} height={22} />
                </div>
                <h3 className={styles.fTitle}>{f.title}</h3>
                <p  className={styles.fDesc}>{f.desc}</p>
                <div className={styles.fCorner} aria-hidden />
              </Tilt>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.how}>
        <span className={styles.pill} data-sr>How it works</span>
        <h2 className={styles.howH} data-sr>Up and running in minutes</h2>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className={styles.step} data-sr style={{ '--delay':`${i*130}ms` }}>
                <div className={styles.stepNum}>{s.n}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p   className={styles.stepDesc}>{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && <div className={styles.stepLine} aria-hidden />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.btm} data-sr>
        <div className={styles.btmCard}>
          <div className={styles.btmO1} aria-hidden />
          <div className={styles.btmO2} aria-hidden />
          <div className={styles.btmRing} aria-hidden />
          <h2 className={styles.btmH}>Start your financial journey today</h2>
          <p  className={styles.btmP}>Create a free account in under 60 seconds. No card required.</p>
          <Mag to="/register" className={`btn btn-primary ${styles.btmBtn}`} s={.35}>
            Create Free Account →
          </Mag>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span className={styles.fBrand}><IconBrandLogo size={15}/> FinanceOS</span>
        <span className={styles.fCopy}>© {new Date().getFullYear()} FinanceOS</span>
        <div className={styles.fLinks}>
          <Link to="/login"    className={styles.fLink}>Sign In</Link>
          <Link to="/register" className={styles.fLink}>Register</Link>
        </div>
      </footer>
    </div>
  );
}
