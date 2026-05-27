import { useEffect, useRef } from 'react';
import styles from './KPICard.module.css';

/* ── Animated count-up hook ──────────────────────────────── */
function useCountUp(target, duration = 900) {
  const ref = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!target) { el.textContent = '0'; return; }

    const start = performance.now();
    const tick  = (now) => {
      const t    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4); // quartic ease-out
      el.dataset.val = Math.round(ease * target);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return ref;
}

/* ── Number formatter (no currency symbol) ──────────────── */
const fmtNum = (n) =>
  new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(n);

/* ── Card config per colour ─────────────────────────────── */
const CFG = {
  purple: {
    gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    glow:     'rgba(139,92,246,0.18)',
    border:   'rgba(139,92,246,0.22)',
    iconBg:   'rgba(139,92,246,0.12)',
    iconBorder:'rgba(139,92,246,0.25)',
    color:    '#c084fc',
  },
  green: {
    gradient: 'linear-gradient(135deg,#059669,#10b981)',
    glow:     'rgba(16,185,129,0.15)',
    border:   'rgba(16,185,129,0.22)',
    iconBg:   'rgba(16,185,129,0.1)',
    iconBorder:'rgba(16,185,129,0.25)',
    color:    '#10b981',
  },
  red: {
    gradient: 'linear-gradient(135deg,#e11d48,#f43f5e)',
    glow:     'rgba(244,63,94,0.15)',
    border:   'rgba(244,63,94,0.22)',
    iconBg:   'rgba(244,63,94,0.1)',
    iconBorder:'rgba(244,63,94,0.25)',
    color:    '#f43f5e',
  },
  cyan: {
    gradient: 'linear-gradient(135deg,#0891b2,#22d3ee)',
    glow:     'rgba(6,182,212,0.15)',
    border:   'rgba(6,182,212,0.22)',
    iconBg:   'rgba(6,182,212,0.1)',
    iconBorder:'rgba(6,182,212,0.25)',
    color:    '#22d3ee',
  },
};

/* ── Component ─────────────────────────────────────────── */
export default function KPICard({
  title,
  value,
  Icon,
  color   = 'purple',
  format  = 'currency',
  trend,
}) {
  const cfg    = CFG[color] ?? CFG.purple;
  const numRef = useCountUp(value ?? 0);

  /* After count-up, format the final value as text */
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      const raw = Number(el.dataset.val);
      if (format === 'currency') el.textContent = fmtNum(raw);
      else if (format === 'percent') el.textContent = `${raw.toFixed(1)}%`;
      else el.textContent = raw;
    });

    observer.observe(el, { attributeFilter: ['data-val'] });
    return () => observer.disconnect();
  }, [format]);

  return (
    <div
      className={styles.card}
      style={{
        '--c-gradient': cfg.gradient,
        '--c-glow':     cfg.glow,
        '--c-border':   cfg.border,
        '--c-icon-bg':  cfg.iconBg,
        '--c-icon-bdr': cfg.iconBorder,
        '--c-value':    cfg.color,
      }}
    >
      {/* Top accent stripe */}
      <div className={styles.stripe} />

      {/* Corner glow */}
      <div className={styles.cornerOrb} />

      {/* Header row */}
      <div className={styles.header}>
        <span className={styles.label}>{title}</span>
        {Icon && (
          <span className={styles.iconWrap}>
            <Icon width={17} height={17} />
          </span>
        )}
      </div>

      {/* Value */}
      <div className={styles.valueRow}>
        {format === 'currency' && (
          <span className={styles.prefix}>R</span>
        )}
        <span
          className={styles.value}
          ref={numRef}
          data-val={value ?? 0}
        >
          {format === 'currency'  ? fmtNum(value ?? 0)
         : format === 'percent'  ? `${(value ?? 0).toFixed(1)}%`
         : (value ?? 0)}
        </span>
      </div>

      {/* Trend chip */}
      {trend != null && (
        <div className={`${styles.trend} ${trend >= 0 ? styles.up : styles.down}`}>
          {trend >= 0 ? '↑' : '↓'}&ensp;
          {Math.abs(trend).toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );
}
