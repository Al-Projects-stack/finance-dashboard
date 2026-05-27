import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  IconBrandLogo, IconTrendUp, IconArrows, IconWallet, IconPercent,
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
   CURSOR AURORA  (updates CSS vars, drawn in CSS)
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
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
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
];

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  useReveal();
  const heroRef = useRef(null);
  const mockRef = useRef(null);

  /* Hero mouse → 3-D mockup parallax */
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

      {/* ─── NAV ─── */}
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

      {/* ─── HERO ─── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.grid}   aria-hidden />
        <div className={styles.aurora} aria-hidden />

        <div className={styles.badge}>
          <span className={styles.dot} />
          Free forever, no credit card required
        </div>

        <h1 className={styles.h1}>
          <Split text="Your finances,"    delay={80}  cls={styles.line1} />
          <br />
          <Split text="finally mastered." delay={520} cls={styles.line2} />
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

          {/* floating status badges */}
          <div className={`${styles.fl} ${styles.fl1}`}>
            <span style={{ background:'#10b981' }} className={styles.flDot}/> +R 32 000 Salary
          </div>
          <div className={`${styles.fl} ${styles.fl2}`}>
            <span style={{ background:'#c084fc' }} className={styles.flDot}/> 55.6% Saved
          </div>
          <div className={`${styles.fl} ${styles.fl3}`}>
            <span style={{ background:'#22d3ee' }} className={styles.flDot}/> 📈 Cash Flow Up
          </div>

          <div className={styles.mockCard} ref={mockRef}>
            {/* title bar */}
            <div className={styles.titleBar}>
              <span className={`${styles.tDot} ${styles.tRed}`}   />
              <span className={`${styles.tDot} ${styles.tYellow}`}/>
              <span className={`${styles.tDot} ${styles.tGreen}`} />
              <span className={styles.titleBarLabel}>FinanceOS — Dashboard</span>
            </div>
            {/* kpis */}
            <div className={styles.mkpis}>
              {[['Balance','R 48 500','#c084fc'],['Income','R 32 000','#10b981'],
                ['Expenses','R 14 200','#f43f5e'],['Savings','55.6%','#22d3ee']
              ].map(([l,v,c]) => (
                <div key={l} className={styles.mkpi}>
                  <span className={styles.mkpiL}>{l}</span>
                  <span className={styles.mkpiV} style={{color:c}}>{v}</span>
                </div>
              ))}
            </div>
            {/* chart */}
            <div className={styles.mchart}>
              <span className={styles.mchartL}>Monthly Cash Flow</span>
              <div className={styles.mbars}>
                {[42,68,52,84,60,78,65,90,70,82,58,75].map((h,i) => (
                  <div key={i} className={styles.mbarT}>
                    <div className={styles.mbar} style={{height:`${h}%`,'--i':i}} />
                  </div>
                ))}
              </div>
            </div>
            {/* rows */}
            <div className={styles.mrows}>
              {[['Income','Salary','+R 32 000','#10b981'],
                ['Food','Groceries','−R 1 850','#f43f5e'],
                ['Entertainment','Netflix','−R 199','#f43f5e'],
              ].map(([cat,name,amt,c]) => (
                <div key={name} className={styles.mrow}>
                  <span className={styles.mcat}>{cat}</span>
                  <span className={styles.mname}>{name}</span>
                  <span className={styles.mamt} style={{color:c}}>{amt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
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

      {/* ─── BOTTOM CTA ─── */}
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

      {/* ─── FOOTER ─── */}
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
