import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const TrendUpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const PieChartIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
  </svg>
);

const ZapIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const ShieldIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const TagIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" x2="7.01" y1="7" y2="7"/>
  </svg>
);

const STATS = [
  { value: '10K+', label: 'Active Users' },
  { value: '2M+',  label: 'Transactions Tracked' },
  { value: '98%',  label: 'Satisfaction Rate' },
  { value: '50+',  label: 'Categories' },
];

const STEPS = [
  {
    num: '01',
    title: 'Track',
    desc: 'Log income and expenses effortlessly with smart categorization. No spreadsheets needed.',
  },
  {
    num: '02',
    title: 'Analyze',
    desc: 'Discover patterns in your spending with powerful interactive charts and reports.',
  },
  {
    num: '03',
    title: 'Grow',
    desc: 'Make informed decisions to build savings and achieve your financial goals faster.',
  },
];

const FEATURES = [
  {
    Icon: PieChartIcon,
    iconClass: styles.iconPurple,
    title: 'Smart Analytics',
    desc: 'Visualize your spending patterns with interactive charts. Understand exactly where your money goes at a glance.',
  },
  {
    Icon: ZapIcon,
    iconClass: styles.iconGreen,
    title: 'Real-time Tracking',
    desc: 'Log transactions instantly and see your balance update in real time across all categories and time periods.',
  },
  {
    Icon: ShieldIcon,
    iconClass: styles.iconBlue,
    title: 'Secure & Private',
    desc: 'Bank-grade JWT authentication keeps your financial data safe, private, and fully under your control.',
  },
  {
    Icon: TagIcon,
    iconClass: styles.iconRose,
    title: 'Smart Categories',
    desc: 'Automatic expense categorization with custom tags. Filter, search, and export your full transaction history.',
  },
];

const CHART_BARS = [38, 62, 44, 78, 52, 91, 68, 84, 57, 95, 72, 100];

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.orb3} aria-hidden="true" />

      {/* ── Navbar ── */}
      <nav className={styles.navbar} aria-label="Main navigation">
        <div className={styles.navInner}>
          <div className={styles.navLogo}>
            <TrendUpIcon />
            <span>FinanceOS</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
          </div>
          <div className={styles.navActions}>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-cta btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>Smart Finance Management</div>

        <h1 className={styles.heroTitle}>
          Take Control of Your<br />
          <span className={styles.heroGradient}>Financial Future</span>
        </h1>

        <p className={styles.heroSubtitle}>
          Track income, analyze spending, and build wealth with FinanceOS —
          the intelligent finance dashboard built for modern life.
        </p>

        <div className={styles.heroCtas}>
          <Link to="/register" className="btn btn-cta">Start for Free →</Link>
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
        </div>

        {/* Dashboard Preview */}
        <div className={styles.heroPreview}>
          <div className={styles.previewCard}>
            <div className={styles.previewBar}>
              <div className={styles.previewDots} aria-hidden="true">
                <span /><span /><span />
              </div>
              <span className={styles.previewLabel}>FinanceOS — Dashboard</span>
            </div>

            <div className={styles.previewKpis}>
              <div className={styles.previewKpi}>
                <span className={styles.previewKpiTitle}>Total Balance</span>
                <span className={`${styles.previewKpiValue} ${styles.valuePurple}`}>R 48,230</span>
              </div>
              <div className={styles.previewKpi}>
                <span className={styles.previewKpiTitle}>Income</span>
                <span className={`${styles.previewKpiValue} ${styles.valueGreen}`}>R 12,500</span>
              </div>
              <div className={styles.previewKpi}>
                <span className={styles.previewKpiTitle}>Expenses</span>
                <span className={`${styles.previewKpiValue} ${styles.valueRed}`}>R 4,830</span>
              </div>
              <div className={styles.previewKpi}>
                <span className={styles.previewKpiTitle}>Savings Rate</span>
                <span className={`${styles.previewKpiValue} ${styles.valuePurple}`}>61.4%</span>
              </div>
            </div>

            <div className={styles.previewChartArea}>
              <span className={styles.previewChartLabel}>Cash Flow — Last 12 Months</span>
              <div className={styles.previewChartBars} role="img" aria-label="Cash flow chart">
                {CHART_BARS.map((h, i) => (
                  <div
                    key={i}
                    className={`${styles.previewChartBar} ${i % 3 === 0 ? styles.barGreen : ''}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className={styles.statsRow} aria-label="Platform statistics">
        {STATS.map(({ value, label }) => (
          <div key={label} className={styles.statItem}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── How it works ── */}
      <section id="how-it-works" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Simple Process</span>
          <h2 className={styles.sectionTitle}>How FinanceOS Works</h2>
          <p className={styles.sectionDesc}>Three steps to complete financial clarity.</p>
        </div>
        <div className={styles.steps}>
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} className={styles.step}>
              <span className={styles.stepNum}>{num}</span>
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Features</span>
          <h2 className={styles.sectionTitle}>Everything You Need</h2>
          <p className={styles.sectionDesc}>Powerful tools to manage your finances with confidence.</p>
        </div>
        <div className={styles.bento}>
          {FEATURES.map(({ Icon, iconClass, title, desc }) => (
            <div key={title} className={`glass-card ${styles.bentoCard}`}>
              <div className={`${styles.bentoIcon} ${iconClass}`}>
                <Icon size={22} />
              </div>
              <h3 className={styles.bentoTitle}>{title}</h3>
              <p className={styles.bentoDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2>Ready to take control?</h2>
          <p>Join thousands of users already managing their finances smarter with FinanceOS.</p>
          <Link to="/register" className="btn btn-cta">Start for Free — No Credit Card Needed</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <TrendUpIcon />
          <span>FinanceOS</span>
        </div>
        <span className={styles.footerCopy}>© 2026 FinanceOS. All rights reserved.</span>
        <div className={styles.footerLinks}>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Get Started</Link>
        </div>
      </footer>
    </div>
  );
}
