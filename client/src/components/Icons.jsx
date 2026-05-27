/* ──────────────────────────────────────────────────────────
   FinanceOS Icon Library, inline SVG, zero deps
   All icons accept width / height / className props.
────────────────────────────────────────────────────────── */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* Layout / nav */
export const IconGrid = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconArrows = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <path d="M7 16V4m0 0L3 8m4-4 4 4" />
    <path d="M17 8v12m0 0 4-4m-4 4-4-4" />
  </svg>
);

export const IconLogOut = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* KPI / finance */
export const IconWallet = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

export const IconTrendUp = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
);

export const IconTrendDown = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <polyline points="22,17 13.5,8.5 8.5,13.5 2,7" />
    <polyline points="16,17 22,17 22,11" />
  </svg>
);

export const IconPercent = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

export const IconPlus = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const IconFilter = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
  </svg>
);

export const IconEdit = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const IconTrash = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...props}>
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const IconX = (props) => (
  <svg viewBox="0 0 24 24" width={18} height={18} {...base} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6"  y1="6" x2="18" y2="18" />
  </svg>
);

export const IconChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...props}>
    <polyline points="15,18 9,12 15,6" />
  </svg>
);

export const IconChevronRight = (props) => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base} {...props}>
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

/* Brand logo mark */
export const IconBrandLogo = ({ size = 22, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" {...props}>
    <path d="M12 2L2 7l10 5 10-5-10-5z"
      stroke="url(#lg1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17l10 5 10-5"
      stroke="url(#lg1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
    <path d="M2 12l10 5 10-5"
      stroke="url(#lg1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
    <defs>
      <linearGradient id="lg1" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
    </defs>
  </svg>
);
