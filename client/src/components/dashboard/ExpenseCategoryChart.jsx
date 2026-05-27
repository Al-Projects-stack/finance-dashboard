import { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './Chart.module.css';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

/* Skill: Donut for part-to-whole — max 5-6 contrasting colors, large slices first */
const PALETTE = [
  '#8b5cf6', // purple
  '#22c55e', // green
  '#f59e0b', // amber
  '#60a5fa', // blue
  '#f43f5e', // rose
  '#34d399', // emerald
  '#a78bfa', // violet light
  '#fb923c', // orange
  '#e879f9', // fuchsia
  '#38bdf8', // sky
];

export default function ExpenseCategoryChart({ categories = [] }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !categories.length) return;

    chartRef.current?.destroy();

    /* Skill: large slices first */
    const sorted = [...categories].sort((a, b) => b.total - a.total);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: sorted.map((c) => c.category),
        datasets: [{
          data: sorted.map((c) => c.total),
          backgroundColor: PALETTE.slice(0, sorted.length),
          borderColor: '#020617',
          borderWidth: 3,
          hoverOffset: 10,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#94a3b8',
              font: { size: 11, family: "'IBM Plex Sans', sans-serif" },
              boxWidth: 10,
              borderRadius: 4,
              padding: 14,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(4,2,14,0.96)',
            titleColor: '#c084fc',
            bodyColor: '#f8fafc',
            borderColor: 'rgba(139,92,246,0.32)',
            borderWidth: 1,
            padding: 14,
            cornerRadius: 10,
            titleFont: { family: "'IBM Plex Sans', sans-serif", weight: '600', size: 12 },
            bodyFont:  { family: "'IBM Plex Sans', sans-serif", size: 13 },
            callbacks: {
              label: (ctx) => {
                const total = ctx.chart.getDatasetMeta(0).total ?? 1;
                return ` R${ctx.raw.toLocaleString('en-ZA')} (${((ctx.raw / total) * 100).toFixed(1)}%)`;
              },
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [categories]);

  return (
    <div className={`glass-card ${styles.chartCard}`}>
      <h3 className="section-title">Expense Breakdown</h3>
      <div className={`${styles.chartWrap} ${styles.doughnutWrap}`}>
        {categories.length
          ? <canvas ref={canvasRef} />
          : <p className={styles.noData}>No expenses yet</p>}
      </div>
    </div>
  );
}
